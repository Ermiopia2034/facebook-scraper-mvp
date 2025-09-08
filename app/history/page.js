'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function History() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data.jobs || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Link href="/" style={{ color: '#0070f3', marginBottom: '1rem', display: 'block' }}>
        ← Back to Scraper
      </Link>
      
      <h1>Scraped Jobs History</h1>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Group</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Post Text</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Author</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{job.groupUrl?.split('/').pop()}</td>
                <td style={{ padding: '0.5rem', maxWidth: '400px' }}>
                  {job.postText?.substring(0, 150)}
                  {job.postText?.length > 150 ? '...' : ''}
                </td>
                <td style={{ padding: '0.5rem' }}>{job.author}</td>
                <td style={{ padding: '0.5rem' }}>
                  {new Date(job.postDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {jobs.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
          No jobs scraped yet
        </p>
      )}
    </div>
  );
}