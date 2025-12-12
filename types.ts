export type ResourceType = 'log' | 'itinerary';

export interface FrontMatter {
  title: string;
  date: string;
  coverImage?: string;
  tags?: string[];
  location?: string;
  duration?: string; // e.g., "5 Days"
  [key: string]: any;
}

export interface ContentItem {
  id: string;
  type: ResourceType;
  slug: string; // Filename without extension
  path: string; // Full path in resources folder e.g. "public/logs/tokyo.md"
  meta: FrontMatter;
  content?: string; // The raw markdown or JSON content
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  places: string[];
  image?: string;
}

export interface ItineraryJson {
  title: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  days: ItineraryDay[];
}

// The structure of the /public/content-manifest.json file
export interface Manifest {
  logs: {
    slug: string;
    path: string;
    title: string;
    date: string;
    tags: string[];
    coverImage: string;
  }[];
  itineraries: {
    slug: string;
    path: string; // Can be .md or .json
    title: string;
    date: string;
    coverImage: string;
  }[];
}
