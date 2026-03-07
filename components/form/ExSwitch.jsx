import { defineComponent, ref, watch } from "vue"
import { defaultFieldProps } from "../utils"
import { Switch } from "vant"
import ExField from "./ExField.jsx"
import { pick } from "lodash-es"

/**
 * ExSwitch 开关
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExSwitch",
	props: {
		...defaultFieldProps,

		modelValue: { type: Boolean, default: false },
	},
	emits: ["update:modelValue"],
	setup(props, { emit, slots }) {
		const componentValue = ref(props.modelValue)

		watch(
			() => props.modelValue,
			() => (componentValue.value = props.modelValue),
		)

		const onChange = (value) => {
			emit("update:modelValue", Boolean(value))
		}

		const fieldProps = pick(props, Object.keys(defaultFieldProps))

		return () => (
			<ExField {...fieldProps}>
				{{
					...slots,
					input: () => (
						<Switch
							v-model={componentValue.value}
							disabled={props.disabled || props.readonly}
							{...props.defaultProps}
							theme={"round"}
							size={"22px"}
							onChange={onChange}
						></Switch>
					),
				}}
			</ExField>
		)
	},
})
