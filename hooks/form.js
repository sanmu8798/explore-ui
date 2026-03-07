import { cloneDeep, isArray, isBoolean, isDate, isFunction, isObject, isString, isUndefined } from "lodash-es"
import { STATUS } from "./network"
import { showFailToast, showSuccessToast } from "vant"
import dayjs from "dayjs"

/**
 * 创建一个隐藏的表单
 *
 * @param {Object} options
 * @param {string} options.url
 * @param {Object} options.data
 * @param {string} [options.method]
 * @param {string} options.csrfToken
 * @returns {HTMLFormElement}
 */
export function useHiddenForm(options) {
	const { url, data, csrfToken } = options
	let { method } = options

	method = method || "post"

	const form = document.createElement("form")
	form.action = url
	form.method = method
	form.target = "_blank"
	form.style.display = "none"

	Object.keys(data).forEach((key) => {
		const input = document.createElement("input")
		input.type = "hidden"
		input.name = key
		input.value = data[key]
		form.appendChild(input)
	})

	if (!csrfToken) {
		const input = document.createElement("input")
		input.type = "hidden"
		input.name = "_token"
		input.value = document.querySelector('meta[name="csrf-token"]').getAttribute("content")
		form.appendChild(input)
	}

	document.body.appendChild(form)

	return form
}

/**
 * 处理请求结果
 *
 * @param {object} res 请求结果
 * @param {string|number} res.status 请求结果状态
 * @param {*} res.result 请求结果信息
 * @param {Object.<string, string|function>} ops 状态的处理对象
 */
export function useProcessStatus(res, ops) {
	const { status } = res
	const msg = res.result
	const predefined = {}
	predefined.default = "请求失败, 请检查数据并重试"
	predefined[STATUS.STATE_CODE_FAIL] = "系统错误，请稍候再试"
	predefined[STATUS.STATE_CODE_NOT_FOUND] = "请求的内容不存在"
	predefined[STATUS.STATE_CODE_INFO_NOT_COMPLETE] = "信息不完整"
	predefined[STATUS.STATE_CODE_NOT_ALLOWED] = "没有权限"

	// 有几个常用的自定义名称
	const special = {
		[STATUS.STATE_CODE_SUCCESS]: "success",
	}

	const op = ops[status] || ops[special[status]] || predefined[status] || predefined.default

	if (isString(op)) {
		if (status === STATUS.STATE_CODE_SUCCESS) {
			showSuccessToast(op)
		} else {
			showFailToast(msg || op)
		}
	} else if (isFunction(op)) {
		op()
	}
}

/**
 * 处理正确请求结果
 *
 * @param {object} res 请求结果
 * @param {string} res.status 请求结果状态
 * @param {*} res.result 请求结果信息
 * @param {string|function} success 状态的处理对象
 */
export function useProcessStatusSuccess(res, success) {
	useProcessStatus(res, { success })
}

/**
 * 处理表单提交失败
 * @param {*} e
 */
export function useFormFail(e) {
	if (e && e.errorFields) {
		e.errorFields.forEach((item) => {
			showFailToast(item.errors.join(" "))
		})
	} else if (!(e && e.response)) {
		showFailToast("请检查填写项")
	} else {
		showFailToast("网络异常")
	}
}

/**
 * 处理表单数据
 * @param {Object} form
 * @param {Object} [format] 需要处理的类型
 * @param {boolean|string|Function} [format.date] `true`: 转成时间戳，`string`: 为 Format 格式, 如 `"YYYY-MM-DD"`, `function`: 自定义处理函数, 参数为 dayjs 对象
 * @param {boolean} [format.boolean] 布尔值处理, 如果开启则 `true` 转成 1, `false` 转成 0
 * @param {string|Function} [format.attachment] `string`: 附件字段名, `function`: 自定义处理函数, 参数为附件对象
 * @return {Object}
 */
export function useFormFormat(form, format) {
	//必须先 Copy form, 否则会改变 vm model 里的引用值而导致出错
	const newForm = cloneDeep(form)
	format = format || {}
	const formatter = (obj) => {
		for (let key in obj) {
			//日期处理

			let date
			if (dayjs.isDayjs(obj[key])) {
				date = obj[key]
			} else if (isDate(obj[key])) {
				date = dayjs(obj[key])
			}

			if (date && format.date) {
				if (isString(format.date)) {
					obj[key] = date.format(format.date)
				} else if (isFunction(format.date)) {
					obj[key] = format.date(date)
				} else {
					obj[key] = date.unix()
				}
				continue
			}

			//布尔值处理
			if (isBoolean(obj[key]) && format.boolean) {
				if (format.boolean === true) {
					obj[key] = obj[key] ? 1 : 0
				} else if (Array.isArray(format.boolean)) {
					obj[key] = obj[key] ? format.boolean?.[0] || 1 : format.boolean?.[1] || 0
				}
				continue
			}

			//附件处理
			if (format.attachment) {
				const checker = format.attachment
				if (isObject(obj[key]) && obj[key]._type === "file" && isString(checker) && !isUndefined(obj[key][checker])) {
					obj[key] = obj[key][checker]
					continue
				} else if (isObject(obj[key]) && isFunction(checker) && obj[key]._type === "file") {
					obj[key] = checker(obj[key])
					continue
				}
			}

			//数组处理
			if (isArray(obj[key])) {
				obj[key] = formatter(obj[key])
			}
		}

		return obj
	}

	return formatter(newForm)
}

export default {
	useHiddenForm,
	useProcessStatus,
	useProcessStatusSuccess,
	useFormFail,
	useFormFormat,
}
