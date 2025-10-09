import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const courses = await db
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
        createdAt: coursesTable.createdAt,
      })
      .from(coursesTable)
      .orderBy(coursesTable.createdAt);

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching all courses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
