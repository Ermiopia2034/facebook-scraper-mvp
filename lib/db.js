import { sql } from '@vercel/postgres';

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS jobs (
      id SERIAL PRIMARY KEY,
      group_url VARCHAR(255),
      post_text TEXT,
      author VARCHAR(255),
      post_url VARCHAR(500),
      post_date TIMESTAMP,
      scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function saveJobs(jobs, groupUrl) {
  const results = [];
  for (const job of jobs) {
    const result = await sql`
      INSERT INTO jobs (group_url, post_text, author, post_url, post_date)
      VALUES (${groupUrl}, ${job.text}, ${job.author}, ${job.url}, ${job.date})
      RETURNING *
    `;
    results.push(result.rows[0]);
  }
  return results;
}

export async function getJobs() {
  const result = await sql`
    SELECT * FROM jobs 
    ORDER BY scraped_at DESC 
    LIMIT 100
  `;
  return result.rows;
}