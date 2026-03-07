import * as components from "./components"
import * as businessComponents from "./business-components"
import { _configStatus } from "./hooks"

export * from "./components"
export * from "./business-components"

const totalComponents = Object.assign({}, components, businessComponents)

export default {
	install(app) {
		for (const componentKey in totalComponents) {
			// eslint-disable-next-line import/namespace
			const component = totalComponents[componentKey]
			//一些 hooks 和 数据并不需要 install
			if (component && component.install) {
				app.use(component)
			}
		}
	},

	/**
	 * 用于配置一些全局的工具参数
	 * @param httpStatus
	 */
	config({ httpStatus }) {
		if (httpStatus && Object.keys(httpStatus).length) {
			_configStatus(httpStatus)
		}
	},
}
