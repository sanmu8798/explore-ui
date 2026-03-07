import { computed, defineComponent, ref, watch } from "vue"
import PickerWrapper, { pickerSlots } from "./PickerWrapper.jsx"
import { TimePicker } from "vant"
import { defaultFieldProps } from "../utils"

/**
 * ExTime 日期选择
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExTime",
	props: {
		...defaultFieldProps,

		modelValue: { type: String, default: "" },

		/**
		 * 标题
		 */
		title: { type: String, default: "选择时间" },
	},
	emits: ["update:modelValue"],
	setup(props, { emit, slots, expose }) {
		const columnsType = props.defaultProps?.columnsType || ["hour", "minute"]
		const prepareDate = (time) => {
			const value = []

			if (time) {
				time = time.split(":")
			} else {
				return value
			}

			columnsType.forEach((column, index) => {
				value.push(time[index])
			})

			return value
		}

		const defaultValue = prepareDate(props.modelValue)

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
				columnsType.forEach((column, index) => {
					let times = prepareDate(props.modelValue)

					if (column === "hour") {
						text += `${times[index]}`
					} else if (column === "minute") {
						text += `:${times[index]}`
					} else if (column === "second") {
						text += `:${times[index]}`
					}
				})

				return text
			}

			return ""
		})

		expose({ displayText })

		const onConfirm = ({ selectedValues }) => {
			pickerRef.value.close()
			emit("update:modelValue", selectedValues.join(":"))
		}

		return () => (
			<PickerWrapper ref={pickerRef} closeable={false} disabled={props.disabled || props.readonly}>
				{{
					...pickerSlots(slots, props),
					default: () => (
						<TimePicker
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
