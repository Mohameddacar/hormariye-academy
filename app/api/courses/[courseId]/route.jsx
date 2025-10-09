import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const courseCid = params.courseId;

    const course = await db
      .select({
        id: coursesTable.id,
        cid: coursesTable.cid,
        name: coursesTable.name,
        description: coursesTable.description,
        noOfChapters: coursesTable.noOfChapters,
        includeVideo: coursesTable.includeVideo,
        level: coursesTable.level,
        category: coursesTable.category,
        courseJson: coursesTable.courseJson,
        userEmail: coursesTable.userEmail,
        isPublished: coursesTable.isPublished,
        createdAt: coursesTable.createdAt,
      })
      .from(coursesTable)
      .where(eq(coursesTable.cid, courseCid))
      .limit(1);

    if (!course.length) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course[0]);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}