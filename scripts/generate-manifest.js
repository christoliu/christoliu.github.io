const fs = require('fs');
const path = require('path');

// Configuration
const RESOURCES_DIR = path.join(__dirname, '../public');
const MANIFEST_PATH = path.join(RESOURCES_DIR, 'content-manifest.json');

// Helper to parse FrontMatter from Markdown strings
// Looks for content between --- and ---
const parseFrontMatter = content => {
  const match = content.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/);
  if (!match) return {};

  const meta = {};
  const metaRaw = match[1];

  metaRaw.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Handle simple arrays like [a, b, c]
      // Logic: Remove brackets, split by comma, trim spaces, AND remove quotes if present
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value
          .slice(1, -1)
          .split(',')
          .map(s => s.trim().replace(/^['"]|['"]$/g, '')); // Remove surrounding quotes
      }

      meta[key] = value;
    }
  });

  return meta;
};

// Process Logs
const processLogs = () => {
  const logsDir = path.join(RESOURCES_DIR, 'logs');
  if (!fs.existsSync(logsDir)) return [];

  const files = fs.readdirSync(logsDir).filter(f => f.endsWith('.md'));

  return files
    .map(filename => {
      const filePath = path.join(logsDir, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      const meta = parseFrontMatter(content);

      return {
        slug: filename.replace('.md', ''),
        path: `logs/${filename}`,
        title: meta.title || 'Untitled Log',
        date: meta.date || new Date().toISOString().split('T')[0],
        tags: Array.isArray(meta.tags) ? meta.tags : [],
        coverImage: meta.coverImage || ''
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date desc
};

// Process Itineraries
const processItineraries = () => {
  const itinDir = path.join(RESOURCES_DIR, 'itineraries');
  if (!fs.existsSync(itinDir)) return [];

  const files = fs.readdirSync(itinDir).filter(f => f.endsWith('.json') || f.endsWith('.md'));

  return files
    .map(filename => {
      const filePath = path.join(itinDir, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      let meta = {};

      if (filename.endsWith('.json')) {
        try {
          const json = JSON.parse(content);
          meta = {
            title: json.title,
            date: json.startDate || json.date, // Support both fields
            coverImage: json.coverImage
          };
        } catch (e) {
          console.error(`Error parsing JSON ${filename}:`, e);
        }
      } else if (filename.endsWith('.md')) {
        meta = parseFrontMatter(content);
      }

      return {
        slug: filename.replace(/\.(json|md)$/, ''),
        path: `itineraries/${filename}`,
        title: meta.title || 'Untitled Trip',
        date: meta.date || new Date().toISOString().split('T')[0],
        coverImage: meta.coverImage || ''
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

const main = () => {
  console.log('🔍 Scanning resources...');

  const logs = processLogs();
  const itineraries = processItineraries();

  const manifest = {
    logs,
    itineraries
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`✅ Manifest generated with ${logs.length} logs and ${itineraries.length} itineraries.`);
  console.log(`📍 Saved to: ${MANIFEST_PATH}`);
};

main();
