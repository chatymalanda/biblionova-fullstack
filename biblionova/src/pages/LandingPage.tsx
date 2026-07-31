import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Clock, Shield, Star, ArrowRight, Menu, X, ChevronRight, Library } from 'lucide-react';
import { Book } from '../types';
import { api } from '../services/api';
import { adaptBook, BackendBook } from '../services/adapters';

export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [books, setBooks] = useState<Book[]>([]);

  // Le catalogue est une route publique (GET /api/books) : pas besoin d'être connecté.
  useEffect(() => {
    api
      .get<BackendBook[]>('/books', false)
      .then((data) => setBooks(data.map(adaptBook)))
      .catch(() => setBooks([]));
  }, []);

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(searchQ.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQ.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cream font-body overflow-x-hidden">
      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ink-700 rounded-sm flex items-center justify-center">
              <BookOpen size={18} className="text-cream" />
            </div>
            <span className="font-display font-bold text-ink-800 text-lg"> BooKinG</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#catalogue" className="text-sm text-ink-500 hover:text-ink-800 transition-colors">Catalogue</a>
            <a href="#fonctionnalites" className="text-sm text-ink-500 hover:text-ink-800 transition-colors">Fonctionnalités</a>
            <a href="#temoignages" className="text-sm text-ink-500 hover:text-ink-800 transition-colors">Témoignages</a>
            <button onClick={() => navigate('/login')} className="text-sm text-ink-700 font-medium hover:text-ink-900 transition-colors">Connexion</button>
            <button onClick={() => navigate('/register')} className="px-4 py-2 bg-ink-700 text-cream text-sm font-medium rounded-sm hover:bg-ink-800 transition-colors">
              S'inscrire
            </button>
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-cream border-b border-ink-100 px-4 py-4 flex flex-col gap-4">
            <a href="#catalogue" className="text-sm text-ink-600" onClick={() => setMenuOpen(false)}>Catalogue</a>
            <a href="#fonctionnalites" className="text-sm text-ink-600" onClick={() => setMenuOpen(false)}>Fonctionnalités</a>
            <button onClick={() => navigate('/login')} className="text-sm text-left text-ink-700 font-medium">Connexion</button>
            <button onClick={() => navigate('/register')} className="px-4 py-2 bg-ink-700 text-cream text-sm font-medium rounded-sm text-center">S'inscrire</button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-parchment clip-hero hidden lg:block" style={{clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)'}} />
        <div className="absolute top-20 right-10 w-64 h-64 border border-ink-200 rounded-full opacity-20 hidden lg:block" />
        <div className="absolute top-40 right-32 w-40 h-40 border border-ink-300 rounded-full opacity-15 hidden lg:block" />

        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sage-400/15 text-sage-600 text-xs font-medium rounded-full mb-6 border border-sage-400/30">
              <span className="w-1.5 h-1.5 bg-sage-500 rounded-full" />
              Plateforme de gestion d'emprunts
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-ink-800 leading-[1.05] mb-6">
              La bibliothèque
              <br />
              <span className="italic text-ink-400">réinventée</span>
              <br />
              pour vous.
            </h1>

            <p className="text-ink-500 text-lg leading-relaxed mb-8 max-w-lg">
              Une etude demontre que lire 
              permet de reduire de stresse et 
              de stimuller notre cerveau .Alors
              Comme quoi,il est impossible 
              d'avoir du bon temps tout en 
              participant aux aventures 
                incroyables d'Harry
                potter,Hermione et Ron
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/register')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-ink-700 text-cream font-medium rounded-sm hover:bg-ink-800 transition-all group"
              >
                Commencer gratuitement
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 border border-ink-300 text-ink-700 font-medium rounded-sm hover:bg-parchment transition-colors"
              >
                Se connecter
              </button>
            </div>

            <div className="flex items-center gap-6 mt-10">
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-ink-800">2 400+</div>
                <div className="text-xs text-ink-400 mt-0.5">Livres disponibles</div>
              </div>
              <div className="w-px h-8 bg-ink-200" />
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-ink-800">840</div>
                <div className="text-xs text-ink-400 mt-0.5">Lecteurs actifs</div>
              </div>
              <div className="w-px h-8 bg-ink-200" />
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-ink-800">98%</div>
                <div className="text-xs text-ink-400 mt-0.5">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATALOGUE ── */}
      <section id="catalogue" className="py-20 px-4 sm:px-6 bg-parchment/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-medium text-sage-600 tracking-widest uppercase">Notre fonds</span>
              <h2 className="font-display text-4xl font-bold text-ink-800 mt-1">Catalogue</h2>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Chercher un titre, un auteur…"
                className="pl-9 pr-4 py-2.5 bg-cream border border-ink-200 rounded-sm text-sm focus:outline-none focus:border-ink-400 w-64 font-body"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(searchQ ? filtered : books).map((book, i) => (
              <div
                key={book.id}
                className="group bg-cream rounded border border-ink-100 overflow-hidden hover:shadow-lg hover:shadow-ink-200/50 transition-all duration-300"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="relative h-48 overflow-hidden bg-parchment">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent" />
                  <div className={`absolute top-3 right-3 px-2 py-0.5 text-xs font-medium rounded-sm ${book.available ? 'bg-sage-400 text-cream' : 'bg-ink-400 text-cream'}`}>
                    {book.available ? 'Disponible' : 'Emprunté'}
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs text-cream/70 font-mono">{book.genre}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-ink-800 text-lg leading-tight">{book.title}</h3>
                  <p className="text-sm text-ink-400 mt-0.5">{book.author} · {book.year}</p>
                  <p className="text-sm text-ink-500 mt-2 line-clamp-2 leading-relaxed">{book.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-ink-400 font-mono">{book.pages} pages</span>
                    <button
                      onClick={() => navigate('/login')}
                      className="flex items-center gap-1 text-xs text-ink-600 font-medium hover:text-ink-800 transition-colors"
                    >
                      {book.available ? 'Emprunter' : 'Réserver'}
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {searchQ && filtered.length === 0 && (
            <div className="text-center py-12 text-ink-400">
              <Library size={40} className="mx-auto mb-3 opacity-30" />
              <p>Aucun résultat pour « {searchQ} »</p>
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="fonctionnalites" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-medium text-sage-600 tracking-widest uppercase">Ce que nous offrons</span>
            <h2 className="font-display text-4xl font-bold text-ink-800 mt-2">Tout ce dont vous avez besoin</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-ink-100">
            {[
              { icon: Search, title: 'Recherche avancée', desc: 'Trouvez n\'importe quel livre par titre, auteur, genre ou ISBN en quelques secondes.' },
              { icon: Clock, title: 'Suivi des emprunts', desc: 'Consultez vos emprunts en cours, les dates de retour et l\'historique complet.' },
              { icon: Shield, title: 'Rappels automatiques', desc: 'Recevez des notifications avant les dates d\'échéance pour éviter les retards.' },
              { icon: Star, title: 'Recommandations', desc: 'Découvrez de nouveaux titres basés sur vos lectures et vos préférences.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-cream p-8 hover:bg-parchment transition-colors group">
                <div className="w-10 h-10 bg-ink-700 rounded-sm flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon size={20} className="text-cream" />
                </div>
                <h3 className="font-display font-semibold text-ink-800 text-lg mb-2">{title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="temoignages" className="py-20 px-4 sm:px-6 bg-ink-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-medium text-gold-400 tracking-widest uppercase">Ils nous font confiance</span>
            <h2 className="font-display text-4xl font-bold text-cream mt-2">Témoignages</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Fatou Ndiaye', role: 'Étudiante en Lettres', text: 'BiblioNova a transformé ma façon de gérer mes lectures. Je ne rate plus jamais une date de retour !' },
              { name: 'Ibrahim Traoré', role: 'Enseignant', text: 'Interface intuitive, catalogue riche. Mes étudiants adorent cette plateforme pour leurs recherches.' },
              { name: 'Aissatou Bâ', role: 'Passionnée de lecture', text: 'Les recommandations sont incroyablement pertinentes. J\'ai découvert des auteurs magnifiques grâce à BiblioNova.' },
            ].map(({ name, role, text }) => (
              <div key={name} className="bg-ink-700/50 border border-ink-600/50 rounded p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-gold-400 text-gold-400" />)}
                </div>
                <p className="text-ink-100 text-sm leading-relaxed italic mb-6">"{text}"</p>
                <div>
                  <div className="font-display font-semibold text-cream">{name}</div>
                  <div className="text-xs text-ink-400 mt-0.5">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 sm:px-6 bg-parchment">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-ink-800 mb-4">
            Prêt à découvrir
            <br />
            <span className="italic">votre prochaine lecture ?</span>
          </h2>
          <p className="text-ink-500 mb-8">Rejoignez des centaines de lecteurs qui gèrent déjà leurs emprunts avec BiblioNova.</p>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-ink-700 text-cream font-medium rounded-sm hover:bg-ink-800 transition-all group text-lg"
          >
            Créer un compte gratuit
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-ink-900 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-ink-600 rounded-sm flex items-center justify-center">
              <BookOpen size={14} className="text-cream" />
            </div>
            <span className="font-display text-cream font-bold">BooKinG</span>
          </div>
          <p className="text-ink-400 text-xs text-center">
            © 2026 BooKinG · Gestion de bibliothèque simplifiée
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-ink-400 hover:text-cream transition-colors">Confidentialité</a>
            <a href="#" className="text-xs text-ink-400 hover:text-cream transition-colors">Conditions</a>
            <a href="#" className="text-xs text-ink-400 hover:text-cream transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
