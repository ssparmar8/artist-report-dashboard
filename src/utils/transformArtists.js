const ARTIST_COLORS = {
  artist_bad_bunny:      { color: '#4F8EF7', initials: 'BB' },  // electric blue
  artist_shakira:        { color: '#FF6B9D', initials: 'SH' },  // hot pink
  artist_rauw_alejandro: { color: '#2EC4A0', initials: 'RA' },  // emerald teal
  artist_becky_g:        { color: '#A855F7', initials: 'BG' },  // vivid purple
  artist_carlos_vives:   { color: '#F5A623', initials: 'CV' },  // amber orange
};

const PALETTE = ['#4F8EF7','#2EC4A0','#F5A623','#E85D8A','#A78BFA','#FB923C','#34D399','#F472B6','#60A5FA','#FBBF24'];

function getColorInitials(artistId, artistName) {
  if (ARTIST_COLORS[artistId]) return ARTIST_COLORS[artistId];
  const words = (artistName || '').trim().split(/\s+/);
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : (words[0] || 'X').slice(0, 2).toUpperCase();
  const hash = [...(artistId || artistName || '')].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return { color: PALETTE[hash % PALETTE.length], initials };
}

function safeJSON(str, fallback) {
  if (!str || str === '[]' || str === '{}' || str === '') return fallback;
  try { return JSON.parse(str); }
  catch { return fallback; }
}

function transformArtist(raw) {
  const artistId   = raw.cr917_artist_id || raw.cr917_id || '';
  const artistName = raw.cr917_artist_name || 'Unknown';
  const { color, initials } = getColorInitials(artistId, artistName);

  const profileArr   = safeJSON(raw.cr917_profile, []);
  const profileItem  = profileArr[0] || {};
  const profile      = safeJSON(profileItem.profile, {});
  const professional = safeJSON(profileItem.professional, {});
  const ranking      = safeJSON(profileItem.ranking, {});
  const media        = safeJSON(profileItem.media, {});
  const bio          = profileItem['bio summary'] || '';

  const popArr     = safeJSON(raw.cr917_popularity, []);
  const pop        = popArr[0] || {};
  const ytViews    = safeJSON(pop.youtube_views, []);
  const milestones = safeJSON(pop.streaming_milestones, []);

  const topTracks = milestones
    .filter(m => m.streams && !m.milestone)
    .map(m => ({ title: m.track || m.song || m.track_name || m.title || m.name || '', streams: Number(m.streams) }))
    .filter(m => m.title)
    .slice(0, 7);

  const discArr    = safeJSON(raw.cr917_discography, []);
  const disc       = discArr[0] || {};
  const albumsRaw  = safeJSON(disc.albums, []);
  const discStreams = safeJSON(disc.streaming_milestones, []);
  const chartPerf  = safeJSON(disc.chart_performance, []);

  const albums = albumsRaw.map(a => {
    const norm = (a.normalized_title || '').toLowerCase();
    const streamsObj = discStreams.find(s =>
      (s.title || '').toLowerCase() === norm ||
      (s.title || '').toLowerCase().includes(norm.slice(0, 12))
    );
    const chartObj = chartPerf.find(c => (c.title || '').toLowerCase() === norm);
    return {
      title:   a.title,
      year:    a.release_date ? new Date(a.release_date).getFullYear() : null,
      label:   a.label || '',
      streams: streamsObj ? streamsObj.streams : 'N/A',
      chart:   chartObj ? chartObj.chart_position : '',
    };
  });

  const awardsRaw = safeJSON(raw.cr917_award_recognition, []);
  const awards = awardsRaw.map(a => ({
    title:    a.award_info || a.category || '',
    event:    (a.source || '').split('|')[0].trim(),
    year:     a.year || '',
    status:   a.status || '',
    prestige: parseFloat(a.prestige_score) || 0.9,
  }));

  const eventsRaw = safeJSON(raw.cr917_events, []);
  const tours = eventsRaw.map(e => {
    const ei = safeJSON(e.event_info, {});
    return {
      tourName: ei.tour_name || '',
      date:     ei.event_date || '',
      venue:    ei.venue || '',
      city:     ei.city || '',
      country:  ei.country || '',
      status:   ei.status || '',
    };
  });

  const fanRaw      = safeJSON(raw.cr917_fan_signals, []);
  const seenSignals = new Set();
  const fanSignals  = fanRaw
    .filter(f => {
      const sd  = safeJSON(f.signal_data, {});
      const key = sd.topic || '';
      if (seenSignals.has(key)) return false;
      seenSignals.add(key);
      return true;
    })
    .map(f => {
      const sd       = safeJSON(f.signal_data, {});
      const metrics  = safeJSON(f.metrics, {});
      const evidence = safeJSON(f['evidence '] || f.evidence, {});
      return {
        platform:  (evidence.platforms || []).join(' · ') || sd.source_platform || '',
        topic:     sd.topic || '',
        theme:     sd.trend_theme || '',
        intensity: metrics.intensity_score || sd.intensity_score || 0,
        mentions:  metrics.mention_count || 0,
      };
    });

  const socialRaw   = safeJSON(raw.cr917_social_activity, []);
  const socialPosts = socialRaw.map(s => {
    const eng = safeJSON(s.engagement, {});
    return {
      platform: s.platform || '',
      date:     (s.post_date || '').slice(0, 10),
      summary:  s.summary || '',
      views:    eng.views_count || 0,
      type:     eng.topic_classification || s.post_type || '',
    };
  });

  const newsRaw    = safeJSON(raw.cr917_news_announcement, []);
  const seenNews   = new Set();
  const recentNews = newsRaw
    .filter(n => {
      if (seenNews.has(n.headline)) return false;
      seenNews.add(n.headline);
      return true;
    })
    .map(n => {
      const src = safeJSON(n.source, {});
      return {
        headline: n.headline || '',
        source:   src.source_name || '',
        date:     n.dates || '',
        type:     n.classification || n.announcement_type || '',
      };
    });

  const reviewsRaw = safeJSON(raw.cr917_review_critique, []);
  const scores     = reviewsRaw
    .map(r => safeJSON(r.score, {}).value)
    .filter(v => v != null);
  const criticalScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;

  return {
    id:               artistId,
    name:             artistName,
    realName:         profile.birth_name || artistName,
    country:          profile.country || '',
    city:             profile.city || '',
    age:              profile.age || null,
    activeFrom:       profile.active_years_start ? parseInt(profile.active_years_start) : null,
    status:           profile.status || 'active',
    color,
    initials,
    genres:           professional.genres || [],
    roles:            professional.roles  || [],
    label:            professional.label  || '',
    rank:             ranking.current_rank || null,
    rankSource:       ranking.ranking_source || '',
    monthlyListeners: parseInt(pop.monthly_listeners) || 0,
    youtubeViews:     ytViews[0] ? ytViews[0].total_views : null,
    bio,
    associatedActs:   professional.associated_acts || [],
    website:          media.official_website || '',
    albums,
    topTracks,
    awards,
    tours,
    fanSignals,
    socialPosts,
    recentNews,
    criticalScore,
    trendDirection:   pop.trend_direction || 'stable',
  };
}

export function transformArtists(rawItems) {
  return (rawItems || []).map(transformArtist);
}

export function computeRosterStats(artists) {
  const totalMonthlyListeners = artists.reduce((s, a) => s + (a.monthlyListeners || 0), 0);
  const totalYoutubeViews     = artists.reduce((s, a) => s + (a.youtubeViews     || 0), 0);
  const totalAwardsWon        = artists.reduce((s, a) =>
    s + a.awards.filter(aw => aw.status === 'won' || aw.status === 'honored').length, 0);
  const activeTours = artists.filter(a => a.tours.some(t => t.status === 'announced')).length;
  return {
    totalArtists: artists.length,
    totalMonthlyListeners,
    totalYoutubeViews,
    totalAwardsWon,
    activeTours,
    dataSource: 'Dataverse — cr917_artistreports',
    scrapedAt:  new Date().toISOString().slice(0, 10),
  };
}
