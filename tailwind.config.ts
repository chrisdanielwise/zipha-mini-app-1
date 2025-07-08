import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",        // your App Router pages (including not-found.tsx)
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",      // any leftover Pages Router files
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // shared React components
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",      // custom hooks if they contain JSX
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
