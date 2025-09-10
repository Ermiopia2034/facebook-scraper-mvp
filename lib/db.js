import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export async function saveJobs(jobs, groupUrl) {
  const data = jobs.map(job => ({
    groupUrl,
    postText: job.text,
    author: job.author,
    postUrl: job.url,
    postDate: new Date(job.date),
  }));
  
  return await prisma.job.createMany({ data });
}

export async function getJobs(limit = null) {
  const query = {
    orderBy: { scrapedAt: 'desc' }
  };
  
  // Only add limit if specified
  if (limit) {
    query.take = limit;
  }
  
  return await prisma.job.findMany(query);
}

export async function getTotalJobCount() {
  return await prisma.job.count();
}
