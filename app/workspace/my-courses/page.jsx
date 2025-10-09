"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Users, Play, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MyCoursesPage() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch('/api/enrollments');
      if (response.ok) {
        const enrollments = await response.json();
        setEnrolledCourses(enrollments);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Learning</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Learning</h1>
        <Link href="/workspace/explore">
          <Button variant="outline">
            Explore More Courses
          </Button>
        </Link>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Enrolled Courses</h3>
          <p className="text-gray-500 mb-6">
            Start your learning journey by enrolling in courses
          </p>
          <Link href="/workspace/explore">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Browse Courses
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Continue Learning Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses
                .filter(course => course.progress < 100)
                .map((enrollment) => (
                  <Card key={enrollment.id} className="hover:shadow-lg transition-shadow duration-200">
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-blue-600" />
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{enrollment.course?.name}</CardTitle>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {enrollment.course?.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>{Math.round(enrollment.progress)}%</span>
                          </div>
                          <Progress 
                            value={enrollment.progress} 
                            className="h-2"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {enrollment.course?.noOfChapters} Chapters
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {enrollment.course?.level}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Link href={`/workspace/course/${enrollment.course?.cid}`} className="flex-1">
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                              <Play className="w-4 h-4 mr-2" />
                              Continue Learning
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* Completed Courses Section */}
          {enrolledCourses.some(course => course.progress === 100) && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Completed Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses
                  .filter(course => course.progress === 100)
                  .map((enrollment) => (
                    <Card key={enrollment.id} className="hover:shadow-lg transition-shadow duration-200">
                      <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 rounded-t-lg flex items-center justify-center">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{enrollment.course?.name}</CardTitle>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {enrollment.course?.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-center text-green-600 font-semibold">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Course Completed
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {enrollment.course?.noOfChapters} Chapters
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {enrollment.course?.level}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Link href={`/workspace/course/${enrollment.course?.cid}`} className="flex-1">
                              <Button variant="outline" className="w-full">
                                <ArrowRight className="w-4 h-4 mr-2" />
                                Review Course
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
