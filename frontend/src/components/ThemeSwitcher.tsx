import React, { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'synthwave';

const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const themes: { name: Theme; icon: string; label: string }[] = [
    { name: 'light', icon: '☀️', label: 'Light' },
    { name: 'dark', icon: '🌙', label: 'Dark' },
    { name: 'synthwave', icon: '🌆', label: 'Synthwave' },
  ];

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <span className="text-2xl">
          {themes.find(t => t.name === theme)?.icon}
        </span>
      </div>
      <ul tabIndex={0} className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        {themes.map((t) => (
          <li key={t.name}>
            <button
              onClick={() => handleThemeChange(t.name)}
              className={theme === t.name ? 'active' : ''}
            >
              <span className="text-xl">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeSwitcher;