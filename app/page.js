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
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '2rem 1rem'
    }}>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .scrape-btn {
          transition: all 0.3s ease;
        }
        .scrape-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(24, 119, 242, 0.4);
        }
        .input-field:focus {
          border-color: #1877f2;
          box-shadow: 0 0 0 2px rgba(24, 119, 242, 0.2);
          outline: none;
        }
        .card {
          transition: all 0.3s ease;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.15);
        }
      `}</style>
      
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header Card */}
        <div className="card" style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #1877f2, #42a5f5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            📱
          </div>
          <h1 style={{
            margin: '0 0 0.5rem 0',
            color: '#1c1e21',
            fontSize: '32px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #1877f2, #42a5f5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Facebook Group Scraper
          </h1>
          <p style={{
            margin: '0',
            color: '#65676b',
            fontSize: '18px',
            lineHeight: '1.4'
          }}>
            Extract valuable insights from Facebook group posts with our intelligent scraper
          </p>
        </div>

        {/* Scraper Form Card */}
        <div className="card" style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <form onSubmit={handleScrape}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#1c1e21',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                🔗 Facebook Group URL
              </label>
              <input
                className="input-field"
                type="url"
                value={groupUrl}
                onChange={(e) => setGroupUrl(e.target.value)}
                placeholder="https://www.facebook.com/groups/your-group-url"
                required
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e4e6ea',
                  borderRadius: '12px',
                  fontSize: '16px',
                  backgroundColor: '#f8f9fa',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <button
              className="scrape-btn"
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px 24px',
                backgroundColor: loading ? '#bcc0c4' : '#1877f2',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(24, 119, 242, 0.3)'
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Scraping... (30-60 seconds)
                </>
              ) : (
                <>
                  🚀 Start Scraping
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result Card */}
        {result && (
          <div className="card" style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: result.error ? '2px solid #f02849' : '2px solid #42b883'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: result.error ?
                  'linear-gradient(135deg, #f02849, #ff6b6b)' :
                  'linear-gradient(135deg, #42b883, #4ade80)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                {result.error ? '❌' : '✅'}
              </div>
              <div>
                <h3 style={{
                  margin: '0',
                  color: '#1c1e21',
                  fontSize: '20px',
                  fontWeight: '700'
                }}>
                  {result.error ? 'Scraping Failed' : 'Scraping Successful!'}
                </h3>
                <p style={{
                  margin: '4px 0 0 0',
                  color: '#65676b',
                  fontSize: '16px'
                }}>
                  {result.error ? result.error : `Successfully scraped ${result.count} posts`}
                </p>
              </div>
            </div>
            
            {!result.error && result.jobs && result.jobs.length > 0 && (
              <div style={{
                background: '#f8f9fa',
                borderRadius: '12px',
                padding: '1rem',
                marginTop: '1rem'
              }}>
                <h4 style={{
                  margin: '0 0 0.5rem 0',
                  color: '#1c1e21',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  📊 Preview of scraped posts:
                </h4>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {result.jobs.slice(0, 3).map((job, index) => (
                    <div key={index} style={{
                      background: '#ffffff',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '8px',
                      border: '1px solid #e4e6ea'
                    }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1877f2',
                        marginBottom: '4px'
                      }}>
                        {job.author}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#1c1e21',
                        lineHeight: '1.4'
                      }}>
                        {job.text.substring(0, 100)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Card */}
        <div className="card" style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <Link
            href="/history"
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#ffffff',
              padding: '16px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
          >
            📊 View Scraped History
          </Link>
          
          <p style={{
            margin: '1rem 0 0 0',
            color: '#65676b',
            fontSize: '14px'
          }}>
            Browse all your previously scraped Facebook group posts
          </p>
        </div>
      </div>
    </div>
  );
}
