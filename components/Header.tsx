
import React from 'react';

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);

interface HeaderProps {
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGoHome }) => {
  return (
    <header className="w-full max-w-2xl mx-auto flex justify-between items-center py-3 px-1 mb-4 border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
        歴史マスタークイズ
      </h1>
      <button
        onClick={onGoHome}
        className="flex items-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm"
        aria-label="ホームに戻る"
      >
        <HomeIcon />
        <span className="hidden sm:inline ml-2">ホーム</span>
      </button>
    </header>
  );
};

export default Header;
