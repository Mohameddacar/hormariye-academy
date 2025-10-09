import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/config/db'
import { coursesTable } from '@/config/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const isAdmin = user.primaryEmailAddress?.emailAddress === 'mohameddacarmohumed@gmail.com'
    if (!isAdmin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const id = Number(params.id)
    const result = await db.select().from(coursesTable).where(eq(coursesTable.id, id)).limit(1)
    if (!result.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(result[0])
  } catch (e) {
    console.error('GET admin course failed:', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const isAdmin = user.primaryEmailAddress?.emailAddress === 'mohameddacarmohumed@gmail.com'
    if (!isAdmin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const body = await request.json()

    const name = (body.name || '').trim()
    const description = (body.description || '').trim()
    const category = (body.category || '').trim()
    const level = (body.level || '').trim()
    const includeVideo = Boolean(body.includeVideo)
    const isFree = Boolean(body.isFree)
    const price = isFree ? 0 : Number(body.price || 0)
    const videoSource = body.videoSource === 'upload' ? 'upload' : 'youtube'
    const youtubeUrl = (body.youtubeUrl || '').trim()
    const videoUrl = (body.videoUrl || '').trim()
    const chapters = Array.isArray(body.chapters) ? body.chapters : []
    const normalizedChapters = chapters.map((c, idx) => ({
      id: c.id ?? idx + 1,
      name: (c.name || '').trim(),
      description: (c.description || '').trim(),
      duration: (c.duration || '').trim(),
      videoUrl: (c.videoUrl || '').trim(),
      youtubeUrl: (c.youtubeUrl || '').trim(),
      videoSource: c.videoSource === 'upload' ? 'upload' : (c.videoSource === 'youtube' ? 'youtube' : undefined),
      content: (c.content || '').trim(),
    })).filter(c => c.name && c.description)

    if (!name || !description || !category || !level) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const id = Number(params.id)
    const [updated] = await db
      .update(coursesTable)
      .set({
        name,
        description,
        category,
        level,
        noOfChapters: normalizedChapters.length,
        includeVideo,
        courseJson: {
          chapters: normalizedChapters,
          price,
          isFree,
          videoSource,
          youtubeUrl,
          videoUrl,
        },
      })
      .where(eq(coursesTable.id, id))
      .returning()

    return NextResponse.json(updated)
  } catch (e) {
    console.error('PUT admin course failed:', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const isAdmin = user.primaryEmailAddress?.emailAddress === 'mohameddacarmohumed@gmail.com'
    if (!isAdmin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const id = Number(params.id)
    const [deleted] = await db.delete(coursesTable).where(eq(coursesTable.id, id)).returning()
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('DELETE admin course failed:', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


