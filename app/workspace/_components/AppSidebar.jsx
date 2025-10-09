"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import {
  Book,
  Compass,
  LayoutDashboard,
  UserCheck,
  WalletCards,
  Settings,
} from "lucide-react";
import AddNewCourseDialog from "./AddNewCourseDialog";

const sideBarOptions = [
  { title: "Dashboard",       icon: LayoutDashboard, path: "/workspace" },
  { title: "My Learning",     icon: Book,            path: "/workspace/my-courses" },
  { title: "Explore Courses", icon: Compass,         path: "/workspace/explore" },
  { title: "Billing",         icon: WalletCards,     path: "/workspace/billing" },
  { title: "Profile",         icon: UserCheck,       path: "/workspace/profile" },
  { title: "Admin Panel",     icon: Settings,        path: "/admin" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === 'mohameddacarmohumed@gmail.com';

  return (
    <Sidebar>
      {/* centered logo, no extra padding/margin */}
      <SidebarHeader className="p-0">
        <div className="w-full grid place-items-center py-4">
          <Image
            src="/hormlogo.png"   // make sure this file exists in /public
            alt="Hormariye Academy"
            width={56}
            height={56}
            className="block m-0"
            priority
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {isAdmin && (
          <SidebarGroup>
            <AddNewCourseDialog>
              <Button className="mx-4">Create New Course</Button>
            </AddNewCourseDialog>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sideBarOptions
                .filter((item) => (item.title === "Admin Panel" ? isAdmin : true))
                .map((item) => {
                const active =
                  item.path === "/"
                    ? pathname === "/"
                    : pathname === item.path || pathname.startsWith(item.path);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link
                        href={item.path}
                        aria-current={active ? "page" : undefined}
                        className={
                          "flex items-center gap-2 rounded-md px-2 py-1 transition " +
                          (active
                            ? "text-purple-600 bg-purple-50"
                            : "text-gray-700 hover:text-purple-600 hover:bg-purple-50")
                        }
                      >
                        <item.icon className="h-4 w-4" aria-hidden="true" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 text-xs opacity-70">
        © {new Date().getFullYear()} Hormariye Academy
      </SidebarFooter>
    </Sidebar>
  );
}
