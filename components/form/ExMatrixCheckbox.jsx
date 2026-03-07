import { defineComponent, ref, watch } from "vue"
import { defaultFieldProps, defaultOptionsProps, useOptionTrait } from "../utils"
import { Checkbox } from "vant"
import ExField from "./ExField.jsx"
import { isFunction, pick, remove } from "lodash-es"

/**
 * ExMatrixRadio 矩阵单选
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExMatrixRadio",
	props: {
		...defaultFieldProps,
		...defaultOptionsProps,

		/**
		 * 行标题
		 */
		rows: { type: [Array, Function], default: () => [] },
		modelValue: { type: Object, default: () => ({}) },
	},
	emits: ["update:modelValue"],
	setup(props, { emit, slots }) {
		const componentValue = ref(props.modelValue)

		watch(
			() => props.modelValue,
			() => (componentValue.value = props.modelValue),
		)

		const options = ref([])

		useOptionTrait(options, props)

		const rows = isFunction(props.rows) ? props.rows() : props.rows

		const onChange = (row, value) => {
			if (!componentValue.value[row]) {
				componentValue.value[row] = []
			}
			if (componentValue.value[row].includes(value)) {
				remove(componentValue.value[row], (item) => item === value)
			} else {
				componentValue.value[row].push(value)
			}
			emit("update:modelValue", componentValue.value)
		}

		const fieldProps = pick(props, Object.keys(defaultFieldProps))

		return () => (
			<ExField class={"ex-matrix"} {...fieldProps}>
				{{
					...slots,
					input: () => (
						<div class={"ex-matrix-container"}>
							<table>
								<thead>
									<tr>
										<th></th>
										{options.value.map((item) => (
											<th>
												<div class={"ex-matrix-option"}>{item.text}</div>
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{rows.map((row) => (
										<tr>
											<td>
												<div class={"ex-matrix-row"}>{row}</div>
											</td>
											{options.value.map((option) => {
												const checked = ref(componentValue.value[row]?.includes(option.value))
												return (
													<td>
														<div class={"ex-matrix-option"}>
															<Checkbox
																v-model={checked.value}
																shape={"square"}
																onClick={() => onChange(row, option.value)}
															></Checkbox>
														</div>
													</td>
												)
											})}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					),
				}}
			</ExField>
		)
	},
})
