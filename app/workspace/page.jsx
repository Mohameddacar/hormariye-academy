// app/workspace/page.jsx
import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import CourseList from './_components/CourseList'

export default function WorkspacePage() {
  return (
    <div className="space-y-4">
      <WelcomeBanner />
      <CourseList />
      {/* Add more dashboard sections/cards here */}
    </div>
  )
}
