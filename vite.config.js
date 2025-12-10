import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: `${process.env.VITE_URL_BACK}||http://localhost:3000`,
                changeOrigin: true,
            },
        },
    },
});
