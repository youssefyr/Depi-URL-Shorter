module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--primary)',
        'secondary': 'var(--secondary)',
        'text-color': 'var(--text-color)',
        'accent': '#3498db',
        'dark-primary': '#1a202c',
        'dark-secondary': '#2d3748',
        'dark-text-color': '#a0aec0',
      },
      boxShadow: {
        'neumorphic': '9px 9px 16px var(--shadow-dark), -9px -9px 16px var(--shadow-light)',
        'neumorphic-inset': 'inset 9px 9px 16px var(--shadow-dark), inset -9px -9px 16px var(--shadow-light)',
        'neumorphic-dark': '9px 9px 16px #111827, -9px -9px 16px #2d3748',
        'neumorphic-dark-inset': 'inset 9px 9px 16px #111827, inset -9px -9px 16px #2d3748',
      },
      backgroundImage: {
        'glow': 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
        'glow-blue': 'radial-gradient(circle at center, rgba(52, 152, 219, 0.15) 0%, rgba(52, 152, 219, 0) 70%)',
      },
    },
  },
  plugins: [],
}