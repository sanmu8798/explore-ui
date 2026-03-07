import { defineComponent, ref, watch } from "vue"
import { defaultFieldProps, defaultOptionsProps, useOptionTrait } from "../utils"
import { Radio, RadioGroup } from "vant"
import ExField from "./ExField.jsx"
import { isFunction, pick } from "lodash-es"

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

		const onChange = () => {
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
											{options.value.map((option) => (
												<td>
													<div class={"ex-matrix-option"}>
														<RadioGroup onChange={onChange} v-model={componentValue.value[row]}>
															{() => <Radio name={option.value}></Radio>}
														</RadioGroup>
													</div>
												</td>
											))}
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
