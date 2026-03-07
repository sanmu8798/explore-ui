import { computed, defineComponent, ref, watch } from "vue"
import PickerWrapper, { pickerSlots } from "./PickerWrapper.jsx"
import { DatePicker } from "vant"
import { padZero } from "vant/es/utils"
import { defaultFieldProps } from "../utils"
import { isUndefined } from "lodash-es"
import { isDayjs } from "dayjs"

/**
 * ExDate 日期选择
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExDate",
	props: {
		...defaultFieldProps,

		modelValue: { type: [Date, String, Object], default: () => null },

		/**
		 * 标题
		 */
		title: { type: String, default: "选择日期" },
	},
	emits: ["update:modelValue"],
	setup(props, { emit, slots, expose }) {
		const columnsType = props.defaultProps?.columnsType || ["year", "month", "day"]

		const getYear = (value) => {
			return isDayjs(value) ? value.year() : value.getFullYear()
		}
		const getMonth = (value) => {
			return isDayjs(value) ? value.month() + 1 : value.getMonth() + 1
		}
		const getDate = (value) => {
			return isDayjs(value) ? value.date() : value.getDate()
		}

		const _setValueByColumns = (columnsType, value, date) => {
			columnsType.forEach((column) => {
				if (column === "year") {
					value.push(getYear(date))
				} else if (column === "month") {
					value.push(getMonth(date))
				} else if (column === "day") {
					value.push(getDate(date))
				}
			})
			return value
		}
		const prepareDate = (date) => {
			const value = []

			if (!date) {
				return value
			}

			return _setValueByColumns(columnsType, value, date)
		}

		let defaultValue = prepareDate(props.modelValue)

		if (!defaultValue.length) {
			const now = new Date()
			defaultValue = _setValueByColumns(columnsType, defaultValue, now)
		}

		const componentValue = ref(defaultValue)

		watch(
			() => props.modelValue,
			() => {
				componentValue.value = prepareDate(props.modelValue)
			},
		)

		const pickerRef = ref(null)

		const displayText = computed(() => {
			if (props.modelValue) {
				let text = ""
				columnsType.forEach((column) => {
					if (column === "year") {
						text += getYear(props.modelValue)
					} else if (column === "month") {
						if (text) {
							text += "/"
						}
						text += padZero(getMonth(props.modelValue), 2)
					} else if (column === "day") {
						if (text) {
							text += "/"
						}
						text += padZero(getDate(props.modelValue), 2)
					}
				})
				return text
			}

			return ""
		})

		expose({ displayText })

		const onConfirm = ({ selectedValues }) => {
			pickerRef.value.close()

			const now = new Date()
			let date = {}
			columnsType.forEach((column, index) => {
				if (column === "year") {
					date.year = selectedValues[index]
				} else if (column === "month") {
					date.month = selectedValues[index] - 1
				} else if (column === "day") {
					date.date = selectedValues[index]
				}
			})

			emit(
				"update:modelValue",
				new Date(date.year || now.getFullYear(), isUndefined(date.month) ? now.getMonth() : date.month, date.date || now.getDate()),
			)
		}

		return () => (
			<PickerWrapper ref={pickerRef} closeable={false} disabled={props.disabled || props.readonly}>
				{{
					...pickerSlots(slots, props),
					default: () => (
						<DatePicker
							v-model={componentValue.value}
							onConfirm={onConfirm}
							onCancel={() => pickerRef.value.close()}
							title={props.title}
							{...props.defaultProps}
						/>
					),
				}}
			</PickerWrapper>
		)
	},
})
