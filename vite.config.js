import { defineConfig } from "rolldown-vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vueJsx(),
	],
	build: {
		lib: {
			entry: ["./index.js", "./hooks/index.js", "./directives/index.js"],
			fileName: (format, entryName) => {
				const extension = format === "es" ? "js" : "cjs"
				return `${entryName}.${extension}`
			},
		},
		sourcemap: true,
		rollupOptions: {
			input: {
				"jobsys-explore": "./index.js",
				hooks: "./hooks/index.js",
				directives: "./directives/index.js",
			},
			// make sure to externalize deps that shouldn't be bundledinto your library
			external: ["vue", "vant", "axios", "lodash-es", "dayjs"],
			output: {
				exports: "named",
				globals: {
					vue: "Vue",
					axios: "axios",
					dayjs: "dayjs",
					vant: "vant",
					"lodash-es": "lodash",
				},
			},
		},
	},
	server: {
		host: true,
		port: 3000,
		proxy: {
			"/api": {
				target: "http://uni-affair.test",
				changeOrigin: true,
			},
		},
	},
})
