import { defineComponent, ref, watch } from "vue"
import { defaultFieldProps } from "../utils"
import ExField from "./ExField.jsx"
import { pick } from "lodash-es"
import ExUploader from "../uploader/ExUploader.jsx"

/**
 * ExFieldUploader Uploader in form
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExFieldUploader",
	props: {
		...defaultFieldProps,

		modelValue: { type: [Array, Object], default: () => [] },
	},
	emits: ["update:modelValue"],
	setup(props, { emit, slots }) {
		const componentValue = ref(props.modelValue)

		watch(
			() => props.modelValue,
			() => (componentValue.value = props.modelValue),
		)

		const onChange = (value) => {
			emit("update:modelValue", value)
		}

		const fieldProps = pick(props, Object.keys(defaultFieldProps))

		return () => (
			<ExField {...fieldProps}>
				{{
					...slots,
					input: () => (
						<ExUploader
							v-model={componentValue.value}
							disabled={props.disabled}
							readonly={props.readonly}
							{...props.defaultProps}
							onChange={onChange}
						></ExUploader>
					),
				}}
			</ExField>
		)
	},
})
