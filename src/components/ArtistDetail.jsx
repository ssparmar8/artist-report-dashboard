import React, { useState } from 'react';
import StreamingChart from './StreamingChart';

const tabs = ['Overview', 'Discography', 'Tours', 'Fan Signals', 'News'];

const statusColor = (s) => {
  if (s === 'won' || s === 'honored') return '#F5A623';
  if (s === 'nominated') return 'rgba(255,255,255,0.4)';
  if (s === 'announced') return '#2EC4A0';
  if (s === 'completed') return 'rgba(255,255,255,0.3)';
  return 'rgba(255,255,255,0.4)';
};

const ArtistDetail = ({ artist }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '24px 28px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: `linear-gradient(135deg, ${artist.color}18 0%, transparent 60%)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: `${artist.color}33`, border: `3px solid ${artist.color}66`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', fontWeight: '600', color: artist.color, flexShrink: 0,
          }}>{artist.initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '22px', fontWeight: '400', color: '#fff', fontFamily: "'DM Serif Display', serif", lineHeight: 1.2 }}>
              {artist.name}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '3px' }}>
              {artist.realName} · {artist.city}, {artist.country} · Age {artist.age}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
              {(artist.genres || []).slice(0, 4).map(g => (
                <span key={g} style={{
                  fontSize: '10px', padding: '3px 9px', borderRadius: '20px',
                  background: `${artist.color}20`, color: artist.color,
                  border: `1px solid ${artist.color}40`,
                }}>{g}</span>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '28px', fontWeight: '400', color: artist.color, fontFamily: "'DM Serif Display', serif" }}>
              {(artist.monthlyListeners / 1000000).toFixed(1)}M
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>monthly listeners</div>
            <div style={{
              marginTop: '6px', fontSize: '10px', padding: '3px 10px',
              borderRadius: '20px',
              background: artist.trendDirection === 'up' ? '#2EC4A022' : '#88888822',
              color: artist.trendDirection === 'up' ? '#2EC4A0' : '#888',
              border: `1px solid ${artist.trendDirection === 'up' ? '#2EC4A044' : '#44444488'}`,
              display: 'inline-block',
            }}>
              {artist.trendDirection === 'up' ? '↑ trending up' : '→ stable'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 16px', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '12px 16px', fontSize: '12px', fontWeight: activeTab === tab ? '500' : '400',
            color: activeTab === tab ? artist.color : 'rgba(255,255,255,0.4)',
            borderBottom: `2px solid ${activeTab === tab ? artist.color : 'transparent'}`,
            transition: 'all 0.2s', whiteSpace: 'nowrap',
          }}>{tab}</button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '24px 28px' }}>

        {activeTab === 'Overview' && (
          <div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.7', marginBottom: '24px' }}>
              {artist.bio}
            </p>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
                Top tracks by streams
              </div>
              <StreamingChart artist={artist} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginTop: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Label</div>
                <div style={{ fontSize: '12px', color: '#fff', marginTop: '4px' }}>{artist.label.split(',')[0]}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active since</div>
                <div style={{ fontSize: '18px', fontWeight: '400', color: artist.color, fontFamily: "'DM Serif Display', serif", marginTop: '2px' }}>{artist.activeFrom}</div>
              </div>
              {artist.criticalScore && (
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Critical score</div>
                  <div style={{ fontSize: '18px', fontWeight: '400', color: artist.color, fontFamily: "'DM Serif Display', serif", marginTop: '2px' }}>{artist.criticalScore}/100</div>
                </div>
              )}
              {artist.rank && (
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Billboard rank</div>
                  <div style={{ fontSize: '18px', fontWeight: '400', color: artist.color, fontFamily: "'DM Serif Display', serif", marginTop: '2px' }}>#{artist.rank}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Discography' && (
          <div>
            {(artist.albums || []).map((album, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '12px 0', borderBottom: i < artist.albums.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '8px', flexShrink: 0,
                  background: `${artist.color}22`, border: `1px solid ${artist.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', color: artist.color, fontWeight: '600',
                }}>{album.year}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: '#fff', fontWeight: '400' }}>{album.title}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{album.label}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', color: artist.color, fontWeight: '500' }}>{album.streams}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{album.chart}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Tours' && (
          <div>
            {(artist.tours || []).length === 0 && (
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '30px 0' }}>No tour data available</div>
            )}
            {(artist.tours || []).map((t, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                padding: '12px 0', borderBottom: i < artist.tours.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '8px 12px',
                  textAlign: 'center', flexShrink: 0, minWidth: '60px',
                }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{new Date(t.date).toLocaleDateString('en', { month: 'short' })}</div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#fff' }}>{new Date(t.date).getDate()}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: '#fff' }}>{t.venue}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{t.city}, {t.country}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{t.tourName}</div>
                </div>
                <span style={{
                  fontSize: '10px', padding: '3px 9px', borderRadius: '20px',
                  color: statusColor(t.status),
                  background: t.status === 'announced' ? '#2EC4A015' : t.status === 'completed' ? '#88888815' : '#88888815',
                  border: `1px solid ${statusColor(t.status)}44`,
                }}>{t.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Fan Signals' && (
          <div>
            {(artist.fanSignals || []).map((s, i) => (
              <div key={i} style={{
                padding: '14px', marginBottom: '10px',
                background: 'rgba(255,255,255,0.03)', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ fontSize: '13px', color: '#fff', fontWeight: '400' }}>{s.topic}</div>
                  <div style={{ fontSize: '18px', fontWeight: '400', color: artist.color, fontFamily: "'DM Serif Display', serif", flexShrink: 0, marginLeft: '12px' }}>
                    {Math.round(s.intensity * 100)}%
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '6px' }}>{s.theme}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{s.platform}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{s.mentions} mentions</div>
                </div>
                <div style={{ marginTop: '10px', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                  <div style={{ height: '100%', width: `${s.intensity * 100}%`, background: artist.color, borderRadius: '2px', transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'News' && (
          <div>
            {(artist.recentNews || []).map((n, i) => (
              <div key={i} style={{
                display: 'flex', gap: '12px', padding: '12px 0',
                borderBottom: i < artist.recentNews.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '5px',
                  background: artist.color,
                }} />
                <div>
                  <div style={{ fontSize: '13px', color: '#fff', lineHeight: '1.4', marginBottom: '4px' }}>{n.headline}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
                    {n.source} · {new Date(n.date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                    <span style={{
                      marginLeft: '8px', padding: '1px 7px', borderRadius: '10px',
                      background: `${artist.color}20`, color: artist.color, fontSize: '10px',
                    }}>{n.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistDetail;
