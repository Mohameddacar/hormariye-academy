"use client";
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Upload, Youtube, FileVideo, Plus, Trash2, ArrowLeft, Save, Trash } from 'lucide-react'

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fileToUpload, setFileToUpload] = useState(null)
  const [courseData, setCourseData] = useState({
    name: '', description: '', category: '', level: 'beginner',
    price: 0, isFree: true, includeVideo: true, videoSource: 'youtube', youtubeUrl: '', videoUrl: '',
    chapters: []
  })
  const [newChapter, setNewChapter] = useState({ section: '', name: '', description: '', duration: '', videoSource: 'youtube', youtubeUrl: '', videoUrl: '', content: '' })
  const [chapterFile, setChapterFile] = useState(null)
  const [bulkUploading, setBulkUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const uploadChapterFile = async (file) => {
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    const up = await fetch('/api/upload', { method: 'POST', body: form })
    if (up.ok) {
      const { url } = await up.json()
      setNewChapter((p)=>({ ...p, videoUrl: url }))
    }
  }

  const bulkUploadChapters = async (files) => {
    if (!files || files.length === 0) return
    setBulkUploading(true)
    try {
      const created = []
      for (const file of Array.from(files)) {
        const form = new FormData()
        form.append('file', file)
        const up = await fetch('/api/upload', { method: 'POST', body: form })
        if (up.ok) {
          const { url } = await up.json()
          created.push({
            id: Date.now() + Math.random(),
            name: file.name.replace(/\.[^.]+$/, ''),
            description: '',
            duration: '',
            videoSource: 'upload',
            youtubeUrl: '',
            videoUrl: url,
            content: ''
          })
        }
      }
      if (created.length) {
        setCourseData((prev) => ({ ...prev, chapters: [...prev.chapters, ...created] }))
      }
    } finally {
      setBulkUploading(false)
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/courses/${params.id}`)
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        const cj = data.courseJson || {}
        setCourseData({
          name: data.name,
          description: data.description,
          category: data.category,
          level: data.level,
          price: cj.price || 0,
          isFree: cj.isFree ?? true,
          includeVideo: data.includeVideo,
          videoSource: cj.videoSource || 'youtube',
          youtubeUrl: cj.youtubeUrl || '',
          videoUrl: cj.videoUrl || '',
          chapters: cj.chapters || []
        })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [params.id])

  const handleInputChange = (field, value) => setCourseData(prev => ({ ...prev, [field]: value }))
  const addChapter = () => {
    if (!newChapter.name || !newChapter.description) return
    setCourseData(prev => ({ ...prev, chapters: [...prev.chapters, { ...newChapter, id: Date.now() }] }))
    setNewChapter({ name: '', description: '', duration: '', videoUrl: '', content: '' })
  }
  const removeChapter = (chapterId) => setCourseData(prev => ({ ...prev, chapters: prev.chapters.filter(c => c.id !== chapterId) }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      let uploadUrl = ''
      if (courseData.videoSource === 'upload' && fileToUpload) {
        const form = new FormData()
        form.append('file', fileToUpload)
        const up = await fetch('/api/upload', { method: 'POST', body: form })
        if (!up.ok) throw new Error('Upload failed')
        const { url } = await up.json()
        uploadUrl = url
      }

      const res = await fetch(`/api/admin/courses/${params.id}` , {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...courseData, videoUrl: uploadUrl || courseData.videoUrl })
      })
      if (res.ok) router.push('/admin')
    } catch (e) {
      console.error('save failed', e)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    const confirm = window.confirm('Delete this course? This will remove enrollments and progress.');
    if (!confirm) return;
    try {
      setDeleteError('')
      setDeleting(true)
      const res = await fetch(`/api/admin/courses/${params.id}`, { method: 'DELETE' })
      if (res.ok) {
        window.alert('Course deleted successfully')
        router.push('/admin')
      } else {
        let msg = 'Delete failed'
        try { msg = (await res.json())?.error || msg } catch {}
        setDeleteError(msg)
        console.error('delete failed')
      }
    } catch (e) {
      setDeleteError('Delete failed. Please try again.')
      console.error('delete failed', e)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return (<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div>)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2"/>Back to Admin</Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
              <p className="text-gray-600">Update course details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {deleteError && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-700">
            {deleteError}
          </div>
        )}
        <form onSubmit={handleSave} className="space-y-6">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="chapters">Chapters</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Course Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Course name" value={courseData.name} onChange={(e)=>handleInputChange('name', e.target.value)} />
                  <Textarea placeholder="Description" value={courseData.description} onChange={(e)=>handleInputChange('description', e.target.value)} rows={4} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Category" value={courseData.category} onChange={(e)=>handleInputChange('category', e.target.value)} />
                    <Select value={courseData.level} onValueChange={(v)=>handleInputChange('level', v)}>
                      <SelectTrigger><SelectValue placeholder="Select level"/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input type="number" placeholder="Price" value={courseData.price} onChange={(e)=>handleInputChange('price', parseFloat(e.target.value))} disabled={courseData.isFree} />
                    <div className="flex items-center space-x-2 mt-1">
                      <Switch checked={courseData.isFree} onCheckedChange={(c)=>handleInputChange('isFree', c)} />
                      <span>Free Course</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Video Content</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Button type="button" variant={courseData.videoSource === 'youtube' ? 'default':'outline'} onClick={()=>handleInputChange('videoSource','youtube')}><Youtube className="w-4 h-4 mr-2"/>YouTube</Button>
                    <Button type="button" variant={courseData.videoSource === 'upload' ? 'default':'outline'} onClick={()=>handleInputChange('videoSource','upload')}><FileVideo className="w-4 h-4 mr-2"/>Upload Video</Button>
                  </div>
                  {courseData.videoSource === 'youtube' && (
                    <Input placeholder="https://www.youtube.com/watch?v=..." value={courseData.youtubeUrl} onChange={(e)=>handleInputChange('youtubeUrl', e.target.value)} />
                  )}
                  {courseData.videoSource === 'upload' && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload video files</p>
                      <input type="file" accept="video/*" onChange={(e)=>setFileToUpload(e.target.files?.[0]||null)} className="mt-4" />
                      {courseData.videoUrl && <p className="text-sm text-gray-500 mt-2">Current: {courseData.videoUrl}</p>}
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Switch checked={courseData.includeVideo} onCheckedChange={(c)=>handleInputChange('includeVideo', c)} />
                    <span>Include video content</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chapters" className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Course Chapters</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
                    <h3 className="font-medium">Bulk Upload Videos (optional)</h3>
                    <p className="text-sm text-gray-600">Select multiple video files to create chapters automatically.</p>
                    <input type="file" accept="video/*" multiple onChange={(e)=> bulkUploadChapters(e.target.files)} />
                    {bulkUploading && <p className="text-sm text-gray-500">Uploading...</p>}
                  </div>
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-medium">Add New Chapter</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input placeholder="Section title (e.g., Introduction)" value={newChapter.section} onChange={(e)=>setNewChapter(p=>({...p,section:e.target.value}))} />
                      <Input placeholder="Chapter name" value={newChapter.name} onChange={(e)=>setNewChapter(p=>({...p,name:e.target.value}))} />
                      <Input placeholder="Duration (e.g., 30 minutes)" value={newChapter.duration} onChange={(e)=>setNewChapter(p=>({...p,duration:e.target.value}))} />
                    </div>
                    <Textarea placeholder="Chapter description" rows={2} value={newChapter.description} onChange={(e)=>setNewChapter(p=>({...p,description:e.target.value}))} />
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <Button type="button" variant={newChapter.videoSource==='youtube' ? 'default':'outline'} onClick={()=>setNewChapter(p=>({...p, videoSource:'youtube'}))}><Youtube className="w-4 h-4 mr-2"/>YouTube</Button>
                        <Button type="button" variant={newChapter.videoSource==='upload' ? 'default':'outline'} onClick={()=>setNewChapter(p=>({...p, videoSource:'upload'}))}><FileVideo className="w-4 h-4 mr-2"/>Upload</Button>
                      </div>
                      {newChapter.videoSource==='youtube' ? (
                        <Input placeholder="Chapter YouTube URL" value={newChapter.youtubeUrl} onChange={(e)=>setNewChapter(p=>({...p,youtubeUrl:e.target.value}))} />
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Input placeholder="Chapter Video URL (uploaded)" value={newChapter.videoUrl} onChange={(e)=>setNewChapter(p=>({...p,videoUrl:e.target.value}))} />
                          <input type="file" accept="video/*" onChange={async (e)=>{ const f = e.target.files?.[0] || null; setChapterFile(f); if (f) await uploadChapterFile(f); }} />
                        </div>
                      )}
                      <Input placeholder="Content type" value={newChapter.content} onChange={(e)=>setNewChapter(p=>({...p,content:e.target.value}))} />
                    </div>
                    <Button type="button" onClick={addChapter} className="w-full"><Plus className="w-4 h-4 mr-2"/>Add Chapter</Button>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Chapters ({courseData.chapters.length})</h3>
                    {courseData.chapters.map((ch)=> (
                      <div key={ch.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{ch.name}</h4>
                            <p className="text-sm text-gray-600">{ch.description}</p>
                            <p className="text-xs text-gray-500">{ch.duration} • {ch.content}</p>
                          </div>
                          <Button type="button" variant="outline" size="sm" onClick={()=>removeChapter(ch.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4"/></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center space-x-4">
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700 disabled:opacity-70">
              <Trash className="w-4 h-4 mr-2"/>{deleting ? 'Deleting...' : 'Delete Course'}
            </Button>
            <Link href="/admin"><Button type="button" variant="outline">Cancel</Button></Link>
            <Button type="submit" disabled={saving}>{saving ? (<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>) : (<Save className="w-4 h-4 mr-2"/>)}Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  )
}


