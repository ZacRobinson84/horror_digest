import 'dotenv/config';
import { feeds } from './src/feeds.js';
import { fetchFeeds } from './src/fetchFeeds.js';

const items = await fetchFeeds(feeds);
console.log(`Fetched ${items.length} items from last 24h:\n`);
console.log(items);
process.exit(0);
