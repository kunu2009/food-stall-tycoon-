import React from 'react';
import { Github, Instagram, Mail, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-12 bg-slate-900 text-slate-300 py-12 px-6 rounded-t-3xl shadow-2xl">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-teal-400 mb-2 tracking-tight">Made by 7K Ecosystem</h3>
          <p className="text-slate-400 max-w-md text-sm leading-relaxed">
            Building fast, lightweight, and beautiful applications for everyday use. 
            Focused on clean design and seamless user experiences.
          </p>
        </div>
        
        <div className="flex flex-col items-center md:items-end">
          <h4 className="text-lg font-semibold text-white mb-4">About the Creator</h4>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-teal-300 font-medium bg-teal-900/30 px-3 py-1 rounded-full text-sm">Kunal (Founder)</span>
          </div>
          <div className="flex gap-4 mt-3">
            <a href="https://7kc.me" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-full transition-all duration-300 transform hover:-translate-y-1">
              <Globe size={18} />
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-full transition-all duration-300 transform hover:-translate-y-1">
              <Instagram size={18} />
            </a>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-full transition-all duration-300 transform hover:-translate-y-1">
              <Github size={18} />
            </a>
            <a href="mailto:kunal@7kc.me" className="p-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-full transition-all duration-300 transform hover:-translate-y-1">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto mt-10 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center">
        <p>© 2025 7K Ecosystem. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Street Vendor Tycoon (Indian Edition)</p>
      </div>
    </footer>
  );
}
