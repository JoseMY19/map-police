import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Utilizamos un fallback para asegurar que funcione sin recargar el servidor en desarrollo
    const correctUsername = import.meta.env.VITE_APP_USERNAME || 'admin';
    const correctPassword = import.meta.env.VITE_APP_PASSWORD || 'policia2026';

    if (username.trim() === correctUsername && password.trim() === correctPassword) {
      setIsAuth(true);
      setError('');
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/');
    } else {
      setError('Usuario o contraseña incorrectos. Acceso denegado.');
      setPassword('');
      localStorage.removeItem('isAuthenticated');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0f18] relative overflow-hidden font-sans">
      {/* Fondo Animado y Elementos Decorativos Modernos */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[80px]"></div>
        <div className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] bg-slate-700/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/10 p-8 sm:p-10 transform transition-all">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-slate-800 to-indigo-900/50 mb-6 shadow-[inset_0_2px_20px_rgba(59,130,246,0.3)] border border-blue-500/30 overflow-hidden relative">
              {!imgError ? (
                <img 
                  src="/logo-policia.png" 
                  alt="Logo Policía / Institución" 
                  className="w-full h-full object-cover p-2"
                  onError={() => setImgError(true)}
                />
              ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 text-blue-400 drop-shadow-lg">
                   <path fillRule="evenodd" d="M11.484 2.17a6.621 6.621 0 0 1 1.032 0 11.209 11.209 0 0 0 5.277 2.253.75.75 0 0 1 .593.737 40.407 40.407 0 0 1-1.096 11.047c-1.385 4.316-4.935 7.027-4.935 7.027a.75.75 0 0 1-.91 0s-3.55-2.711-4.936-7.027A40.41 40.41 0 0 1 5.614 5.16.75.75 0 0 1 6.207 4.42a11.209 11.209 0 0 0 5.277-2.253Zm-1.636 9.408a3.116 3.116 0 1 0 4.29-4.288 3.116 3.116 0 0 0-4.29 4.288Z" clipRule="evenodd" />
                 </svg>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 tracking-tight">
              MAPA POLICIAL
            </h1>
            <p className="mt-2 text-sm text-slate-400 font-medium uppercase tracking-widest">
              RUTAS DE PATRULLAJE
            </p>
            <p className="mt-2 text-sm text-slate-400 font-medium uppercase tracking-widest">
                SAN JUAN DE LURIGANCHO
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                Usuario
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-[#0f172a]/60 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-inner sm:text-lg tracking-wide"
                  placeholder="Ingrese su usuario"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-4 bg-[#0f172a]/60 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-inner sm:text-lg tracking-widest"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-slate-400 hover:text-white focus:outline-none transition-colors duration-200 z-10"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center animate-[pulse_1s_ease-in-out]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-400 font-semibold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              Ingresar al Mapa
            </button>
          </form>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 font-medium tracking-wide">
            &copy; 2026 PNP - Uso Exclusivo Autorizado
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
