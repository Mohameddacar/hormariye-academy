"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState, useEffect } from 'react'
import AddNewCourseDialog from './AddNewCourseDialog';
import { BookOpen, Clock, Users, Play, Settings, Compass } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

const CourseList = () => {
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isLoaded } = useUser();
    const isAdmin = user?.primaryEmailAddress?.emailAddress === 'mohameddacarmohumed@gmail.com';

    useEffect(() => {
        if (!isLoaded) return;
        fetchCourses();
    }, [isLoaded, isAdmin]);

    const fetchCourses = async () => {
        try {
            if (isAdmin) {
                const response = await fetch('/api/courses');
                if (response.ok) {
                    const courses = await response.json();
                    setCourseList(courses);
                }
            } else {
                const response = await fetch('/api/enrollments');
                if (response.ok) {
                    const enrollments = await response.json();
                    const courses = enrollments.map((e) => ({ ...e.course, progress: e.progress }));
                    setCourseList(courses);
                }
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseGenerated = () => {
        fetchCourses(); // Refresh the course list
    };

    if (loading) {
        return (
            <div className='mt-10'>
                <h2 className='font-bold text-2xl mb-4'>My Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl border p-6 animate-pulse">
                            <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className='mt-10'>
            <div className="flex items-center justify-between mb-6">
                <h2 className='font-bold text-2xl'>{isAdmin ? 'My Courses' : 'My Learning'}</h2>
                {isAdmin && (
                    <AddNewCourseDialog onCourseGenerated={handleCourseGenerated}>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            <Settings className="w-4 h-4 mr-2" />
                            Create New Course
                        </Button>
                    </AddNewCourseDialog>
                )}
            </div>
            
            {courseList?.length === 0 ? (
                <div className='flex items-center justify-center p-12 flex-col border rounded-xl bg-gray-50'>
                    <Image src='/online-learning.jpeg' alt='No courses' width={120} height={120} className="mb-4"/>
                    <h2 className='my-2 text-xl font-bold text-gray-700'>{isAdmin ? 'No Courses Yet' : 'No enrolled courses yet'}</h2>
                    <p className="text-gray-500 mb-6 text-center">
                        {isAdmin ? 'Start by creating a course for your students.' : 'Browse and enroll from the catalog to start learning.'}
                    </p>
                    {isAdmin ? (
                        <AddNewCourseDialog onCourseGenerated={handleCourseGenerated}>
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                <Settings className="w-4 h-4 mr-2" />
                                Create Your First Course
                            </Button>
                        </AddNewCourseDialog>
                    ) : (
                        <Link href="/workspace/explore">
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                <Compass className="w-4 h-4 mr-2" />
                                Explore Courses
                            </Button>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courseList.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl border hover:shadow-lg transition-shadow duration-200">
                            <div className="p-6">
                                <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                                    <BookOpen className="w-12 h-12 text-blue-600" />
                                </div>
                                
                                <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.name}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
                                
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {course.noOfChapters} Chapters
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 mr-1" />
                                        {course.level}
                                    </div>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Link href={`/workspace/course/${course.cid}`} className="flex-1">
                                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                            <Play className="w-4 h-4 mr-2" />
                                            {isAdmin ? 'Start Learning' : 'Continue Learning'}
                                        </Button>
                                    </Link>
                                    {isAdmin && (
                                        <Button variant="outline" size="icon">
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CourseList