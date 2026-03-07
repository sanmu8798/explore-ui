import { defineComponent, ref, watch } from "vue"
import { defaultFieldProps, defaultOptionsProps, useOptionTrait } from "../utils"
import { Radio, RadioGroup } from "vant"
import ExField from "./ExField.jsx"
import { pick } from "lodash-es"

/**
 * ExRadio 单选
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExRadio",
	props: {
		...defaultFieldProps,
		...defaultOptionsProps,

		modelValue: { type: [Number, String], default: "" },
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
						<RadioGroup
							v-model={componentValue.value}
							disabled={props.disabled || props.readonly}
							{...props.defaultProps}
							onChange={onChange}
						>
							{{
								default: () => options.value.map((option) => <Radio name={option.value}>{{ default: () => option.text }}</Radio>),
							}}
						</RadioGroup>
					),
				}}
			</ExField>
		)
	},
})
