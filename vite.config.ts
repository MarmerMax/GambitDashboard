import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import checker from "vite-plugin-checker"

export default defineConfig({
    plugins: [react(), checker({ typescript: true })],
    resolve: {
        alias: {
            "@src": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
})
