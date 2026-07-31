// Le backend (MySQL) et le frontend (types React) n'utilisent pas exactement
// les mêmes noms de champs (français vs anglais) ni tout à fait le même modèle
// (le backend gère un système d'emprunt + lecture par chapitre payante, sans
// dates d'échéance fixes). Ces fonctions font le pont entre les deux.

import { Book, Loan } from '../types';

const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80';

// Durée conventionnelle d'un emprunt, utilisée uniquement côté frontend
// pour afficher une échéance indicative (le backend ne stocke pas de dueDate).
const DUREE_EMPRUNT_JOURS = 21;

export interface BackendBook {
  id: number;
  titre: string;
  auteur: string;
  annee: number | null;
  description: string | null;
  nb_pages: number | null;
  image_url: string | null;
  categorie_id: number | null;
  categorie_nom?: string | null;
}

export interface BackendEmprunt {
  id: number;
  date_emprunt: string;
  statut: 'en_cours' | 'termine';
  book_id: number;
  titre: string;
  auteur: string;
  image_url: string | null;
}

export function adaptBook(b: BackendBook): Book {
  return {
    id: String(b.id),
    title: b.titre,
    author: b.auteur,
    cover: b.image_url || FALLBACK_COVER,
    genre: b.categorie_nom || 'Non classé',
    year: b.annee || 0,
    available: true, // le backend n'a pas de notion de "copie unique indisponible"
    description: b.description || '',
    pages: b.nb_pages || 0,
  };
}

export function adaptEmprunt(e: BackendEmprunt): Loan {
  const borrowed = new Date(e.date_emprunt);
  const due = new Date(borrowed);
  due.setDate(due.getDate() + DUREE_EMPRUNT_JOURS);

  const isOverdue = e.statut === 'en_cours' && due.getTime() < Date.now();

  const bookStub: Book = {
    id: String(e.book_id),
    title: e.titre,
    author: e.auteur,
    cover: e.image_url || FALLBACK_COVER,
    genre: 'Non classé',
    year: 0,
    available: true,
    description: '',
    pages: 0,
  };

  return {
    id: String(e.id),
    bookId: String(e.book_id),
    book: bookStub,
    borrowedDate: e.date_emprunt,
    dueDate: due.toISOString(),
    returnedDate: e.statut === 'termine' ? e.date_emprunt : undefined,
    status: e.statut === 'termine' ? 'returned' : isOverdue ? 'overdue' : 'active',
  };
}
