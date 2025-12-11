import { Manifest, ContentItem, FrontMatter } from '../types';

// Mock data to show if no manifest.json is found (for demo purposes)
const MOCK_MANIFEST: Manifest = {
  logs: [
    {
      slug: 'kyoto-autumn',
      path: 'mock',
      title: 'Autumn Colors in Kyoto',
      date: '2023-11-15',
      tags: ['Japan', 'Photography', 'Nature'],
      coverImage: 'https://picsum.photos/800/600?random=1',
    },
    {
      slug: 'paris-cafe',
      path: 'mock',
      title: 'Coffee Crawl in Paris',
      date: '2023-06-10',
      tags: ['France', 'Food', 'City'],
      coverImage: 'https://picsum.photos/800/600?random=2',
    }
  ],
  itineraries: [
    {
      slug: 'iceland-ring-road',
      path: 'mock',
      title: '10 Days Iceland Ring Road',
      date: '2024-08-01',
      coverImage: 'https://picsum.photos/800/600?random=3',
    }
  ]
};

const MOCK_MARKDOWN = `
# Day 1: Arrival

Arrived at the airport and took the train to the city center. The weather is amazing!

## Highlights
* The ancient temple
* Delicious ramen
* Night market walk

![Street View](https://picsum.photos/800/400?random=4)

Currently feeling: **Excited**!
`;

/**
 * Fetches the manifest.json file from the resources folder.
 */
export const fetchManifest = async (): Promise<Manifest> => {
  try {
    const response = await fetch('resources/manifest.json');
    if (!response.ok) throw new Error('Manifest not found');
    return await response.json();
  } catch (error) {
    console.warn('Could not load manifest.json, using mock data.', error);
    return MOCK_MANIFEST;
  }
};

/**
 * Parsed FrontMatter manually to avoid heavy dependencies like gray-matter in browser
 */
const parseFrontMatter = (text: string): { meta: Partial<FrontMatter>, content: string } => {
  const pattern = /^---[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]+([\s\S]*)$/;
  const match = text.match(pattern);

  if (!match) {
    return { meta: {}, content: text };
  }

  const metaRaw = match[1];
  const content = match[2];
  const meta: any = {};

  metaRaw.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      let value = valueParts.join(':').trim();
      // Basic type parsing
      if (value.startsWith('[') && value.endsWith(']')) {
         value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')) as any;
      }
      meta[key.trim()] = value;
    }
  });

  return { meta, content };
};

/**
 * Helper to resolve image paths.
 * If it's a web URL (http...), return as is.
 * If it's a local path, ensure it doesn't start with / so it works on GitHub Pages subdirectories.
 */
export const resolveImageUrl = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  // Strip leading slash to make it relative to index.html (works with HashRouter + GH Pages)
  return url.startsWith('/') ? url.slice(1) : url;
};

/**
 * Fetches specific content (MD or JSON)
 */
export const fetchContent = async (path: string): Promise<{ meta: any; content: any; isJson: boolean }> => {
  if (path === 'mock') {
    return { 
      meta: { title: 'Mock Content', date: '2024-01-01' }, 
      content: MOCK_MARKDOWN, 
      isJson: false 
    };
  }

  // Ensure path is relative
  const fetchPath = path.startsWith('/') ? path.slice(1) : path;
  
  const response = await fetch(fetchPath);
  if (!response.ok) throw new Error(`Content not found at ${path}`);

  const contentType = path.endsWith('.json') ? 'json' : 'text';
  
  if (contentType === 'json') {
    const data = await response.json();
    return { meta: data, content: data, isJson: true };
  } else {
    const text = await response.text();
    const parsed = parseFrontMatter(text);
    return { meta: parsed.meta, content: parsed.content, isJson: false };
  }
};