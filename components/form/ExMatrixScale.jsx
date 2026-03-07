import { defineComponent, ref, watch } from "vue"
import { defaultFieldProps, defaultOptionsProps, useOptionTrait } from "../utils"
import { Radio, RadioGroup } from "vant"
import ExField from "./ExField.jsx"
import { isFunction, pick } from "lodash-es"

/**
 * ExMatrixScale 矩阵量表
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExMatrixScale",
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

		let options = ref([])

		useOptionTrait(options, props)

		const level = props.defaultProps?.level || 5

		if (options.value.length > level) {
			options.value = options.value.slice(0, level)
		} else if (options.value.length < level) {
			//如果选项不及量表等级则补全
			for (let i = options.value.length; i < level; i += 1) {
				options.value.push({ text: i + 1, value: i + 1 })
			}
		}

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
											{options.value.map((option, index) => (
												<td>
													<div class={"ex-matrix-option"}>
														<RadioGroup onChange={onChange} v-model={componentValue.value[row]}>
															{() => <Radio name={index + 1}></Radio>}
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
