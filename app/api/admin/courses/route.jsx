import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = user.primaryEmailAddress?.emailAddress === 'mohameddacarmohumed@gmail.com';
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const courseData = await request.json();

    // Basic validation
    const name = (courseData.name || '').trim();
    const description = (courseData.description || '').trim();
    const category = (courseData.category || '').trim();
    const level = (courseData.level || '').trim();
    const includeVideo = Boolean(courseData.includeVideo);
    const isFree = Boolean(courseData.isFree);
    const price = isFree ? 0 : Number(courseData.price || 0);
    const videoSource = courseData.videoSource === 'upload' ? 'upload' : 'youtube';
    const youtubeUrl = (courseData.youtubeUrl || '').trim();
    const videoUrl = (courseData.videoUrl || '').trim();
    const chapters = Array.isArray(courseData.chapters) ? courseData.chapters : [];
    const noOfChapters = chapters.length;

    if (!name || !description || !category || !level) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!isFree && (!Number.isFinite(price) || price < 0)) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }

    if (includeVideo && videoSource === 'youtube' && youtubeUrl && !/^https?:\/\//i.test(youtubeUrl)) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Normalize chapters
    const normalizedChapters = chapters.map((c, idx) => ({
      id: c.id ?? idx + 1,
      name: (c.name || '').trim(),
      description: (c.description || '').trim(),
      duration: (c.duration || '').trim(),
      videoUrl: (c.videoUrl || '').trim(),
      youtubeUrl: (c.youtubeUrl || '').trim(),
      videoSource: c.videoSource === 'upload' ? 'upload' : (c.videoSource === 'youtube' ? 'youtube' : undefined),
      content: (c.content || '').trim(),
    })).filter(c => c.name && c.description);
    
    // Create course
    const course = await db
      .insert(coursesTable)
      .values({
        cid: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        description,
        category,
        level,
        noOfChapters,
        includeVideo,
        isPublished: true,
        userEmail: user.primaryEmailAddress?.emailAddress,
        courseJson: {
          chapters: normalizedChapters,
          price,
          isFree,
          videoSource,
          youtubeUrl,
          videoUrl
        }
      })
      .returning();

    return NextResponse.json(course[0], { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = user.primaryEmailAddress?.emailAddress === 'mohameddacarmohumed@gmail.com';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const courses = await db.select().from(coursesTable).orderBy(coursesTable.createdAt);
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error('Error fetching courses (admin):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}