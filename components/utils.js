import { cloneDeep, isFunction, isNumber, isString } from "lodash-es"
import { watch } from "vue"
import { useCache, useFetch } from "../hooks"

/**
 * 通用 field props
 */
export const defaultFieldProps = {
	/**
	 * 输入框左侧文本
	 */
	label: { type: String, default: "" },

	/**
	 * 名称，作为提交表单时的标识符
	 */
	name: { type: String, default: "" },

	/**
	 * 输入框占位提示文字
	 */
	placeholder: { type: String, default: "请填写" },

	/**
	 * 提示文案
	 */
	help: { type: [String, Function], default: "" },

	/**
	 * 元素的append slot
	 */
	append: { type: [String, Function], default: "" },

	/**
	 * 是否禁用输入框
	 */
	disabled: { type: Boolean, default: false },

	/**
	 * 是否显示表单必填星号
	 */
	required: { type: Boolean, default: false },

	/**
	 * 是否展示右侧箭头并开启点击反馈
	 */
	isLink: { type: Boolean, default: false },

	/**
	 * 是否为只读状态，只读状态下无法输入内容
	 */
	readonly: { type: Boolean, default: false },

	/**
	 * 表单校验规则
	 */
	rules: { type: Array, default: null },

	/**
	 * 原生 [Field 配置](https://vant-contrib.gitee.io/vant/#/zh-CN/field)
	 */
	fieldProps: { type: Object, default: () => ({}) },

	/**
	 * 原生输入组件的 props
	 */
	defaultProps: { type: Object, default: () => ({}) },
}

/**
 * 原生 Field 的 slots
 * 用于从组合组件中挑选
 */
export const defaultFieldSlots = {
	label: () => null,
	input: () => null,
	"left-icon": () => null,
	"right-icon": () => null,
	button: () => null,
	"error-message": () => null,
	extra: () => null,
}

/**
 * 通用的 options props
 */
export const defaultOptionsProps = {
	/**
	 * 选项
	 */
	options: { type: [Array, Function], default: () => [] },

	/**
	 * 选项 url
	 */
	url: { type: String, default: null },

	/**
	 * 缓存url返回的数据
	 */
	urlCache: { type: Boolean, default: true },

	/**
	 * 选项获取后的回调
	 */
	afterFetched: { type: Function, default: null },
}

/**
 * Prepare options for select
 *
 * @param options
 * @return {Array}
 */
export const prepareOptions = (options) => {
	options = isFunction(options) ? options() : options
	options = cloneDeep(options).map((op) => {
		if (op.children?.length) {
			op.children = prepareOptions(op.children)
		}
		return isString(op) || isNumber(op) ? { value: op, label: op, text: op } : { text: op.label, ...op }
	})
	return options
}

//内部方法，为了useOptionTrait实现单次请求，避免重复请求
const recordOptionsUrl = {}
const optionsFetcher = (props) => {
	return new Promise((resolve) => {
		useFetch()
			.get(props.url)
			.then((items) => {
				if (props.afterFetched) {
					items = props.afterFetched(items)
				}
				resolve(items)
			})
	})
}
/**
 * 初始化选项
 * @param options
 * @param props
 * @param {Array|Function} [defaultOptions]
 *
 * @return void
 */
export const useOptionTrait = async (options, props, defaultOptions) => {
	options.value = prepareOptions(props.options)

	const fetchData = async (props) => {
		if (recordOptionsUrl[props.url]) {
			return recordOptionsUrl[props.url]
		}
		recordOptionsUrl[props.url] = optionsFetcher(props)

		const result = await recordOptionsUrl[props.url]
		recordOptionsUrl[props.url] = null
		return new Promise((resolve) => {
			resolve(result)
		})
	}

	watch(
		() => props.options,
		() => {
			options.value = prepareOptions(props.options)
		},
	)

	if (!options.value.length) {
		if (props.url) {
			if (props.urlCache && useCache(props.url).get()) {
				options.value = useCache(props.url).get()
			} else {
				fetchData(props).then((items) => {
					options.value = items
					if (props.urlCache) {
						useCache(props.url).set(items)
					}
				})
			}
		} else if (defaultOptions) {
			options.value = defaultOptions
		}
	}
}
