import { PrismaClient } from '@prisma/client';
import { classifyPosts } from './gemini';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export async function saveJobs(jobs, groupUrl) {
  // Classify posts using Gemini AI if API key is available
  let classifiedJobs = jobs;
  if (process.env.GEMINI_API_KEY) {
    try {
      classifiedJobs = await classifyPosts(jobs);
    } catch (error) {
      console.error('Failed to classify posts:', error);
      // Continue with unclassified posts
    }
  }
  
  const data = classifiedJobs.map(job => ({
    groupUrl,
    postText: job.text || job.postText,
    author: job.author,
    postUrl: job.url || job.postUrl,
    postDate: new Date(job.date || job.postDate),
    postType: job.postType || 'unclassified',
  }));
  
  return await prisma.job.createMany({ data });
}

export async function getJobs(limit = null, postType = null) {
  const query = {
    orderBy: { scrapedAt: 'desc' },
    where: {}
  };
  
  // Filter by post type if specified
  if (postType) {
    query.where.postType = postType;
  }
  
  // Only add limit if specified
  if (limit) {
    query.take = limit;
  }
  
  return await prisma.job.findMany(query);
}

export async function getTotalJobCount(postType = null) {
  const where = {};
  if (postType) {
    where.postType = postType;
  }
  return await prisma.job.count({ where });
}

export async function getJobCountsByType() {
  const [jobOffers, jobSeekers, unclassified, total] = await Promise.all([
    prisma.job.count({ where: { postType: 'job_offer' } }),
    prisma.job.count({ where: { postType: 'job_seeker' } }),
    prisma.job.count({ where: { postType: 'unclassified' } }),
    prisma.job.count()
  ]);
  
  return {
    jobOffers,
    jobSeekers,
    unclassified,
    total
  };
}
