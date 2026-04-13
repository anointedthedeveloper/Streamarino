import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Play, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (query.trim()) { navigate(`/search?q=${encodeURIComponent(query.trim())}`); setOpen(false); }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-gray-200/60 dark:border-gray-800/60 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-primary-accent rounded-lg p-1.5">
            <Play size={16} className="fill-white text-white" />
          </div>
          <span className="font-black text-xl tracking-tight">Streamarino</span>
        </Link>

        {/* Inline search — hidden on mobile */}
        <form onSubmit={submit} className="hidden md:flex flex-1 max-w-md relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, series..."
            className="w-full bg-gray-100 dark:bg-gray-900 rounded-xl py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary-accent/50 transition-all"
          />
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {open ? <X size={20} /> : <Search size={20} />}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'dark'
              ? <Sun size={20} className="text-primary-accent" />
              : <Moon size={20} className="text-primary-accent" />}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {open && (
        <form onSubmit={submit} className="md:hidden mt-2 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, series..."
            className="w-full bg-gray-100 dark:bg-gray-900 rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary-accent/50 transition-all"
          />
        </form>
      )}
    </nav>
  );
}
