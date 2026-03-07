import { createApp } from "vue"
import "vant/lib/index.css"
import App from "./App.vue"
import http from "./http.js"
import { ExTheme } from "../components/theme"
import Explore from "../index.js"

const app = createApp(App)

/*const status = {
	STATE_CODE_SUCCESS: 1000, // 成功
	STATE_CODE_FAIL: 1001, // 失败
}*/

Explore.config({
	httpStatus: status,
})

app.use(ExTheme)
app.use(http)

app.mount("#app")
