
export type Category = 'all' | 'clothing' | 'electronics' | 'books';

export interface Product {
  id: string;
  name: string;
  price: number;
  usd: string;
  desc: string;
  cat: Category;
  img: string;
  orderCount: number;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

export interface OrderStats {
  confirmed: number;
  pending: number;
  delivered: number;
}
