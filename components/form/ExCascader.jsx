import { computed, defineComponent, ref, watch } from "vue"
import PickerWrapper, { pickerProps, pickerSlots } from "./PickerWrapper.jsx"
import { Button, Cascader, Search } from "vant"
import { defaultFieldProps, defaultOptionsProps, useOptionTrait } from "../utils"
import { useFindParentLabels } from "../../hooks"
import { cloneDeep, isArray, last } from "lodash-es"

/**
 * ExCascader 级联选择
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExCascader",
	props: {
		...defaultOptionsProps,
		...defaultFieldProps,

		modelValue: { type: [Array, String], default: () => [] },

		/**
		 * 标题
		 */
		title: { type: String, default: "" },

		/**
		 * 是否显示清除按钮
		 */
		clearable: { type: Boolean, default: false },

		/**
		 * 显示值的类型
		 * 空值或all: 所有, last：最后
		 */
		displayTextType: { type: String, default: "" },

		/**
		 * 是否把选项的值返回到modelValue
		 */
		textInValue: { type: Boolean, default: false },
	},
	emits: ["update:modelValue", "change"],
	setup(props, { emit, slots, expose }) {
		const componentValue = ref("")

		const setModelValue = () => {
			let value = isArray(props.modelValue) ? last(props.modelValue) : props.modelValue
			if (props.textInValue && value) {
				value = value.value
			}
			componentValue.value = value
		}
		setModelValue()

		watch(
			() => props.modelValue,
			() => setModelValue(),
		)

		const pickerRef = ref(null)

		const options = ref([]) //整理后的原始 Options
		const shownOptions = ref([]) //根据 keyword 过滤后的 Options
		const keyword = ref("")

		//先处理好 options
		const dealOptions = () => {
			useOptionTrait(options, props)
			shownOptions.value = options.value
		}
		dealOptions()

		watch(
			() => props.options,
			() => {
				dealOptions()
			},
		)

		watch(
			() => keyword.value,
			(keyword) => {
				componentValue.value = ""
				if (keyword) {
					shownOptions.value = filterByText(cloneDeep(options.value), keyword)
				} else {
					shownOptions.value = options.value
				}
			},
		)

		const filterByText = (data, keyword) => {
			// 递归函数，用于过滤每一层级的数据
			function filterRecursively(items) {
				return items.filter((item) => {
					// 判断是否包含关键字
					let hasKeyword = item.text.toLowerCase().includes(keyword.toLowerCase())
					if (item.children && item.children.length) {
						item.children = filterRecursively(item.children)
						if (item.children.length) {
							hasKeyword = true
						}
					}
					// 如果包含关键字，或者有子级包含关键字，则保留该项
					return hasKeyword
				})
			}

			// 调用递归函数开始过滤
			return filterRecursively(data)
		}

		const displayText = computed(() => {
			if (!componentValue.value) {
				return ""
			}

			const labels = useFindParentLabels(options.value, componentValue.value, props.defaultProps?.fieldNames)

			return labels ? (props.displayTextType === "last" ? last(labels) : labels.join("/")) : ""
		})

		const onFinish = ({ selectedOptions }) => {
			const value = props.textInValue ? selectedOptions : selectedOptions.map((item) => item.value)
			emit("change", value)
			emit("update:modelValue", value)
			pickerRef.value.close()
		}

		const onClear = () => {
			emit("change", [])
			emit("update:modelValue", [])
			pickerRef.value.close()
		}

		expose({ displayText })

		return () => (
			<PickerWrapper ref={pickerRef} {...pickerProps(props)}>
				{{
					...pickerSlots(slots, props),
					default: () => [
						<Cascader
							class={"ex-cascader"}
							v-model={componentValue.value}
							closeable={false}
							showHeader={true}
							options={shownOptions.value}
							onFinish={onFinish}
							{...props.defaultProps}
						>
							{{
								title: () => {
									return (
										<Search shape={"round"} placeholder={"选项搜索"} v-model={keyword.value} style={{ width: "100%" }}></Search>
									)
								},
							}}
						</Cascader>,
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
