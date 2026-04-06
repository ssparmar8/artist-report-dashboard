import React, { useRef, useEffect } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, DoughnutController, ArcElement } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, DoughnutController, ArcElement);

export const ListenersChart = ({ artists }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: artists.map(a => a.name.split(' ')[0]),
        datasets: [{
          data: artists.map(a => a.monthlyListeners / 1000000),
          backgroundColor: artists.map(a => a.color + 'cc'),
          borderColor: artists.map(a => a.color),
          borderWidth: 1,
          borderRadius: 8,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10,10,20,0.95)',
            titleColor: '#fff',
            bodyColor: 'rgba(255,255,255,0.6)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            callbacks: { label: ctx => `${ctx.raw.toFixed(1)}M monthly listeners` },
          },
        },
        scales: {
          x: {
            ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 11 } },
            grid: { display: false },
            border: { color: 'rgba(255,255,255,0.08)' },
          },
          y: {
            ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 }, callback: v => v + 'M' },
            grid: { color: 'rgba(255,255,255,0.04)' },
            border: { color: 'rgba(255,255,255,0.08)' },
          },
        },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [artists]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '200px' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export const GenreDonut = ({ artists }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const genreMap = {};
    artists.forEach(a => a.genres.slice(0, 3).forEach(g => {
      genreMap[g] = (genreMap[g] || 0) + 1;
    }));
    const sorted = Object.entries(genreMap).sort((a, b) => b[1] - a[1]).slice(0, 7);
    const palette = ['#4F8EF7','#2EC4A0','#E85D8A','#F5A623','#9B7FE8','#6B8E9F','#C4A24F'];

    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels: sorted.map(([k]) => k),
        datasets: [{
          data: sorted.map(([, v]) => v),
          backgroundColor: palette,
          borderWidth: 2,
          borderColor: '#0a0a0f',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: { color: 'rgba(255,255,255,0.6)', font: { size: 11 }, boxWidth: 10, padding: 8 },
          },
          tooltip: {
            backgroundColor: 'rgba(10,10,20,0.95)',
            titleColor: '#fff',
            bodyColor: 'rgba(255,255,255,0.6)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
          },
        },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [artists]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '200px' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export const AlbumStreamsChart = ({ artists }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const items = [
      { label: 'Un Verano Sin Ti', val: 22.5, color: '#4F8EF7' },
      { label: 'YHLQMDLG', val: 12.2, color: '#4F8EF7bb' },
      { label: 'Debí Tirar Más Fotos', val: 10.7, color: '#4F8EF788' },
      { label: 'Vice Versa', val: 6.9, color: '#2EC4A0' },
      { label: 'Afrodisíaco', val: 3.9, color: '#2EC4A0bb' },
      { label: 'Mala Santa', val: 3.0, color: '#E85D8A' },
      { label: 'VIVES', val: 1.9, color: '#F5A623' },
    ];

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: items.map(i => i.label.length > 20 ? i.label.slice(0, 20) + '…' : i.label),
        datasets: [{
          data: items.map(i => i.val),
          backgroundColor: items.map(i => i.color),
          borderRadius: 5,
          borderSkipped: false,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10,10,20,0.95)',
            titleColor: '#fff',
            bodyColor: 'rgba(255,255,255,0.6)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            callbacks: { label: ctx => `${ctx.raw}B Spotify streams` },
          },
        },
        scales: {
          x: {
            ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 }, callback: v => v + 'B' },
            grid: { color: 'rgba(255,255,255,0.04)' },
            border: { color: 'rgba(255,255,255,0.08)' },
          },
          y: {
            ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } },
            grid: { display: false },
            border: { color: 'rgba(255,255,255,0.08)' },
          },
        },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [artists]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '240px' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};
