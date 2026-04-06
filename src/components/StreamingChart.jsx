import React, { useRef, useEffect } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StreamingChart = ({ artist }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    let url = 'https://4b079ceeb5d6e253856dc427359af2.06.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/6b820f1b9c824635beb4270044939e5a/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3it6psxJy6zB3IgLauPsi8Nwp2tcKCku73VYAOkQgjs'
      fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const tracks = artist.topTracks.slice(0, 7);
    // const max = Math.max(...tracks.map(t => t.streams));

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: tracks.map(t => t.title.length > 18 ? t.title.slice(0, 18) + '…' : t.title),
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
