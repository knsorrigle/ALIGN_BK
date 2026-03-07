/** @type {import('tailwindcss').Config} */
// canonical color values — do not duplicate inline
const CREAM = '#F5F0EB';
const BLACK = '#0D0D0D';
const ORANGE = '#FF5C00';

module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                // Canonical design system
                "cream": CREAM,
                "ink": BLACK,
                "primary": ORANGE,
                // Legacy aliases — all resolve to canonical values
                "align-black": BLACK,
                "align-cream-1": CREAM,
                "align-cream-2": CREAM,
                "align-cream-3": CREAM,
                "align-orange-1": ORANGE,
                "align-orange-2": ORANGE,
                "align-orange-3": ORANGE,
                // Non-canonical accents (intentional design choices)
                "electric-green": "#00C853",
                "dot-yellow": "#FFD600",
                "dot-red": "#E03A2F",
                "dot-blue": "#1A1AFF",
                "align-green": "#00C853",
                "align-red": "#E03A2F",
                "align-yellow": "#FFFF00",
                "align-blue": "#0015FF",
                "cobalt": "#1A1AFF",
                "report-pink": "#CF8181",
                "background-dark": "#221610",
            },
            fontFamily: {
                "display": ["PublicSans_400Regular", "PublicSans_700Bold", "PublicSans_900Black"],
            },
            letterSpacing: {
                tighter: -0.8,
                tight: -0.4,
                normal: 0,
                wide: 0.4,
                wider: 0.8,
                widest: 1.6,
            },
        },
    },
    plugins: [],
}
