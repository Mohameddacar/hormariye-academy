import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      .where(eq(coursesTable.userEmail, user.primaryEmailAddress?.emailAddress))
      .orderBy(coursesTable.createdAt);

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
