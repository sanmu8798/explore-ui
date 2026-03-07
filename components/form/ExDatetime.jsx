import PickerWrapper, { pickerSlots } from "./PickerWrapper.jsx"
import { ref, defineComponent, computed, watch } from "vue"
import { Calendar, Collapse, CollapseItem, TimePicker } from "vant"
import ExButton from "../button/ExButton.jsx"
import { padZero } from "vant/es/utils"
import { defaultFieldProps } from "../utils"
import { cloneDeep } from "lodash-es"

/**
 * ExDatetime 日期时间选择器
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExDatetime",
	props: {
		...defaultFieldProps,

		modelValue: { type: Date, default: () => null },
	},
	emits: ["update:modelValue"],
	setup(props, { slots, emit, expose }) {
		const dateValue = ref(null)
		const timeValue = ref(null)
		const displayText = ref(null)
		const pickerRef = ref()

		const activeName = ref("date")

		const minDate = new Date(2010, 0, 1)
		const maxDate = new Date(2045, 11, 31)

		const weekdays = ["日", "一", "二", "三", "四", "五", "六"]

		const dateText = computed(() => {
			if (dateValue.value) {
				return `${dateValue.value.getFullYear()}/${dateValue.value.getMonth() + 1}/${dateValue.value.getDate()} 星期${
					weekdays[dateValue.value.getDay()]
				}`
			}
			return "请选择日期"
		})
		const timeText = computed(() => {
			if (timeValue.value) {
				return timeValue.value
			}
			return "请选择时间"
		})
		const timeModel = computed(() => {
			if (timeValue.value) {
				const [hours, minutes] = timeValue.value.split(":")
				return [hours, minutes]
			}
			return []
		})

		const defaultDate = ref(props.modelValue || new Date())

		const setDisplayText = () => {
			displayText.value = dateValue.value && timeValue.value ? `${dateText.value} ${timeText.value}` : ""
		}
		/**
		 *
		 * @param {Date|null} date
		 */
		const prepareDate = (date) => {
			if (date) {
				dateValue.value = cloneDeep(date)
				timeValue.value = `${padZero(date.getHours(), 2)}:${padZero(date.getMinutes(), 2)}`
			}
			setDisplayText()
		}

		prepareDate(props.modelValue)

		watch(
			() => props.modelValue,
			() => prepareDate(props.modelValue),
		)

		expose({ displayText })

		const onSelectDate = (date) => {
			dateValue.value = date
		}

		const onTimeChange = ({ selectedValues }) => {
			timeValue.value = selectedValues.join(":")
		}

		const onConfirm = () => {
			if (!dateValue.value) {
				dateValue.value = new Date()
			}
			let dateString = `${dateValue.value.getFullYear()}/${dateValue.value.getMonth() + 1}/${dateValue.value.getDate()}`

			if (!timeValue.value) {
				dateString += ` 00:00:00`
			} else {
				dateString += ` ${timeValue.value}`
			}

			pickerRef.value.close()
			setDisplayText()

			emit("update:modelValue", new Date(dateString))
		}

		return () => {
			return (
				<PickerWrapper ref={pickerRef} inset={true} disabled={props.disabled || props.readonly}>
					{{
						...pickerSlots(slots, props),
						default: () => [
							<Collapse accordion={true} v-model={activeName.value} border={false} class={"ex-datetime_collapse"}>
								{{
									default: () => [
										<CollapseItem name={"date"} icon={"calendar-o"} value={dateText.value} isLink={false}>
											{{
												title: () => <span style={{ fontWeight: "bold" }}>日期</span>,
												default: () => (
													<div style={{ height: "300px" }}>
														<Calendar
															minDate={minDate}
															maxDate={maxDate}
															showSubtitle={false}
															showConfirm={false}
															defaultDate={defaultDate.value}
															poppable={false}
															showTitle={false}
															lazyRender={true}
															rowHeight={36}
															onSelect={onSelectDate}
															{...props.defaultProps.calendarProps}
														></Calendar>
													</div>
												),
											}}
										</CollapseItem>,
										<CollapseItem name={"time"} icon={"clock-o"} isLink={false} value={timeText.value}>
											{{
												title: () => <span style={{ fontWeight: "bold" }}>时间</span>,
												default: () => (
													<div>
														<TimePicker
															modelValue={timeModel.value}
															showToolbar={false}
															onChange={onTimeChange}
															{...props.defaultProps.timeProps}
														></TimePicker>
													</div>
												),
											}}
										</CollapseItem>,
									],
								}}
							</Collapse>,
							<ExButton type={"primary"} style={{ margin: "20px 0" }} onClick={onConfirm}>
								确定
							</ExButton>,
						],
					}}
				</PickerWrapper>
			)
		}
	},
})
