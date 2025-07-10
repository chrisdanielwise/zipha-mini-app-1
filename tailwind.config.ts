import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",        // your App Router pages (including not-found.tsx)
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",      // any leftover Pages Router files
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // shared React components
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",      // custom hooks if they contain JSX
  ],
  theme: {
    extend: {
      colors: {
        'water-light': '#e0f7fa',
        'water-dark': '#0a2540',
        water: {
          light: '#e0f7fa',
          DEFAULT: '#b2ebf2',
          dark: '#4dd0e1',
          glass: 'rgba(255,255,255,0.3)',
        },
        glass: 'rgba(255,255,255,0.4)',
      },
      boxShadow: {
        water: '0 4px 32px 0 rgba(80, 200, 255, 0.15), 0 1.5px 4px 0 rgba(0,0,0,0.04)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
      },
      backgroundImage: {
        'water-gradient': 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
      },
    },
  },
  plugins: [],
}
export default config
