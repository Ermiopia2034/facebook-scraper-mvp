import { ApifyClient } from 'apify-client';
import { saveJobs } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { groupUrl } = await request.json();
    
    // Initialize Apify client
    const client = new ApifyClient({
      token: process.env.APIFY_TOKEN,
    });
    
    // Prepare Actor input
    const input = {
      "startUrls": [
        {
          "url": groupUrl
        }
      ],
      "resultsLimit": 20,
      "viewOption": "CHRONOLOGICAL"
    };

    // Run the Actor and wait for it to finish
    const run = await client.actor("2chN8UQcH1CfxLRNE").call(input);
    
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