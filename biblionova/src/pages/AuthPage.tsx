import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, BookOpen, ArrowRight } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'reset';
interface Props { defaultMode?: AuthMode; }

function LibraryIllustration() {
  return (
    <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs mx-auto">
      <circle cx="180" cy="150" r="100" fill="#F0E8D8" opacity="0.5"/>
      <circle cx="200" cy="120" r="60" fill="#E8DDD4" opacity="0.4"/>
      <rect x="40" y="220" width="240" height="8" rx="4" fill="#B8957A" opacity="0.4"/>
      <rect x="55" y="180" width="40" height="40" rx="3" fill="#5C3A1E"/>
      <rect x="58" y="183" width="34" height="37" rx="2" fill="#7A4F2B"/>
      <rect x="60" y="185" width="3" height="33" fill="#9B6F4A" opacity="0.6"/>
      <rect x="50" y="165" width="50" height="18" rx="3" fill="#3E6644"/>
      <rect x="53" y="167" width="44" height="14" rx="2" fill="#5C8261"/>
      <rect x="45" y="150" width="55" height="18" rx="3" fill="#B8960C"/>
      <rect x="48" y="152" width="49" height="14" rx="2" fill="#D4AF37"/>
      {/* Corps */}
      <rect x="145" y="115" width="50" height="65" rx="8" fill="#7A4F2B"/>
      <rect x="155" y="115" width="30" height="65" rx="4" fill="#FAF7F2"/>
      {/* Tête */}
      <circle cx="170" cy="95" r="20" fill="#D4AF37" opacity="0.9"/>
      <circle cx="164" cy="92" r="2.5" fill="#3E2510"/>
      <circle cx="176" cy="92" r="2.5" fill="#3E2510"/>
      <path d="M164 100 Q170 105 176 100" stroke="#3E2510" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M150 86 Q153 73 170 71 Q187 73 190 86 Q185 76 170 74 Q155 76 150 86Z" fill="#211206"/>
      {/* Livre */}
      <rect x="128" y="153" width="45" height="35" rx="4" fill="#3E6644" transform="rotate(-10 128 153)"/>
      <rect x="131" y="155" width="39" height="31" rx="3" fill="#5C8261" transform="rotate(-10 131 155)"/>
      <line x1="133" y1="162" x2="166" y2="156" stroke="#FAF7F2" strokeWidth="1.5" opacity="0.6"/>
      <line x1="134" y1="167" x2="167" y2="161" stroke="#FAF7F2" strokeWidth="1.5" opacity="0.6"/>
      {/* Bras */}
      <path d="M145 135 Q125 150 130 163" stroke="#7A4F2B" strokeWidth="14" strokeLinecap="round" fill="none"/>
      <path d="M195 135 Q210 150 200 163" stroke="#7A4F2B" strokeWidth="14" strokeLinecap="round" fill="none"/>
      {/* Jambes */}
      <rect x="152" y="178" width="16" height="42" rx="8" fill="#3E2510"/>
      <rect x="172" y="178" width="16" height="42" rx="8" fill="#3E2510"/>
      <ellipse cx="160" cy="220" rx="12" ry="5" fill="#211206"/>
      <ellipse cx="180" cy="220" rx="12" ry="5" fill="#211206"/>
      {/* Livres flottants */}
      <rect x="220" y="100" width="30" height="22" rx="3" fill="#5C3A1E" transform="rotate(15 220 100)"/>
      <rect x="223" y="102" width="24" height="18" rx="2" fill="#9B6F4A" transform="rotate(15 223 102)"/>
      <rect x="228" y="58" width="25" height="18" rx="3" fill="#3E6644" transform="rotate(-8 228 58)"/>
      <rect x="231" y="60" width="21" height="14" rx="2" fill="#7A9E7E" transform="rotate(-8 231 60)"/>
      <circle cx="110" cy="80" r="3" fill="#D4AF37" opacity="0.7"/>
      <circle cx="240" cy="160" r="2" fill="#D4AF37" opacity="0.5"/>
      <text x="104" y="74" fontSize="13" fill="#D4AF37" opacity="0.8">✦</text>
      <text x="247" y="138" fontSize="9" fill="#B8960C" opacity="0.7">✦</text>
    </svg>
  );
}

export default function AuthPage({ defaultMode = 'login' }: Props) {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'login') {
      if (!email || !password) { setError('Veuillez remplir tous les champs.'); setLoading(false); return; }
      const result = await login(email, password);
      if (result.ok) navigate('/dashboard');
      else { setError(result.error || 'Identifiants incorrects.'); setLoading(false); }
    } else if (mode === 'register') {
      if (!name || !email || !password || !confirm) { setError('Veuillez remplir tous les champs.'); setLoading(false); return; }
      if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); setLoading(false); return; }
      if (password.length < 6) { setError('Minimum 6 caractères.'); setLoading(false); return; }

      // Le backend attend "nom" et "prenom" séparément : on découpe le nom complet.
      const [prenom, ...rest] = name.trim().split(' ');
      const nom = rest.length > 0 ? rest.join(' ') : prenom;

      const result = await register(nom, prenom, email, password);
      if (result.ok) navigate('/dashboard');
      else { setError(result.error || 'Une erreur est survenue.'); setLoading(false); }
    } else {
      if (!email) { setError('Veuillez entrer votre adresse e-mail.'); setLoading(false); return; }
      // Pas de route "mot de passe oublié" côté backend pour l'instant.
      setResetSent(true);
      setLoading(false);
    }
  };

  const inp = "w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white/70 focus:outline-none focus:border-ink-500 focus:bg-white transition-all placeholder:text-gray-300 font-body";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-body"
      style={{ background: 'linear-gradient(135deg, #174fc0 0%, #5C3A1E 35%, #7A4F2B 65%, #9B6F4A 100%)' }}
    >
      {/* Cercles décoratifs de fond */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full border border-white/8" />
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full border border-white/6" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full border border-white/8" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full border border-white/6" />
        <div className="absolute top-1/2 -right-10 w-44 h-44 rounded-full border border-white/5" />
        {[...Array(14)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 rounded-full bg-white/10"
            style={{ top: `${8 + i * 7}%`, left: `${4 + (i % 5) * 20}%` }} />
        ))}
      </div>

      {/* ── CARTE CENTRALE (style Figma) ── */}
      <div className="relative w-full max-w-3xl bg-white/96 backdrop-blur-sm rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">
        <div className="flex flex-col lg:flex-row">

          {/* GAUCHE : FORMULAIRE */}
          <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center">

            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 bg-ink-700 rounded-xl flex items-center justify-center shadow">
                <BookOpen size={18} className="text-cream" />
              </div>
              <div>
                <span className="font-display font-bold text-ink-800 text-sm leading-none block">BiblioNova</span>
                <span className="text-[10px] text-ink-400 leading-none">Votre logo ici</span>
              </div>
            </div>

            {/* Titre */}
            <div className="mb-5">
              <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-widest mb-0.5">
                {mode === 'login' && 'Bienvenue !'}
                {mode === 'register' && 'Rejoignez-nous'}
                {mode === 'reset' && 'Récupération'}
              </p>
              <h1 className="font-display text-3xl font-bold text-ink-900">
                {mode === 'login' && 'Connexion'}
                {mode === 'register' && 'Inscription'}
                {mode === 'reset' && 'Mot de passe oublié ?'}
              </h1>
            </div>

            {/* Feedback */}
            {resetSent && mode === 'reset' && (
              <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl mb-4">
                <CheckCircle size={15} className="text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-green-600">Lien envoyé ! Vérifiez votre boîte e-mail.</p>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-4 text-xs text-red-600">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <div>
                  <label className="text-xs font-medium text-ink-600 block mb-1.5">Nom complet</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Amadou Diallo" className={inp} />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-ink-600 block mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.sn" className={inp} />
                </div>
              </div>

              {mode !== 'reset' && (
                <div>
                  <label className="text-xs font-medium text-ink-600 block mb-1.5">Mot de passe</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={`${inp} pr-10`} />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ink-600">
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="text-xs font-medium text-ink-600 block mb-1.5">Confirmer mot de passe</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" className={inp} />
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
                    <input type="checkbox" className="w-3.5 h-3.5 accent-ink-700 rounded" />
                    Se souvenir de moi
                  </label>
                  <button type="button" onClick={() => { setMode('reset'); setError(''); setResetSent(false); }} className="text-xs text-ink-500 hover:text-ink-700">
                    Mot de passe oublié ?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 mt-1 transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-lg disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #9B6F4A, #5C3A1E)' }}
              >
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Traitement…</>
                  : <>
                    {mode === 'login' && 'Se connecter'}
                    {mode === 'register' && 'Créer mon compte'}
                    {mode === 'reset' && 'Envoyer le lien'}
                    {mode !== 'reset' && <ArrowRight size={15} />}
                  </>
                }
              </button>
            </form>

            {/* Liens secondaires */}
            <p className="mt-5 text-xs text-center text-gray-400">
              {mode === 'reset'
                ? <button onClick={() => { setMode('login'); setError(''); setResetSent(false); }} className="text-ink-600 hover:text-ink-800 font-medium">← Retour à la connexion</button>
                : mode === 'login'
                  ? <>Pas encore inscrit ?{' '}<button onClick={() => { setMode('register'); setError(''); }} className="text-ink-700 font-semibold hover:text-ink-900">Créer un compte</button></>
                  : <>Déjà inscrit ?{' '}<button onClick={() => { setMode('login'); setError(''); }} className="text-ink-700 font-semibold hover:text-ink-900">Se connecter</button></>
              }
            </p>
            <button onClick={() => navigate('/')} className="mt-2 text-xs text-center text-gray-300 hover:text-gray-500 w-full transition-colors">
              ← Retour à l'accueil
            </button>
          </div>

          {/* DROITE : ILLUSTRATION */}
          <div
            className="hidden lg:flex flex-col items-center justify-center w-72 xl:w-80 p-8 relative overflow-hidden flex-shrink-0"
            style={{ background: 'linear-gradient(160deg, #F5F0EB 0%, #E8DDD4 60%, #D1BAAA 100%)' }}
          >
            <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-ink-200/25 translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-ink-300/15 -translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border-2 border-ink-200/25" />

            <div className="relative z-10 mb-4">
              <LibraryIllustration />
            </div>

            <div className="relative z-10 text-center px-2">
              <p className="font-display font-semibold text-ink-700 text-base">
                {mode === 'login' ? 'Retrouvez vos lectures' : mode === 'register' ? 'Commencez à lire' : 'On vous aide !'}
              </p>
              <p className="text-xs text-ink-500 mt-1 leading-relaxed">
                {mode === 'login' ? 'Accédez à vos emprunts et votre historique.' : mode === 'register' ? 'Gérez vos livres simplement.' : 'Récupérez votre accès rapidement.'}
              </p>
            </div>

            <div className="relative z-10 flex gap-2 mt-5">
              <div className="bg-white/60 rounded-xl px-3 py-2 text-center shadow-sm">
                <div className="font-display font-bold text-ink-800 text-lg leading-none">2400+</div>
                <div className="text-[10px] text-ink-500 mt-0.5">Livres</div>
              </div>
              <div className="bg-white/60 rounded-xl px-3 py-2 text-center shadow-sm">
                <div className="font-display font-bold text-ink-800 text-lg leading-none">840</div>
                <div className="text-[10px] text-ink-500 mt-0.5">Lecteurs</div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
