import React from 'react';

interface HeaderProps {
    isDarkMode: boolean;
    onToggleTheme: () => void;
}

const ThemeToggle: React.FC<HeaderProps> = ({ isDarkMode, onToggleTheme }) => {
    return (
        <button
            onClick={onToggleTheme}
            className="p-2 rounded-full text-on-surface-muted dark:text-dark-on-surface-muted hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-dark-primary"
            aria-label="Toggle theme"
        >
            {isDarkMode ? (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    );
};


const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleTheme }) => {
  return (
    <header className="bg-surface dark:bg-dark-surface shadow-md z-20 relative border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <svg className="h-8 w-8 text-primary dark:text-dark-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h1 className="ml-3 text-2xl font-bold text-on-surface dark:text-dark-on-surface">WebGIS Situ Pamulang</h1>
          </div>
           <ThemeToggle isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
        </div>
      </div>
    </header>
  );
};

export default Header;