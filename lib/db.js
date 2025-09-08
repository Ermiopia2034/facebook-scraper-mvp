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

export async function getJobs() {
  return await prisma.job.findMany({
    orderBy: { scrapedAt: 'desc' },
    take: 100,
  });
}