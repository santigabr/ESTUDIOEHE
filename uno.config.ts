import { defineConfig, presetIcons, presetTypography, presetUno, presetWebFonts } from 'unocss'

export default defineConfig({
  shortcuts: {
    buttons: 'text-gray-300  hover:text-white transition-colors duration-200',
  },
  theme: {
    colors: {
      gris: {
        50: '#F4F4F4',
        100: '#e7e7e7',
        200: '#d1d1d1',
        300: '#b0b0b0',
        400: '#888888',
        500: '#6d6d6d',
        600: '#5d5d5d',
        700: '#4f4f4f',
        800: '#454545',
        900: '#3d3d3d',
        1000: '#111',
      },
      verde: {
        1: '#769206',
      },
    },
  },
  presets: [
    presetUno(),
    presetTypography(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      cdn: 'https://esm.sh/',
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Inter:400,500,600,700,800',
        custom: 'Dawning of a New Day',
        headings: 'Syne:700',
      },
    }),
  ],
})
