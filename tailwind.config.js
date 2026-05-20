module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      spacing: {
        'gutter': '8px',
      },
      fontSize: {
        'heading': '16px',
        'body': '11px',
      },
      colors: {
        'text-dark': '#1a1a1a',
        'text-light': '#666666',
        'divider': '#e0e0e0',
      }
    },
  },
  plugins: [],
};
