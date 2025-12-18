/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        'dev-dark': {
          "primary": "#6366f1",
          "secondary": "#3b82f6",
          "accent": "#d946ef",
          "neutral": "#1f2937",
          "base-100": "#14141f", 
          "base-200": "#0f0f17",
          "base-300": "#0a0a0f",
          "info": "#06b6d4",
          "success": "#22c55e",
          "warning": "#eab308",
          "error": "#ef4444",
        },
      },
    ],
  },
}
