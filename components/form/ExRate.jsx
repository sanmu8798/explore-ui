import { defineComponent, ref, watch } from "vue"
import { defaultFieldProps } from "../utils"
import { Rate } from "vant"
import ExField from "./ExField.jsx"
import { pick } from "lodash-es"

/**
 * ExRate 评分
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExRate",
	props: {
		...defaultFieldProps,

		modelValue: { type: Number, default: null },
	},
	emits: ["update:modelValue"],
	setup(props, { emit, slots }) {
		const componentValue = ref(props.modelValue)

		watch(
			() => props.modelValue,
			() => (componentValue.value = props.modelValue),
		)

		const onChange = (value) => {
			emit("update:modelValue", Number(value))
		}

		const fieldProps = pick(props, Object.keys(defaultFieldProps))

		return () => (
			<ExField {...fieldProps}>
				{{
					...slots,
					input: () => (
						<Rate
							v-model={componentValue.value}
							readonly={props.readonly}
							disabled={props.disabled}
							clearable={true}
							onChange={onChange}
							{...props.defaultProps}
						></Rate>
					),
				}}
			</ExField>
		)
	},
})
