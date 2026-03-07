import { defineComponent, ref, watch } from "vue"
import { defaultFieldProps, defaultOptionsProps, useOptionTrait } from "../utils"
import { Checkbox, CheckboxGroup } from "vant"
import ExField from "./ExField.jsx"
import { pick } from "lodash-es"

/**
 * ExCheckbox 多选
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExCheckbox",
	props: {
		...defaultFieldProps,
		...defaultOptionsProps,

		modelValue: { type: Array, default: () => [] },
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

		const onChange = (value) => {
			emit("update:modelValue", value)
		}

		const fieldProps = pick(props, Object.keys(defaultFieldProps))

		return () => (
			<ExField {...fieldProps}>
				{{
					...slots,
					input: () => (
						<CheckboxGroup
							v-model={componentValue.value}
							disabled={props.disabled || props.readonly}
							{...props.defaultProps}
							onChange={onChange}
						>
							{{
								default: () =>
									options.value.map((option) => <Checkbox name={option.value}>{{ default: () => option.text }}</Checkbox>),
							}}
						</CheckboxGroup>
					),
				}}
			</ExField>
		)
	},
})
