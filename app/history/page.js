'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function History() {
  const [jobs, setJobs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data.jobs || []);
        setTotalCount(data.totalCount || 0);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const toggleExpanded = (jobId) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId);
    } else {
      newExpanded.add(jobId);
    }
    setExpandedPosts(newExpanded);
  };

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          background: '#ffffff',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '3px solid #1877f2',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{ color: '#1c1e21', fontSize: '16px', fontWeight: '500' }}>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '2rem 1rem'
    }}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .post-card {
          transition: all 0.3s ease;
        }
        .post-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        }
        .expand-btn {
          transition: all 0.2s ease;
        }
        .expand-btn:hover {
          background: #e7f3ff !important;
          transform: scale(1.05);
        }
      `}</style>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{
              margin: '0',
              color: '#1c1e21',
              fontSize: '28px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📊 Facebook Groups History
            </h1>
            <p style={{
              margin: '0.5rem 0 0 0',
              color: '#65676b',
              fontSize: '16px'
            }}>
              {totalCount} scraped posts in database
              {jobs.length < totalCount && ` (showing ${jobs.length})`}
            </p>
          </div>
          <Link href="/" style={{
            background: '#1877f2',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(24, 119, 242, 0.3)'
          }}>
            ← Back to Scraper
          </Link>
        </div>

        {/* Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {jobs.map((job) => {
            const isExpanded = expandedPosts.has(job.id);
            const shouldTruncate = job.postText && job.postText.length > 200;
            const displayText = isExpanded ? job.postText : job.postText?.substring(0, 200);

            return (
              <div
                key={job.id}
                className="post-card"
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                  border: '1px solid #e4e6ea'
                }}
              >
                {/* Post Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #e4e6ea'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #1877f2, #42a5f5)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    flexShrink: 0
                  }}>
                    {job.author?.charAt(0)?.toUpperCase() || '👤'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      margin: '0',
                      color: '#1c1e21',
                      fontSize: '16px',
                      fontWeight: '600',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {job.author || 'Unknown Author'}
                    </h3>
                    <p style={{
                      margin: '4px 0 0 0',
                      color: '#65676b',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      📅 {new Date(job.postDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      <span style={{ color: '#bcc0c4' }}>•</span>
                      🔗 {job.groupUrl?.split('/').pop() || 'Facebook Group'}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{
                    margin: '0',
                    color: '#1c1e21',
                    fontSize: '16px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {displayText}
                    {shouldTruncate && !isExpanded && '...'}
                  </p>
                  
                  {shouldTruncate && (
                    <button
                      className="expand-btn"
                      onClick={() => toggleExpanded(job.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#1877f2',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        marginTop: '0.5rem',
                        borderRadius: '6px'
                      }}
                    >
                      {isExpanded ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>

                {/* Post Footer */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e4e6ea',
                  fontSize: '13px',
                  color: '#65676b'
                }}>
                  <span style={{
                    background: '#f0f2f5',
                    padding: '4px 8px',
                    borderRadius: '12px'
                  }}>
                    Post ID: {job.id}
                  </span>
                  <span style={{
                    background: '#e7f3ff',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    color: '#1877f2'
                  }}>
                    📊 Facebook Group Data
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {jobs.length === 0 && (
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '1rem' }}>📭</div>
            <h3 style={{
              margin: '0 0 0.5rem 0',
              color: '#1c1e21',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              No posts found
            </h3>
            <p style={{
              margin: '0',
              color: '#65676b',
              fontSize: '16px'
            }}>
              Start scraping Facebook groups to see posts here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}