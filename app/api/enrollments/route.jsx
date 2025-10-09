import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/config/db';
import { enrollmentsTable, coursesTable, usersTable } from '@/config/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Get enrollments with course details
    const enrollments = await db
      .select({
        id: enrollmentsTable.id,
        progress: enrollmentsTable.progress,
        enrolledAt: enrollmentsTable.enrolledAt,
        isCompleted: enrollmentsTable.isCompleted,
        course: {
          id: coursesTable.id,
          cid: coursesTable.cid,
          name: coursesTable.name,
          description: coursesTable.description,
          noOfChapters: coursesTable.noOfChapters,
          level: coursesTable.level,
          category: coursesTable.category,
        }
      })
      .from(enrollmentsTable)
      .leftJoin(coursesTable, eq(enrollmentsTable.courseId, coursesTable.id))
      .where(eq(enrollmentsTable.userId, userId))
      .orderBy(enrollmentsTable.enrolledAt);

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
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

    // Check if already enrolled
    const existingEnrollment = await db
      .select()
      .from(enrollmentsTable)
      .where(
        and(
          eq(enrollmentsTable.userId, userId),
          eq(enrollmentsTable.courseId, courseId)
        )
      )
      .limit(1);

    if (existingEnrollment.length > 0) {
      return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 });
    }

    // Create enrollment
    const enrollment = await db
      .insert(enrollmentsTable)
      .values({
        userId,
        courseId,
        progress: 0,
        isCompleted: false,
      })
      .returning();

    return NextResponse.json(enrollment[0], { status: 201 });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
