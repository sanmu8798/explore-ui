import { isArray, isDate, isFunction, isUndefined } from "lodash-es"
import { useAddressFullCode } from "../form/ExAddress.jsx"

/**
 * 初始化搜索表单项默认值
 * @param {FormItemConfig} item
 */
const initSearchItemDefaultValue = (item) => {
	let value = ""

	if (!isUndefined(item.defaultValue)) {
		value = isFunction(item.defaultValue) ? item.defaultValue() : item.defaultValue
	}
	if (item.type === "number") {
		value = value ? Number(value) : 0
	} else if (item.type === "date" || item.type === "datetime") {
		value = isDate(value) ? value : null
	} else if (item.type === "checkbox" || item.type === "cascade") {
		value = value || []
	} else if (item.type === "address") {
		value = value || []
		if (!isArray(value)) {
			value = useAddressFullCode(value)
		}
	}

	return value
}

export { initSearchItemDefaultValue }
