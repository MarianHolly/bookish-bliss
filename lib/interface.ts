import { Image } from "sanity";
 
export interface Product {
  id: string;
  slug: string;
  name: string;
  author: string;
  price: number;
  quantity: number;
  image: Image;
  body: any[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  image: Image;
  description: string
}
