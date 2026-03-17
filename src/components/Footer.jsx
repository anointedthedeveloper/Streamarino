import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary-light dark:bg-primary-dark border-t border-gray-200 dark:border-gray-800 px-4 py-12">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        <div className="text-center">
          <h2 className="text-primary-accent font-bold text-2xl mb-2">Streamarino</h2>
          <p className="text-gray-500 max-w-md">The best place to watch movies and series online for free.</p>
        </div>

        <div className="bg-primary-accent text-white px-8 py-4 rounded-xl flex items-center gap-4 hover:bg-primary-accent-hover transition-colors shadow-lg">
          <div className="flex flex-col">
            <span className="font-bold">Want to download?</span>
            <span className="text-sm opacity-90">Visit Downloaderino for fast movie downloads.</span>
          </div>
          <a 
            href="https://downloaderino.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white text-primary-accent p-2 rounded-lg hover:scale-105 transition-transform"
          >
            <ExternalLink size={20} />
          </a>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          © {new Date().getFullYear()} Streamarino. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
