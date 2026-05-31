/**
 * EduFlow Tailwind Configuration Note:
 * This project uses Tailwind CSS v4 via @tailwindcss/vite.
 * In Tailwind v4, configuration is handled natively in CSS using the `@theme` directive,
 * eliminating the need for extensive JS configuration files.
 * Theme customizations can be viewed and expanded directly inside `src/index.css`.
 */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
