import { computed, defineComponent, ref, watch } from "vue"
import PickerWrapper, { pickerSlots } from "./PickerWrapper.jsx"
import { Button, Form, Picker, Search } from "vant"
import { defaultFieldProps, defaultOptionsProps } from "../utils"
import { useFetch } from "../../hooks"
import { cloneDeep, find, isArray, isFunction, isNumber, isString } from "lodash-es"

/**
 * ExSelect 下拉选择
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExSelect",
	props: {
		...defaultOptionsProps,
		...defaultFieldProps,

		modelValue: { type: [Array, String, Number, Object], default: "" },

		/**
		 * 标题
		 */
		title: { type: String, default: "" },

		/**
		 * 是否显示清除按钮
		 */
		clearable: { type: Boolean, default: false },

		/**
		 * 是否把选项的值返回到modelValue
		 */
		textInValue: { type: Boolean, default: false },

		/**
		 * 是否可以搜索
		 */
		filterable: { type: Boolean, default: false },

		/**
		 * 搜索链接
		 */
		filterUrl: { type: String, default: "" },

		/**
		 * 自定义渲染选项
		 */
		optionRender: { type: Function, default: null },
	},
	emits: ["update:modelValue", "change"],
	setup(props, { emit, slots, expose }) {
		const componentValue = ref([])
		const options = ref([])
		const recordOptions = ref([]) // 缓存 options
		let columns = 1 //根据子项的数组数来确定 Picker 的列数，默认为1列
		const pickerRef = ref()
		const keyword = ref("")
		const fetcher = ref({ loading: false })

		const setModelValue = () => {
			let value = isArray(props.modelValue) ? props.modelValue : [props.modelValue]
			if (props.textInValue && value.length) {
				value = value.map((item) => item.value)
			}
			componentValue.value = value
		}
		setModelValue()

		watch(
			() => props.modelValue,
			() => setModelValue(),
		)

		const displayText = computed(() => {
			if (!props.modelValue || (isArray(props.modelValue) && !props.modelValue.length)) {
				return ""
			}
			let modelValue = isArray(props.modelValue) ? props.modelValue : [props.modelValue]
			return modelValue
				.map((value, index) => {
					if (props.textInValue) {
						value = value.value
					}
					if (columns === 1) {
						return find(options.value, { value })?.text
					} else {
						return find(options.value[index], { value })?.text
					}
				})
				?.join("/")
		})

		const fetchData = () =>
			new Promise((resolve) => {
				useFetch()
					.get(props.url)
					.then((items) => {
						if (props.afterFetched) {
							items = props.afterFetched(items)
						}
						resolve(items)
					})
			})

		const prepareOptions = async (options) => {
			options = isFunction(options) ? options() : options
			if (options && options.length) {
				columns = options.filter((option) => isArray(option)).length || 1
			} else if (props.url) {
				options = await fetchData()
			}

			options = options.map((option) => {
				if (isArray(option)) {
					return option.map((op) => {
						return isString(op) || isNumber(op) ? { value: op, label: op, text: op } : { text: op.label, ...op }
					})
				}

				return isString(option) ? { value: option, label: option, text: option } : { text: option.label, ...option }
			})

			recordOptions.value = cloneDeep(options)

			return options
		}

		prepareOptions(props.options).then((opts) => {
			options.value = opts
		})

		watch(
			() => props.options,
			() => prepareOptions(props.options).then((opts) => (options.value = opts)),
		)

		const filterOnlineDataByKeyword = async () => {
			let res = await useFetch(fetcher.value).get(props.filterUrl, { params: { keyword: keyword.value } })
			if (props.afterFetched) {
				res = props.afterFetched(res)
			}
			prepareOptions(res).then((opts) => (options.value = opts))
		}

		const filterLocalDataByKeyword = () => {
			options.value = recordOptions.value.filter((item) => item.text.includes(keyword.value))
		}

		// @hack
		// 由于在 Picker 清除 model value 后再次打开 Picker 在不重新选择新选项的情况下无法选中之前的选项
		// 所以这里手动重新赋一次值给 model value
		const onOpenWrapper = () => {
			if (columns === 1 && !componentValue.value?.[0]) {
				componentValue.value = [options.value[0]?.value]
			}
		}

		const onConfirm = ({ selectedOptions }) => {
			let value = props.textInValue ? selectedOptions : selectedOptions.map((item) => item.value)
			value = columns === 1 ? value[0] : value
			emit("change", value)
			emit("update:modelValue", value)
			pickerRef.value.close()
		}

		const onSearch = () => {
			if (keyword.value) {
				if (props.filterUrl) {
					filterOnlineDataByKeyword()
				} else {
					filterLocalDataByKeyword()
				}
			} else {
				if (props.filterUrl) {
					filterOnlineDataByKeyword()
				} else {
					filterLocalDataByKeyword()
				}
			}
		}

		const onSearchClear = () => {
			if (props.filterUrl) {
				filterOnlineDataByKeyword()
			} else {
				filterLocalDataByKeyword()
			}
		}

		const onClear = () => {
			const value = columns === 1 ? null : []
			emit("change", value)
			emit("update:modelValue", value)
			pickerRef.value.close()
		}

		expose({ displayText })

		/********** render **********/

		const pickerSlotElem = () => {
			const elem = {}
			if (props.filterable) {
				elem["columns-top"] = () => (
					<Form action="/">
						<Search
							shape={"round"}
							placeholder={"搜索"}
							v-model={keyword.value}
							onSearch={onSearch}
							onUpdate:modelValue={onSearch}
							onClear={onSearchClear}
							style={{ width: "100%" }}
						></Search>
					</Form>
				)
			}
			if (props.optionRender) {
				elem["option"] = (option, index) => props.optionRender(option, index)
			}
			return elem
		}

		return () => (
			<PickerWrapper ref={pickerRef} closeable={false} onOpen={onOpenWrapper} disabled={props.readonly || props.disabled}>
				{{
					...pickerSlots(slots, props),
					default: () => [
						<Picker
							v-model={componentValue.value}
							columns={options.value}
							onConfirm={onConfirm}
							loading={fetcher.value.loading}
							onCancel={() => pickerRef.value.close()}
							{...props.defaultProps}
						>
							{pickerSlotElem()}
						</Picker>,
						props.clearable ? (
							<div class={"ex-field-popup__clear-btn"}>
								<Button block type={"primary"} plain={true} round={true} onClick={onClear}>
									清除
								</Button>
							</div>
						) : null,
					],
				}}
			</PickerWrapper>
		)
	},
})
