'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [groupUrl, setGroupUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleScrape = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupUrl }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to scrape' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Facebook Group Scraper</h1>
      
      <form onSubmit={handleScrape} style={{ marginBottom: '2rem' }}>
        <input
          type="url"
          value={groupUrl}
          onChange={(e) => setGroupUrl(e.target.value)}
          placeholder="Enter Facebook group URL"
          required
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '0.5rem 2rem',
            backgroundColor: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Scraping... (30-60 seconds)' : 'Start Scraping'}
        </button>
      </form>

      {result && (
        <div style={{
          padding: '1rem',
          backgroundColor: result.error ? '#fee' : '#efe',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {result.error ? (
            <p>Error: {result.error}</p>
          ) : (
            <p>Successfully scraped {result.count} posts!</p>
          )}
        </div>
      )}

      <Link 
        href="/history"
        style={{
          color: '#0070f3',
          textDecoration: 'underline'
        }}
      >
        View History →
      </Link>
    </div>
  );
}
