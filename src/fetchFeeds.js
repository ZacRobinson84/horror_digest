import Parser from 'rss-parser';

const parser = new Parser({ timeout: 15000 });
const DAY_MS = 24 * 60 * 60 * 1000;

export async function fetchFeeds(feeds) {
  const cutoff = Date.now() - DAY_MS;
  const results = await Promise.all(
    feeds.map(async ({ name, url }) => {
      try {
        const feed = await parser.parseURL(url);
        return (feed.items || []).map((item) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate || item.isoDate,
          source: name,
          contentSnippet: item.contentSnippet,
        }));
      } catch (err) {
        console.error(`[${name}] feed failed: ${err.message}`);
        return [];
      }
    })
  );

  const items = results.flat().filter((item) => {
    if (!item.pubDate) return false;
    const ts = Date.parse(item.pubDate);
    return Number.isFinite(ts) && ts >= cutoff;
  });

  const seen = new Set();
  return items.filter((item) => {
    if (!item.link || seen.has(item.link)) return false;
    seen.add(item.link);
    return true;
  });
}
