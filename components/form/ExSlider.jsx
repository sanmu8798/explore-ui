import { defineComponent, ref, watch } from "vue"
import { defaultFieldProps } from "../utils"
import { Slider } from "vant"
import ExField from "./ExField.jsx"
import { pick } from "lodash-es"

/**
 * ExSlider 评分
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExSlider",
	props: {
		...defaultFieldProps,

		modelValue: { type: [Number, Array], default: 2 },
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
						<Slider
							v-model={componentValue.value}
							readonly={props.readonly}
							disabled={props.disabled}
							clearable={true}
							{...props.defaultProps}
							onChange={onChange}
						>
							{{
								button: () => <div class="ex-slider-button">{componentValue.value}</div>,
							}}
						</Slider>
					),
				}}
			</ExField>
		)
	},
})
