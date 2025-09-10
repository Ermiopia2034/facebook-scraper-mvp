import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function classifyPost(postText, author) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `
    Analyze the following Facebook group post and classify it as either:
    - "job_offer" (someone offering a job/hiring)
    - "job_seeker" (someone looking for a job)
    - "unclassified" (neither job offer nor job seeker)
    
    Post Author: ${author}
    Post Text: ${postText}
    
    Respond with ONLY one of these three values: job_offer, job_seeker, or unclassified
    Consider context clues like:
    - Job offers typically mention: hiring, looking for, vacancy, position available, we need, recruiting
    - Job seekers typically mention: looking for work, seeking job, available for, my skills, I can do
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const classification = response.text().trim().toLowerCase();
    
    // Validate the response
    if (['job_offer', 'job_seeker', 'unclassified'].includes(classification)) {
      return classification;
    }
    
    return 'unclassified';
  } catch (error) {
    console.error('Error classifying post with Gemini:', error);
    return 'unclassified'; // Default to unclassified if AI fails
  }
}

export async function classifyPosts(posts) {
  // Process posts in batches to avoid rate limiting
  const batchSize = 5;
  const classifiedPosts = [];
  
  for (let i = 0; i < posts.length; i += batchSize) {
    const batch = posts.slice(i, i + batchSize);
    const classifications = await Promise.all(
      batch.map(async (post) => {
        const postType = await classifyPost(post.text || post.postText, post.author);
        return { ...post, postType };
      })
    );
    classifiedPosts.push(...classifications);
    
    // Add a small delay between batches to avoid rate limiting
    if (i + batchSize < posts.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return classifiedPosts;
}
