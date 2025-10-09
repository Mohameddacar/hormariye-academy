import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/config/db';
import { progressTable, enrollmentsTable, usersTable, coursesTable } from '@/config/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, chapterId, isCompleted, timeSpent } = await request.json();

    if (!courseId || !chapterId) {
      return NextResponse.json({ error: 'Course ID and Chapter ID are required' }, { status: 400 });
    }

    // Get user ID from users table
    const userResult = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, user.primaryEmailAddress?.emailAddress))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult[0].id;

    // Check if user is enrolled in the course
    const enrollment = await db
      .select()
      .from(enrollmentsTable)
      .where(
        and(
          eq(enrollmentsTable.userId, userId),
          eq(enrollmentsTable.courseId, courseId)
        )
      )
      .limit(1);

    if (enrollment.length === 0) {
      return NextResponse.json({ error: 'User not enrolled in this course' }, { status: 400 });
    }

    // Update or create progress record
    const existingProgress = await db
      .select()
      .from(progressTable)
      .where(
        and(
          eq(progressTable.userId, userId),
          eq(progressTable.courseId, courseId),
          eq(progressTable.chapterId, chapterId)
        )
      )
      .limit(1);

    let progressRecord;
    if (existingProgress.length > 0) {
      // Update existing progress
      progressRecord = await db
        .update(progressTable)
        .set({
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
          timeSpent: timeSpent || existingProgress[0].timeSpent,
        })
        .where(eq(progressTable.id, existingProgress[0].id))
        .returning();
    } else {
      // Create new progress record
      progressRecord = await db
        .insert(progressTable)
        .values({
          userId,
          courseId,
          chapterId,
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
          timeSpent: timeSpent || 0,
        })
        .returning();
    }

    // Update enrollment progress
    if (isCompleted) {
      // Get course details to calculate total chapters
      const course = await db
        .select({ noOfChapters: coursesTable.noOfChapters })
        .from(coursesTable)
        .where(eq(coursesTable.id, courseId))
        .limit(1);

      if (course.length > 0) {
        // Count completed chapters
        const completedChapters = await db
          .select()
          .from(progressTable)
          .where(
            and(
              eq(progressTable.userId, userId),
              eq(progressTable.courseId, courseId),
              eq(progressTable.isCompleted, true)
            )
          );

        const progressPercentage = (completedChapters.length / course[0].noOfChapters) * 100;
        const isCourseCompleted = completedChapters.length === course[0].noOfChapters;

        // Update enrollment
        await db
          .update(enrollmentsTable)
          .set({
            progress: progressPercentage,
            isCompleted: isCourseCompleted,
          })
          .where(eq(enrollmentsTable.id, enrollment[0].id));
      }
    }

    return NextResponse.json(progressRecord[0]);
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    // Get user ID from users table
    const userResult = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, user.primaryEmailAddress?.emailAddress))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult[0].id;

    let query = db
      .select()
      .from(progressTable)
      .where(eq(progressTable.userId, userId));

    if (courseId) {
      query = query.where(
        and(
          eq(progressTable.userId, userId),
          eq(progressTable.courseId, parseInt(courseId))
        )
      );
    }

    const progress = await query;

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
