export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  image: string | null;
  is_pinned: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Sermon {
  id: string;
  title: string;
  pastor: string;
  scripture: string;
  youtube_url: string | null;
  description: string;
  thumbnail: string | null;
  date: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  caption: string;
  category: string;
  created_at: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  flyer: string | null;
  date: string;
  time: string;
  location: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageContent {
  id: string;
  section_key: string;
  title: string;
  subtitle: string;
  content: string;
  image_url: string | null;
  is_active: boolean;
  updated_at: string;
}

export interface HomepageSettings {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  weekly_scripture: string;
  weekly_scripture_ref: string;
  pastor_message: string;
  announcement_banner: string;
  announcement_banner_active: boolean;
  updated_at: string;
}

export interface DashboardStats {
  totalAnnouncements: number;
  totalSermons: number;
  totalGallery: number;
  totalEvents: number;
  publishedAnnouncements: number;
  publishedSermons: number;
  upcomingEvents: number;
}
