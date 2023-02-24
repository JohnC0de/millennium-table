import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import UnoCSS from "unocss/vite"
import { presetIcons } from "unocss"
import presetWebFonts from "@unocss/preset-web-fonts"
import presetUno from "@unocss/preset-uno"

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
