// app/workspace/layout.jsx
import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'

export default function WorkspaceLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-h-screen w-full flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </SidebarProvider>
  )
}
