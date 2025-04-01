/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#00FFD0", // Neon Aqua
          foreground: "#0D0F1A", // Deep Space Navy
        },
        secondary: {
          DEFAULT: "#1A1F2E", // Steel Grey
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#FF7F50", // Coral
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#0D0F1A", // Deep Space Navy
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#0D0F1A",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#0D0F1A",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        glow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'glow': 'glow 2s ease-in-out infinite'
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};