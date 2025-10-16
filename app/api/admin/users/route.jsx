import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/config/db';
import { usersTable, enrollmentsTable } from '@/config/schema';
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

    // Get all users with enrollment counts
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        subscriptionPlan: usersTable.subscriptionPlan,
        createdAt: usersTable.createdAt,
        enrolledCount: count(enrollmentsTable.id).as('enrolledCount'),
      })
      .from(usersTable)
      .leftJoin(enrollmentsTable, eq(usersTable.id, enrollmentsTable.userId))
      .groupBy(
        usersTable.id,
        usersTable.name,
        usersTable.email,
        usersTable.subscriptionPlan,
        usersTable.createdAt,
      )
      .orderBy(usersTable.createdAt);

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
