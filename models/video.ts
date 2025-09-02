import type { Category } from '~/models/category';

export interface Video{
  id:string;
  title: string;
  category: string;
  slug: string;
  description:string;
  duration: number;
}