import type { Category } from '~/models/category';

export interface Video {
  id: string;
  title: string;
  category: string;
  slug: string;
  description: string;
  duration: number;
  tags: string[]
}

export interface VideoCard {
  title: string;
  category: string;
  slug: string;
  duration: string;
}
