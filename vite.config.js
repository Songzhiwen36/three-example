import { fileURLToPath, URL } from 'node:url'
import { createHtmlPlugin } from 'vite-plugin-html'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// 在 html 中使用环境变量
const getViteEnv = (mode, target) => {
    return loadEnv(mode, process.cwd())[target]
}

// https://vitejs.dev/config/
export default ({ mode }) => 
    defineConfig({
        plugins: [
            vue(),
            createHtmlPlugin({
                inject: {
                    data: {
                        title: getViteEnv(mode, 'VITE_APP_TITLE')
                    }
                }
            })
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    })
