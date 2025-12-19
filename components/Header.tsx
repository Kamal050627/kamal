
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <i className="fa-solid fa-face-smile-beam text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sentix</h1>
              <p className="text-xs text-slate-500 font-medium">E-commerce Insights</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
               <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
               AI Engine Online
             </span>
             <a 
               href="https://ai.google.dev" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-slate-400 hover:text-slate-600 transition-colors"
             >
               <i className="fa-brands fa-google text-lg"></i>
             </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
