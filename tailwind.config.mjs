/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#00597A', // Flash Killer Blue (Brand Base) #058ec4
        'primary-dark': '#00455F', // Accessible Text Blue (4.5:1 on white) #00597A
        industrial: {
          white: '#F9FAFB',
          grey: '#A5A9B4', // Stainless Steel Grey (Decorative/Borders only)
          text: '#565c69', // Accessible Grey Text (4.5:1 on white)
          dark: '#1F2937',
        },
        safety: {
          yellow: '#FACC15',
        },
        uv: {
          blue: '#4f46e5', // Vibrant Indigo
          purple: '#7c3aed', // Strong Violet
          'electric-blue': '#007BFF', // Bright Blue
        }
      },
      spacing: {
        '8pt': '8px',
        '16pt': '16px',
        '24pt': '24px',
        '32pt': '32px',
        '48pt': '48px',
        '64pt': '64px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], // Geometric Sans-Serif
      },
    },
  },
  plugins: [],
}
