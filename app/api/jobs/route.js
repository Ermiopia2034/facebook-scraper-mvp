import { getJobs, getTotalJobCount, getJobCountsByType } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get query params
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : null;
    const postType = searchParams.get('postType');
    
    const jobs = await getJobs(limit, postType);
    const totalCount = await getTotalJobCount(postType);
    const counts = await getJobCountsByType();
    
    return NextResponse.json({ 
      jobs,
      totalCount,
      counts 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
