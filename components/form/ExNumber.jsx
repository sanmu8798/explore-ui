import { defineComponent, ref, watch } from "vue"
import { defaultFieldProps } from "../utils"
import { Stepper } from "vant"
import ExField from "./ExField.jsx"
import { pick } from "lodash-es"

/**
 * @deprecated  使用存在不能为 0 的问题，使用 ExField type="number" 进行处理
 * ExNumber 数字
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExNumber",
	props: {
		...defaultFieldProps,

		modelValue: { type: [Number, String], default: null },
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
						<Stepper
							v-model={componentValue.value}
							disabled={props.disabled || props.readonly}
							theme={"round"}
							buttonSize={22}
							onChange={onChange}
							{...props.defaultProps}
						></Stepper>
					),
				}}
			</ExField>
		)
	},
})
