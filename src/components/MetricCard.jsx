import React from 'react';

const MetricCard = ({ label, value, sub, subColor = '#2EC4A0' }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '12px',
    padding: '18px 20px',
    border: '1px solid rgba(255,255,255,0.07)',
  }}>
    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</div>
    <div style={{ fontSize: '22px', fontWeight: '500', color: '#fff', fontFamily: "'DM Serif Display', serif" }}>{value}</div>
    {sub && <div style={{ fontSize: '11px', color: subColor, marginTop: '4px' }}>{sub}</div>}
  </div>
);

export default MetricCard;
