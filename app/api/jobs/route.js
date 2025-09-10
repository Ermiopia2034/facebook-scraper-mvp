import { getJobs, getTotalJobCount } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get limit from query params if provided
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : null;
    
    const jobs = await getJobs(limit);
    const totalCount = await getTotalJobCount();
    
    return NextResponse.json({ 
      jobs,
      totalCount 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
