import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 px-4 py-10 mt-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary-accent rounded-lg p-1.5">
            <Play size={14} className="fill-white text-white" />
          </div>
          <span className="font-black text-lg tracking-tight">Streamarino</span>
        </Link>

        <div className="flex items-center gap-6 text-sm text-gray-500">
          <a
            href="https://downloaderino.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-primary-accent transition-colors font-medium"
          >
            <ExternalLink size={14} /> Downloaderino
          </a>
          <a
            href="https://github.com/anointedthedeveloper/Streamarino"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-accent transition-colors"
          >
            GitHub
          </a>
        </div>

        <p className="text-xs text-gray-400">© {new Date().getFullYear()} Streamarino</p>
      </div>
    </footer>
  );
}
