import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/config/db';
import { enrollmentsTable, coursesTable, usersTable } from '@/config/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get course by CID
    const courseResult = await db
      .select({ id: coursesTable.id })
      .from(coursesTable)
      .where(eq(coursesTable.cid, params.courseId))
      .limit(1);

    if (courseResult.length === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const courseId = courseResult[0].id;

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
    console.error('Error enrolling in course:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
