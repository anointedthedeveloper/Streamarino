import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Sun, Moon, Play, Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-primary-light dark:bg-primary-dark border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-primary-accent font-bold text-2xl">
        <Play className="fill-current" />
        <span>Streamarino</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-primary-accent transition-colors">Home</Link>
        <Link to="/search" className="hover:text-primary-accent transition-colors flex items-center gap-1">
          <Search size={20} />
          <span>Search</span>
        </Link>
        <a
          href="https://github.com/anointedthedeveloper/Streamarino"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-primary-accent hover:text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
        >
          <Star size={14} className="fill-current" />
          Star
        </a>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === 'dark' ? <Sun size={20} className="text-primary-accent" /> : <Moon size={20} className="text-primary-accent" />}
        </button>
      </div>
    </nav>
  );
}
