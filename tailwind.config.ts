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
                // Primary brand colors (Emerald Family)
                primary: {
                    50: "#DDEBE5",  // Primary Soft
                    100: "#C5DBD1",
                    200: "#9FC0B1",
                    300: "#749E8A",
                    400: "#4F7E69",
                    500: "#064E3B",  // Primary
                    600: "#054031",
                    700: "#043327",
                    800: "#03261d",
                    900: "#022C22",  // Primary Deep
                    950: "#011712",
                },
                // Gold accent (Antique Gold Family)
                gold: {
                    50: "#FCFAF3",
                    100: "#F3E7C3", // Gold Soft
                    200: "#E7D197",
                    300: "#DBAE5F",
                    400: "#CB9137",
                    500: "#B7791F", // Antique Gold
                    600: "#9B6217",
                    700: "#7E4B12",
                    800: "#61360D",
                    900: "#452309",
                    950: "#2D1405",
                },
                // Background colors (Ivory & Parchment)
                cream: {
                    50: "#FDFBF7",  // Literary Ivory
                    100: "#F6F1E7", // Parchment
                    200: "#EAE2D3",
                },
                // Rose color replaced with Muted Slate & Memorial Gray
                rose: {
                    50: "#F1F0ED",  // Tribute Background
                    100: "#E7E5E4", // Memorial Gray
                    200: "#D6D3D1", // Tribute Border
                    300: "#A8A29E",
                    400: "#78716C",
                    500: "#475569", // Memorial Slate / Secondary Text
                    600: "#1F2933", // Charcoal / Primary Text
                    700: "#0F172A",
                    800: "#020617",
                    900: "#000000",
                    950: "#000000",
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                bengali: ['var(--font-noto-bengali)', 'var(--font-hind-siliguri)', 'sans-serif'],
                display: ['"Li Purno Pran"', 'var(--font-noto-bengali)', 'serif'],
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
