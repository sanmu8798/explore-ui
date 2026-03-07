import { isArray, isDate, isFunction, isUndefined } from "lodash-es"
import { useAddressFullCode } from "./ExAddress.jsx"
import { isDayjs } from "dayjs"

/**
 * 初始化表单项默认值
 * @param {FormItemConfig} item
 * @param {Object} existingData
 * @param {Object} submitForm
 * @param {Object} provider
 */
const initItemDefaultValue = (item, existingData, submitForm, provider) => {
	let value = ""

	const { uploaderProvider } = provider

	if (existingData && !isUndefined(existingData[item.key])) {
		value = existingData[item.key]
	} else if (!isUndefined(item.defaultValue)) {
		value = isFunction(item.defaultValue) ? item.defaultValue(submitForm) : item.defaultValue
	}

	if (item.init && isFunction(item.init)) {
		value = item.init({ submitForm, value, existingData })
	}

	if (item.type === "number" || item.type === "rate") {
		value = value ? Number(value) : null
	} else if (item.type === "slider") {
		value = item.defaultProps && item.defaultProps.range ? value || [0, 100] : value ? Number(value) : 0
	} else if (item.type === "switch") {
		value = value === "true" || value === 1 || value === "1" || value === true
	} else if (item.type === "date" || item.type === "datetime") {
		value = isDate(value) || isDayjs(value) ? value : null
	} else if (item.type === "checkbox" || item.type === "group" || item.type === "cascade") {
		value = value || []
	} else if (item.type === "address") {
		value = value || []
		if (!isArray(value)) {
			value = useAddressFullCode(value)
		}
	} else if (item.type === "uploader") {
		if (item.defaultProps && item.defaultProps.maxNum && item.defaultProps.maxNum > 1) {
			value = value || []
		} else {
			value = value || {
				[uploaderProvider?.defaultFileItem?.path]: "",
				[uploaderProvider?.defaultFileItem?.url]: "",
			}
		}
	} else if (item.type === "matrix-radio") {
		value = value || {}
	} else if (item.type === "matrix-scale") {
		value = value || {}
	} else if (item.type === "matrix-checkbox") {
		value = value || {}
	}

	return value
}

export { initItemDefaultValue }
