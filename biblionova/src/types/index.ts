export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre: string;
  year: number;
  available: boolean;
  description: string;
  pages: number;
}

export interface Loan {
  id: string;
  bookId: string;
  book: Book;
  borrowedDate: string;
  dueDate: string;
  returnedDate?: string;
  status: 'active' | 'returned' | 'overdue';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  memberSince: string;
}

export interface Stats {
  totalLoans: number;
  activeLoans: number;
  returnedLoans: number;
  overdueLoans: number;
}
