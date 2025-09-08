import { ApifyClient } from 'apify-client';
import { initDB, saveJobs } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { groupUrl } = await request.json();
    
    // Initialize DB
    await initDB();
    
    // Initialize Apify client
    const client = new ApifyClient({
      token: process.env.APIFY_TOKEN,
    });
    
    // Start the Facebook Groups Scraper actor
    const run = await client.actor('apify/facebook-groups-scraper').start({
      groupUrls: [groupUrl],
      maxPosts: 20, // Limit for testing
      maxCommentsPerPost: 0,
      maxReviewsPerPage: 0,
    });
    
    // Wait for results
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    
    // Process and save jobs
    const processedJobs = items.map(item => ({
      text: item.text || item.message || '',
      author: item.authorName || 'Unknown',
      url: item.url || '',
      date: item.time || new Date(),
    }));
    
    await saveJobs(processedJobs, groupUrl);
    
    return NextResponse.json({ 
      success: true, 
      count: processedJobs.length,
      jobs: processedJobs 
    });
    
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape group' },
      { status: 500 }
    );
  }
}