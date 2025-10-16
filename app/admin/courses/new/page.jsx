"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Youtube, 
  FileVideo, 
  Plus, 
  Trash2,
  ArrowLeft,
  Save
} from 'lucide-react';
import Link from 'next/link';

export default function NewCoursePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState({
    name: '',
    subtitle: '',
    description: '',
    category: '',
    subcategory: '',
    language: 'English (US)',
    primaryTopic: '',
    level: 'beginner',
    price: 0,
    isFree: true,
    includeVideo: true,
    videoSource: 'youtube', // 'youtube' or 'upload'
    youtubeUrl: '',
    videoUrl: '',
    bannerImageUrl: '',
    instructorName: '',
    instructorBio: '',
    outcomes: '', // textarea, newline-delimited
    requirements: '', // textarea, newline-delimited
    targetAudience: '', // textarea, newline-delimited
    chapters: []
  });
  const [fileToUpload, setFileToUpload] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [bulkUploading, setBulkUploading] = useState(false);

  const [newChapter, setNewChapter] = useState({
    section: '',
    name: '',
    description: '',
    duration: '',
    videoSource: 'youtube',
    youtubeUrl: '',
    videoUrl: '',
    content: ''
  });
  const [chapterFile, setChapterFile] = useState(null);

  const uploadChapterFile = async (file) => {
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    const up = await fetch('/api/upload', { method: 'POST', body: form });
    if (up.ok) {
      const { url } = await up.json();
      setNewChapter((p) => ({ ...p, videoUrl: url }));
    }
  };

  const bulkUploadChapters = async (files) => {
    if (!files || files.length === 0) return;
    setBulkUploading(true);
    try {
      const created = [];
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append('file', file);
        const up = await fetch('/api/upload', { method: 'POST', body: form });
        if (up.ok) {
          const { url } = await up.json();
          created.push({
            id: Date.now() + Math.random(),
            name: file.name.replace(/\.[^.]+$/, ''),
            description: '',
            duration: '',
            videoSource: 'upload',
            youtubeUrl: '',
            videoUrl: url,
            content: ''
          });
        }
      }
      if (created.length) {
        setCourseData((prev) => ({ ...prev, chapters: [...prev.chapters, ...created] }));
      }
    } finally {
      setBulkUploading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addChapter = () => {
    if (newChapter.name && newChapter.description) {
      setCourseData(prev => ({
        ...prev,
        chapters: [...prev.chapters, { ...newChapter, id: Date.now() }]
      }));
      setNewChapter({
        name: '',
        description: '',
        duration: '',
        videoUrl: '',
        content: ''
      });
    }
  };

  const removeChapter = (chapterId) => {
    setCourseData(prev => ({
      ...prev,
      chapters: prev.chapters.filter(chapter => chapter.id !== chapterId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadUrl = '';
      if (courseData.videoSource === 'upload' && fileToUpload) {
        const form = new FormData();
        form.append('file', fileToUpload);
        const up = await fetch('/api/upload', { method: 'POST', body: form });
        if (!up.ok) throw new Error('Upload failed');
        const { url } = await up.json();
        uploadUrl = url;
      }

      let bannerUrl = courseData.bannerImageUrl;
      if (thumbnailFile) {
        const imgForm = new FormData();
        imgForm.append('file', thumbnailFile);
        const upImg = await fetch('/api/upload', { method: 'POST', body: imgForm });
        if (!upImg.ok) throw new Error('Image upload failed');
        const { url } = await upImg.json();
        bannerUrl = url;
      }

      // Basic validation per standard
      const name = (courseData.name || '').trim();
      const description = (courseData.description || '').trim();
      if (!name || !description) throw new Error('Course title and description are required');
      if (!Array.isArray(courseData.chapters) || courseData.chapters.length === 0) {
        throw new Error('At least one module/lesson is required');
      }
      const hasLessonContent = courseData.chapters.some(c => ((c.youtubeUrl && c.youtubeUrl.trim()) || (c.videoUrl && c.videoUrl.trim())));
      if (!hasLessonContent && !(courseData.youtubeUrl || uploadUrl)) {
        throw new Error('Provide at least one lesson video or URL');
      }

      // compute total duration from chapter durations (numbers in minutes in strings)
      const totalDurationMinutes = (courseData.chapters || []).reduce((total, ch) => {
        const m = String(ch.duration || '').match(/(\d+)/);
        const minutes = m ? parseInt(m[1]) : 0;
        return total + (Number.isFinite(minutes) ? minutes : 0);
      }, 0);

      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...courseData,
          videoUrl: uploadUrl || courseData.videoUrl,
          bannerImageUrl: bannerUrl,
          instructorName: courseData.instructorName,
          instructorBio: courseData.instructorBio,
          totalDurationMinutes,
          noOfChapters: courseData.chapters.length
        }),
      });

      if (response.ok) {
        router.push('/admin');
      } else {
        console.error('Error creating course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    const isAdmin = user?.primaryEmailAddress?.emailAddress === 'mohameddacarmohumed@gmail.com';
    if (!isAdmin) {
      router.replace('/workspace');
    }
  }, [isLoaded, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
                <p className="text-gray-600">Add a new course to Hormariye Academy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="chapters">Chapters</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Course Name *
                    </label>
                    <Input
                      placeholder="Enter course name"
                      value={courseData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Description *
                    </label>
                    <Textarea
                      placeholder="Enter course description"
                      value={courseData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Category *
                      </label>
                      <Input
                        placeholder="e.g., Web Development"
                        value={courseData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Difficulty Level *
                      </label>
                      <Select
                        value={courseData.level}
                        onValueChange={(value) => handleInputChange('level', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Price ($)
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={courseData.price}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                        disabled={courseData.isFree}
                      />
                    </div>

                    <div className="flex items-center space-x-2 mt-6">
                      <Switch
                        checked={courseData.isFree}
                        onCheckedChange={(checked) => handleInputChange('isFree', checked)}
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Free Course
                      </label>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Course Image/Thumbnail</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                      />
                      {courseData.bannerImageUrl && (
                        <p className="text-sm text-gray-500 mt-2">Current: {courseData.bannerImageUrl}</p>
                      )}
                    </div>
                  </div>

                  {/* Instructor Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Instructor Name</label>
                      <Input
                        placeholder="Your name"
                        value={courseData.instructorName}
                        onChange={(e) => handleInputChange('instructorName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Instructor Bio</label>
                      <Input
                        placeholder="Short profile"
                        value={courseData.instructorBio}
                        onChange={(e) => handleInputChange('instructorBio', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Video Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant={courseData.videoSource === 'youtube' ? 'default' : 'outline'}
                      onClick={() => handleInputChange('videoSource', 'youtube')}
                    >
                      <Youtube className="w-4 h-4 mr-2" />
                      YouTube
                    </Button>
                    <Button
                      type="button"
                      variant={courseData.videoSource === 'upload' ? 'default' : 'outline'}
                      onClick={() => handleInputChange('videoSource', 'upload')}
                    >
                      <FileVideo className="w-4 h-4 mr-2" />
                      Upload Video
                    </Button>
                  </div>

                  {courseData.videoSource === 'youtube' && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        YouTube URL
                      </label>
                      <Input
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={courseData.youtubeUrl}
                        onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                      />
                    </div>
                  )}

                  {courseData.videoSource === 'upload' && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload video files</p>
                      <p className="text-sm text-gray-500">MP4, MOV, AVI up to 2GB</p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
                        className="mt-4"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={courseData.includeVideo}
                      onCheckedChange={(checked) => handleInputChange('includeVideo', checked)}
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Include video content
                    </label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Chapters Tab */}
            <TabsContent value="chapters" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Chapters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
                    <h3 className="font-medium">Bulk Upload Videos (optional)</h3>
                    <p className="text-sm text-gray-600">Select multiple files or a folder to create chapters automatically.</p>
                    <div className="space-y-2">
                      <input type="file" accept="video/*" multiple onChange={(e)=> bulkUploadChapters(e.target.files)} />
                      {/* Some browsers support directory selection with these attributes */}
                      <input type="file" accept="video/*" webkitdirectory="" directory="" onChange={(e)=> bulkUploadChapters(e.target.files)} />
                    </div>
                    {bulkUploading && <p className="text-sm text-gray-500">Uploading...</p>}
                  </div>

                  {/* Add Chapter Form */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-medium">Add New Chapter</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder="Section title (e.g., Introduction)"
                        value={newChapter.section}
                        onChange={(e) => setNewChapter(prev => ({ ...prev, section: e.target.value }))}
                      />
                      <Input
                        placeholder="Module/Section name"
                        value={newChapter.name}
                        onChange={(e) => setNewChapter(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        placeholder="Duration (e.g., 30 minutes)"
                        value={newChapter.duration}
                        onChange={(e) => setNewChapter(prev => ({ ...prev, duration: e.target.value }))}
                      />
                    </div>
                    <Textarea
                      placeholder="Chapter description"
                      value={newChapter.description}
                      onChange={(e) => setNewChapter(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                    />
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <Button type="button" variant={newChapter.videoSource==='youtube' ? 'default':'outline'} onClick={()=>setNewChapter(p=>({...p, videoSource:'youtube'}))}><Youtube className="w-4 h-4 mr-2"/>YouTube</Button>
                        <Button type="button" variant={newChapter.videoSource==='upload' ? 'default':'outline'} onClick={()=>setNewChapter(p=>({...p, videoSource:'upload'}))}><FileVideo className="w-4 h-4 mr-2"/>Upload</Button>
                      </div>
                      {newChapter.videoSource==='youtube' ? (
                        <Input placeholder="Chapter YouTube URL" value={newChapter.youtubeUrl} onChange={(e)=>setNewChapter(p=>({...p, youtubeUrl:e.target.value}))} />
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Input placeholder="Chapter Video URL (uploaded)" value={newChapter.videoUrl} onChange={(e)=>setNewChapter(p=>({...p, videoUrl:e.target.value}))} />
                          <input
                            type="file"
                            accept="video/*"
                            onChange={async (e)=>{
                              const f = e.target.files?.[0] || null;
                              setChapterFile(f);
                              if (f) await uploadChapterFile(f);
                            }}
                          />
                        </div>
                      )}
                      <Input placeholder="Content type" value={newChapter.content} onChange={(e)=>setNewChapter(p=>({...p, content:e.target.value}))} />
                    </div>
                    <Button type="button" onClick={addChapter} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Chapter
                    </Button>
                  </div>

                  {/* Chapters List */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Chapters ({courseData.chapters.length})</h3>
                    {courseData.chapters.map((chapter, index) => (
                      <div key={chapter.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{chapter.name}</h4>
                            {chapter.section && (<p className="text-xs text-gray-500">Section: {chapter.section}</p>)}
                            <p className="text-sm text-gray-600">{chapter.description}</p>
                            <p className="text-xs text-gray-500">
                              {chapter.duration} • {chapter.content}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeChapter(chapter.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/admin">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Create Course
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
