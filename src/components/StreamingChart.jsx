import React, { useRef, useEffect } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StreamingChart = ({ artist }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const tracks = artist.topTracks.slice(0, 7);
    // const max = Math.max(...tracks.map(t => t.streams));

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: tracks.map(t => { const s = t.title || ''; return s.length > 18 ? s.slice(0, 18) + '…' : s; }),
        datasets: [{
          data: tracks.map(t => t.streams / 1000000),
          backgroundColor: tracks.map((t, i) => {
            const alpha = 1 - (i * 0.12);
            return i === 0 ? artist.color : `${artist.color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
          }),
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15,15,25,0.95)',
            titleColor: '#fff',
            bodyColor: 'rgba(255,255,255,0.6)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            callbacks: {
              label: (ctx) => `${(ctx.raw).toFixed(0)}M streams`,
            },
          },
        },
        scales: {
          x: {
            ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 }, maxRotation: 35 },
            grid: { display: false },
            border: { color: 'rgba(255,255,255,0.1)' },
          },
          y: {
            ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 }, callback: v => v + 'M' },
            grid: { color: 'rgba(255,255,255,0.05)' },
            border: { color: 'rgba(255,255,255,0.1)' },
          },
        },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [artist]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '220px' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default StreamingChart;
