import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import UnoCSS from "unocss/vite"
import { presetIcons, presetUno, presetWebFonts } from "unocss"

export default defineConfig({
  plugins: [
    react(),
    UnoCSS({
      presets: [
        presetUno(),
        presetWebFonts({
          fonts: {
            inter: "Inter"
          }
        }),
        presetIcons()
      ]
    })
  ]
})
