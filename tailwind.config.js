/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Dark military palette
        ops: {
          black: '#0a0f0a',
          char: '#11160f',
          panel: '#161c14',
          line: '#2a3326',
          olive: '#3d4a30',
          drab: '#5b6b48',
          sage: '#8a9a73',
          dim: '#6b7560',
        },
        signal: {
          green: '#7cff6b',
          amber: '#ffb547',
          red: '#ff4d4d',
          cyan: '#5be7ff',
        },
      },
      fontFamily: {
        mono: ['Courier', 'monospace'],
      },
    },
  },
  plugins: [],
};
