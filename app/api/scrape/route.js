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
    
    // Log first item for debugging
    if (items.length > 0) {
      console.log('Sample Apify item:', JSON.stringify(items[0], null, 2));
    }
    
    // Process and save jobs
    const processedJobs = items.map((item, index) => {
      // Try different possible timestamp fields
      const dateFields = ['publishedTime', 'createdTime', 'time', 'timestamp'];
      let postDate = new Date();
      
      for (const field of dateFields) {
        if (item[field]) {
          postDate = new Date(item[field]);
          break;
        }
      }
      
      // Try different possible URL fields
      const postUrl = item.url || item.postUrl || item.permalink || item.facebookUrl || groupUrl;
      
      return {
        text: item.text || `Post ${index + 1}`,
        author: item.user?.name || item.authorName || item.author || 'Unknown',
        url: postUrl,
        date: postDate,
      };
    });
    
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