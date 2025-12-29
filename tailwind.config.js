/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nova-blue': '#1e40af', // สีน้ำเงินธีม NovaPay (ตัวอย่าง)
        'nova-green': '#10b981', // สีเขียวปุ่ม
      }
    },
  },
  plugins: [],
}