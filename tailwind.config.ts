import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary brand colors
                primary: {
                    50: "#fdf8f3",
                    100: "#faeee0",
                    200: "#f4d9bd",
                    300: "#edbe8f",
                    400: "#e49c5e",
                    500: "#dc8239",
                    600: "#cd6a29",
                    700: "#ab5323",
                    800: "#8a4423",
                    900: "#703a20",
                    950: "#3d1c0e",
                },
                // Gold accent
                gold: {
                    50: "#fdfcf3",
                    100: "#faf8e0",
                    200: "#f4efc1",
                    300: "#ede297",
                    400: "#e5d06b",
                    500: "#dbb943",
                    600: "#c79d32",
                    700: "#a67a29",
                    800: "#866027",
                    900: "#6e4f24",
                    950: "#3e2a11",
                },
                // Background colors
                cream: {
                    50: "#fffef7",
                    100: "#fffceb",
                    200: "#fff8d1",
                },
                // Rose color for condolence section
                rose: {
                    50: "#fff1f2",
                    100: "#ffe4e6",
                    200: "#fecdd3",
                    300: "#fda4af",
                    400: "#fb7185",
                    500: "#f43f5e",
                    600: "#e11d48",
                    700: "#be123c",
                    800: "#9f1239",
                    900: "#881337",
                    950: "#4c0519",
                },
            },
            fontFamily: {
                // Force Li Purno Pran for all text types to ensure consistency
                bengali: ['"Li Purno Pran"', '"Hind Siliguri"', '"Anek Bangla"', '"Noto Serif Bengali"', '"Noto Sans Bengali"', 'serif'],
                display: ['"Li Purno Pran"', '"Playfair Display"', '"Noto Serif Bengali"', 'serif'],
                sans: ['"Li Purno Pran"', '"Inter"', 'system-ui', 'sans-serif'],
                serif: ['"Li Purno Pran"', '"Noto Serif Bengali"', 'serif'],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "hero-pattern": "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
