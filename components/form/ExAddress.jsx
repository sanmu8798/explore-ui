import { computed, defineComponent, inject, ref, watch } from "vue"
import { Cascader } from "vant"
import localData from "./addressData.json"
import PickerWrapper, { pickerProps, pickerSlots } from "./PickerWrapper.jsx"
import { defaultFieldProps, defaultOptionsProps, useOptionTrait } from "../utils"
import { cloneDeep, isArray, last } from "lodash-es"
import { useFindTextsFromPath } from "../../hooks"
import { EX_ADDRESS } from "../provider/ExProvider.jsx"

/**
 * 地址组件
 *
 * 数据优先级：`dataSource` > `url` > `本地数据`
 *
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExAddress",
	props: {
		...defaultOptionsProps,
		...defaultFieldProps,

		modelValue: { type: [String, Number, Array], default: () => [] },

		/**
		 * 标题
		 */
		title: { type: String, default: "" },

		/**
		 *    生成哪个级别的数据
		 *    1: 省, 2: 省市, 3: 省市区
		 */
		level: { type: Number, default: 3 },

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
	emits: ["update:modelValue"],
	setup(props, { emit, slots, expose }) {
		const addressProvider = inject(EX_ADDRESS, () => ({}))
		const defaultAddressUrl = addressProvider.addressUrl || ""
		const defaultDisplayTextType = addressProvider.displayTextType || ""
		const defaultAfterFetched = addressProvider.afterFetched || ""
		const optionKeys = addressProvider.optionKeys || {}

		const { text: textKey, value: valueKey, children: childrenKey } = optionKeys

		const componentValue = ref("")

		const setModelValue = () => {
			let value = isArray(props.modelValue) ? last(props.modelValue) : props.modelValue
			if (props.textInValue && value) {
				value = value[valueKey]
			}
			componentValue.value = value
		}
		setModelValue()

		watch(
			() => props.modelValue,
			() => setModelValue(),
		)

		const pickerRef = ref(null)
		const options = ref([])

		const displayText = computed(() => {
			if (props.modelValue.length === 0) {
				return ""
			}
			const displayTextType = props.displayTextType || defaultDisplayTextType

			//textInValue状态下的初始值
			if (props.textInValue && props.modelValue && props.modelValue.length === 1) {
				return last(props.modelValue)[textKey]
			}

			//反向赋值
			const mValue = props.textInValue ? props.modelValue.map((item) => item[valueKey]) : props.modelValue
			const optionsTexts = useFindTextsFromPath(options.value, mValue, {
				value: valueKey,
				children: childrenKey,
				label: textKey,
			})

			return displayTextType === "last" ? last(optionsTexts) : optionsTexts.join("/")
		})

		//把默认值赋值给props
		const cloneProps = cloneDeep(props)
		if (!cloneProps.url && defaultAddressUrl) {
			cloneProps.url = defaultAddressUrl
		}
		if (!cloneProps.afterFetched && defaultAfterFetched) {
			cloneProps.afterFetched = defaultAfterFetched
		}
		//先处理好 options
		const dealOptions = () => {
			useOptionTrait(options, cloneProps, localData)
		}
		dealOptions()

		watch(
			() => props.options,
			() => {
				dealOptions()
			},
		)

		const onFinish = ({ selectedOptions }) => {
			pickerRef.value.close()
			emit("update:modelValue", props.textInValue ? selectedOptions : selectedOptions.map((item) => item[valueKey]))
		}

		expose({ displayText })

		/********** render **********/

		return () => (
			<PickerWrapper ref={pickerRef} {...pickerProps(props)}>
				{{
					...pickerSlots(slots, props),
					default: () => (
						<Cascader
							v-model={componentValue.value}
							fieldNames={{ text: textKey, value: valueKey, children: childrenKey }}
							closeable={false}
							showHeader={false}
							options={options.value}
							onFinish={onFinish}
							{...props.defaultProps}
						/>
					),
				}}
			</PickerWrapper>
		)
	},
})

/**
 *
 * 根据地址编码获取完整的地址编码
 *
 * @param code
 * @param {number} [level] 地址级别: 1: 省, 2: 省市, 3: 省市区
 * @return {string[]|(string|*)[]|*[]}
 */
export function useAddressFullCode(code, level) {
	code += ""
	if (code && code.length === 6) {
		if (!level) {
			if (code.endsWith('0000')) {
				level = 1
			} else if (code.endsWith('00')) {
				level = 2
			} else {
				level = 3
			}
		}
		if (level === 1) {
			return [`${code.substr(0, 2)}0000`]
		}
		if (level === 2) {
			return [`${code.substr(0, 2)}0000`, `${code.substr(0, 4)}00`]
		}
		if (level === 3) {
			return [`${code.substr(0, 2)}0000`, `${code.substr(0, 4)}00`, code]
		}
	}
	return []
}

/**
 * 根据地址编码获取完整的地址名称
 * @param code
 * @param {number} [level] 地址级别: 1: 省, 2: 省市, 3: 省市区
 * @return {*[]}
 */
export function useAddressNameFormCode(code, level) {
	if (!isArray(code)) {
		code = useAddressFullCode(code, level)
	}
	return useFindTextsFromPath(localData, code, { value: "code", label: "name", children: "children" })
}

export const addressData = localData
