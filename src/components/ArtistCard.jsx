import React, { useState } from 'react';

const ArtistCard = ({ artist, isSelected, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        background: isSelected
          ? `linear-gradient(135deg, ${artist.color}22, ${artist.color}0a)`
          : hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isSelected ? artist.color + '60' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '14px',
        padding: '16px',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: '50%',
          background: `${artist.color}33`,
          border: `2px solid ${artist.color}66`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: '600', color: artist.color,
          flexShrink: 0,
        }}>{artist.initials}</div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#fff' }}>{artist.name}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{artist.country}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{
            fontSize: '10px', padding: '2px 8px', borderRadius: '20px',
            background: artist.status === 'active' ? '#2EC4A022' : '#88888822',
            color: artist.status === 'active' ? '#2EC4A0' : '#888',
            border: `1px solid ${artist.status === 'active' ? '#2EC4A044' : '#88888844'}`,
          }}>{artist.status}</div>
        </div>
      </div>
      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>
        {artist.genres.slice(0, 2).join(' · ')}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '500', color: artist.color, fontFamily: "'DM Serif Display', serif" }}>
            {(artist.monthlyListeners / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>monthly listeners</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '16px', fontWeight: '500', color: '#fff', fontFamily: "'DM Serif Display', serif" }}>
            {artist.activeFrom}
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>active since</div>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
