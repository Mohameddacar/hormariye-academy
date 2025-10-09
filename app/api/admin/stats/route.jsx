import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/config/db';
import { usersTable, coursesTable, enrollmentsTable } from '@/config/schema';
import { eq, count } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
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

    // Get statistics
    const [totalCourses] = await db
      .select({ count: count() })
      .from(coursesTable);

    const [totalUsers] = await db
      .select({ count: count() })
      .from(usersTable);

    const [totalEnrollments] = await db
      .select({ count: count() })
      .from(enrollmentsTable);

    // Mock revenue data (you can implement real revenue tracking)
    const totalRevenue = totalEnrollments.count * 29.99; // Assuming $29.99 per course

    return NextResponse.json({
      totalCourses: totalCourses.count,
      totalUsers: totalUsers.count,
      totalRevenue: totalRevenue.toFixed(2),
      activeUsers: totalEnrollments.count
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
