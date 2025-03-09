/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/**/*.css',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      transitionProperty: {
        'all': 'all',
      },
      transitionDuration: {
        '200': '200ms',
      },
    },
  },
  plugins: [],
  safelist: [
    'shadow',
    'shadow-sm',
    'shadow-md',
    'shadow-lg',
    'shadow-xl',
    'hover:shadow-sm',
    'hover:shadow-md',
    'hover:shadow-lg',
    'hover:shadow-xl',
    'hover:scale-105',
    'hover:scale-[1.02]',
    'transform',
    'transition-all',
    'transition-transform',
    'transition-shadow',
    'transition-colors',
    'duration-200',
    'cursor-pointer',
    'cursor-text',
    'cursor-not-allowed',
    'cursor-wait',
    'cursor-grab',
    'cursor-grabbing',
    'cursor-ew-resize',
  ],
} 