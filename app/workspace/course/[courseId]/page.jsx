"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Play, Clock, BookOpen, ArrowLeft, ArrowRight, Star, DollarSign, User, Calendar, Users, Award } from 'lucide-react';
import Link from 'next/link';
import PaymentModal from '@/components/payment/PaymentModal';
import { useEffect as useReactEffect } from 'react';

export default function CourseDetailPage() {
  const params = useParams();
  const [course, setCourse] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchCourse();
    checkEnrollment();
  }, [params.courseId]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${params.courseId}`);
      if (response.ok) {
        const courseData = await response.json();
        setCourse(courseData);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await fetch('/api/enrollments');
      if (response.ok) {
        const enrollments = await response.json();
        const enrolled = enrollments.some(enrollment => enrollment.course.cid === params.courseId);
        setIsEnrolled(enrolled);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (isFree) {
      // Free course - enroll directly
      setEnrolling(true);
      try {
        const response = await fetch(`/api/courses/${params.courseId}/enroll`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setIsEnrolled(true);
          alert('Successfully enrolled in the course!');
        } else {
          const errorData = await response.json();
          alert(`Failed to enroll: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error enrolling:', error);
        alert('An error occurred during enrollment.');
      } finally {
        setEnrolling(false);
      }
    } else {
      // Paid course - show payment modal
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = async () => {
    // After successful payment, enroll in the course
    setEnrolling(true);
    try {
      const response = await fetch(`/api/courses/${params.courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIsEnrolled(true);
      } else {
        const errorData = await response.json();
        alert(`Failed to enroll: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('An error occurred during enrollment.');
    } finally {
      setEnrolling(false);
    }
  };

  const markChapterComplete = async (chapterIndex) => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          chapterId: `chapter_${chapterIndex + 1}`,
          isCompleted: true,
          timeSpent: 30, // Default 30 minutes per chapter
        }),
      });

      if (response.ok) {
        const newProgress = ((chapterIndex + 1) / course.courseJson.chapters.length) * 100;
        setProgress(newProgress);
        console.log('Chapter marked as complete');
      } else {
        console.error('Failed to mark chapter as complete');
      }
    } catch (error) {
      console.error('Error marking chapter complete:', error);
    }
  };

  const nextChapter = () => {
    if (currentChapter < course.courseJson.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  // Resume from last watched chapter (stored in localStorage per user/course)
  useReactEffect(() => {
    const key = `progress:${course?.cid || params.courseId}`;
    if (course && isEnrolled) {
      const saved = localStorage.getItem(key);
      if (saved) {
        const idx = parseInt(saved, 10);
        if (!Number.isNaN(idx)) setCurrentChapter(Math.min(Math.max(idx, 0), chapters.length - 1));
      }
    }
  }, [course, isEnrolled]);

  useReactEffect(() => {
    if (isEnrolled && course) {
      const key = `progress:${course.cid || params.courseId}`;
      localStorage.setItem(key, String(currentChapter));
    }
  }, [currentChapter, isEnrolled, course]);

  // Hotkeys: Left/Right to navigate chapters
  useEffect(() => {
    const handler = (e) => {
      if (!isEnrolled) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextChapter();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevChapter();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isEnrolled, currentChapter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <Link href="/workspace">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const chapters = course.courseJson?.chapters || [];
  const currentChapterData = chapters[currentChapter];
  const coursePrice = course.courseJson?.price || 0;
  const isFree = course.courseJson?.isFree || coursePrice === 0;
  const outcomes = (course.courseJson?.outcomes || '').split(/\r?\n/).filter(Boolean);
  const requirements = (course.courseJson?.requirements || '').split(/\r?\n/).filter(Boolean);
  const targetAudience = (course.courseJson?.targetAudience || '').split(/\r?\n/).filter(Boolean);
  const courseVideoSource = course.courseJson?.videoSource;
  const courseYoutubeUrl = course.courseJson?.youtubeUrl;
  const courseVideoUrl = course.courseJson?.videoUrl;

  const chapterVideoUrl = currentChapterData?.videoUrl;
  const chapterYouTubeUrl = currentChapterData?.youtubeUrl;
  const chapterVideoSource = currentChapterData?.videoSource;

  const isYoutubeUrl = (url) => /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)/i.test(url || "");
  const toYouTubeEmbed = (url) => {
    if (!url) return "";
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i);
    const id = match?.[1];
    return id ? `https://www.youtube.com/embed/${id}` : "";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/workspace">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline">{course.category}</Badge>
                  <Badge variant={course.level === 'beginner' ? 'default' : course.level === 'intermediate' ? 'secondary' : 'destructive'}>
                    {course.level}
                  </Badge>
                  {isFree && <Badge className="bg-green-500">Free</Badge>}
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
                <p className="text-gray-600 text-lg">{course.description}</p>
              </div>
            </div>
            <div className="text-right">
              {isEnrolled ? (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Progress</div>
                  <div className="w-32">
                    <Progress value={progress} className="h-2" />
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{Math.round(progress)}% Complete</div>
                </div>
              ) : (
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {isFree ? 'Free' : `$${coursePrice}`}
                  </div>
                  <Button 
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Course Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Course Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Course Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Chapters</span>
                  <span className="font-medium">{chapters.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="font-medium">
                    {chapters.reduce((total, chapter) => {
                      const duration = chapter.duration?.match(/(\d+)/)?.[1] || 0;
                      return total + parseInt(duration);
                    }, 0)} hours
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Level</span>
                  <Badge variant={course.level === 'beginner' ? 'default' : course.level === 'intermediate' ? 'secondary' : 'destructive'}>
                    {course.level}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price</span>
                  <span className="font-medium text-green-600">
                    {isFree ? 'Free' : `$${coursePrice}`}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Chapter List - visible to all; gated for non-enrolled */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Curriculum
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {(() => {
                    // Group chapters by section
                    const groups = chapters.reduce((acc, ch, idx) => {
                      const key = ch.section || 'General';
                      if (!acc[key]) acc[key] = [];
                      acc[key].push({ chapter: ch, index: idx });
                      return acc;
                    }, {});
                    return Object.entries(groups).map(([section, items], sIdx) => {
                      const totalMins = items.reduce((t, it) => {
                        const m = String(it.chapter.duration || '').match(/(\d+)/);
                        const minutes = m ? parseInt(m[1]) : 0;
                        return t + (Number.isFinite(minutes) ? minutes : 0);
                      }, 0);
                      return (
                        <div key={sIdx} className="border-b">
                          <div className="px-4 py-2 bg-gray-100 text-sm font-semibold flex items-center justify-between">
                            <span>{section}</span>
                            <span className="text-gray-600">{items.length} lectures • {totalMins} min</span>
                          </div>
                          {items.map(({ chapter, index }) => (
                            <div
                              key={index}
                              className={`p-4 cursor-pointer hover:bg-gray-50 ${index === currentChapter ? 'bg-blue-50' : ''}`}
                              onClick={() => {
                                if (!isEnrolled) {
                                  handleEnroll();
                                  return;
                                }
                                setCurrentChapter(index);
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-sm">{chapter.chapterName || chapter.name}</h4>
                                  <p className="text-xs text-gray-500">{chapter.duration}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {isEnrolled ? (
                                    <>
                                      {index < currentChapter && (<CheckCircle className="w-4 h-4 text-green-500" />)}
                                      {index === currentChapter && (<Play className="w-4 h-4 text-blue-500" />)}
                                    </>
                                  ) : (
                                    <Badge variant="outline">Enroll to watch</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    });
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {!isEnrolled ? (
              /* Course Preview - Not Enrolled */
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Course Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {course.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h3 className="font-semibold">{chapters.length} Chapters</h3>
                        <p className="text-sm text-gray-600">Comprehensive content</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h3 className="font-semibold">
                          {chapters.reduce((total, chapter) => {
                            const duration = chapter.duration?.match(/(\d+)/)?.[1] || 0;
                            return total + parseInt(duration);
                          }, 0)} Hours
                        </h3>
                        <p className="text-sm text-gray-600">Total duration</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h3 className="font-semibold">{course.level}</h3>
                        <p className="text-sm text-gray-600">Difficulty level</p>
                      </div>
                    </div>

                    {/* Outcomes & Requirements */}
                    {(outcomes.length > 0 || requirements.length > 0 || targetAudience.length > 0) && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {outcomes.length > 0 && (
                          <div>
                            <h3 className="text-xl font-semibold mb-3">What you'll learn</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                              {outcomes.map((o, i) => (<li key={i}>{o}</li>))}
                            </ul>
                          </div>
                        )}
                        {requirements.length > 0 && (
                          <div>
                            <h3 className="text-xl font-semibold mb-3">Requirements</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                              {requirements.map((r, i) => (<li key={i}>{r}</li>))}
                            </ul>
                          </div>
                        )}
                        {targetAudience.length > 0 && (
                          <div>
                            <h3 className="text-xl font-semibold mb-3">Who this course is for</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                              {targetAudience.map((t, i) => (<li key={i}>{t}</li>))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {chapters.slice(0, 6).map((chapter, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-700">{chapter.chapterName || chapter.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-center pt-6">
                      <Button 
                        onClick={handleEnroll}
                        disabled={enrolling}
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {enrolling ? 'Enrolling...' : `Enroll Now ${isFree ? 'for Free' : `for $${coursePrice}`}`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Course Content - Enrolled */
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {currentChapter + 1}. {currentChapterData?.chapterName || currentChapterData?.name}
                      </CardTitle>
                      <p className="text-gray-600 flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {currentChapterData?.duration}
                      </p>
                    </div>
                    <Button
                      onClick={() => markChapterComplete(currentChapter)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Video Section */}
                    {course.includeVideo && (
                      <div className="bg-gray-100 rounded-lg p-4 md:p-6 lg:p-8">
                        {(() => {
                          // Decide which source to use (chapter-level preferred)
                          let useYouTube = false;
                          let sourceUrl = '';

                          if (chapterVideoSource === 'youtube' && chapterYouTubeUrl) {
                            useYouTube = true;
                            sourceUrl = chapterYouTubeUrl;
                          } else if (chapterVideoSource === 'upload' && chapterVideoUrl) {
                            useYouTube = false;
                            sourceUrl = chapterVideoUrl;
                          } else if (chapterYouTubeUrl) {
                            useYouTube = true;
                            sourceUrl = chapterYouTubeUrl;
                          } else if (chapterVideoUrl) {
                            useYouTube = isYoutubeUrl(chapterVideoUrl);
                            sourceUrl = chapterVideoUrl;
                          } else if (courseVideoSource === 'upload' && courseVideoUrl) {
                            useYouTube = false;
                            sourceUrl = courseVideoUrl;
                          } else if (courseYoutubeUrl) {
                            useYouTube = true;
                            sourceUrl = courseYoutubeUrl;
                          }

                          if (!sourceUrl) {
                            return (
                              <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <Play className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Video Lesson</h3>
                                <p className="text-gray-600">No video provided for this chapter.</p>
                              </div>
                            );
                          }
                          if (useYouTube || isYoutubeUrl(sourceUrl)) {
                            const embed = toYouTubeEmbed(sourceUrl);
                            return (
                              <div className="aspect-video w-full overflow-hidden rounded-md">
                                <iframe
                                  src={embed}
                                  title="YouTube video player"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  referrerPolicy="strict-origin-when-cross-origin"
                                  allowFullScreen
                                  className="h-full w-full border-0"
                                />
                              </div>
                            );
                          }
                          const guessType = (url) => {
                            if (/\.mp4($|\?)/i.test(url)) return 'video/mp4';
                            if (/\.webm($|\?)/i.test(url)) return 'video/webm';
                            if (/\.ogg($|\?)/i.test(url)) return 'video/ogg';
                            return undefined;
                          };
                          const type = guessType(sourceUrl);
                          return (
                            <div className="aspect-video w-full overflow-hidden rounded-md bg-black">
                              <video
                                key={sourceUrl}
                                controls
                                playsInline
                                onEnded={nextChapter}
                                className="h-full w-full"
                                src={type ? undefined : sourceUrl}
                              >
                                {/* Use source element when a MIME type can be inferred */}
                                {type && <source src={sourceUrl} type={type} />}
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Topics Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">What You'll Learn</h3>
                      <div className="space-y-3">
                        {currentChapterData?.topics?.map((topic, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-700">{topic}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chapter Content */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Chapter Content</h3>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          {currentChapterData?.content || 'No script/content provided for this chapter.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation - Only for enrolled users */}
            {isEnrolled && (
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={prevChapter}
                  disabled={currentChapter === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <div className="text-sm text-gray-500">
                  Chapter {currentChapter + 1} of {chapters.length}
                </div>
                
                <Button
                  onClick={nextChapter}
                  disabled={currentChapter === chapters.length - 1}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        course={course}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}