import axios from "axios"

export default {
	install(app, options) {
		options = options || {}
		axios.defaults.baseURL = options.baseUrl || "/"
		axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"
		axios.defaults.withCredentials = false

		axios.interceptors.response.use(
			(response) => {
				return response && response.data
			},
			(error) => {
				return Promise.reject(error)
			},
		)

		app.config.globalProperties.$http = axios

		app.provide("http", axios)
	},
}
