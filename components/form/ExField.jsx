import { computed, defineComponent, getCurrentInstance, reactive, watch } from "vue"
import { Field, Icon, Popover } from "vant"
import { defaultFieldProps, defaultFieldSlots } from "../utils"
import { omit, pick, isString } from "lodash-es"

/**
 * ExField 输入框
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExField",
	props: {
		...defaultFieldProps,

		/**
		 * 输入框内容
		 */
		modelValue: { type: [String, Number, Array, Object, Boolean], default: () => "" },

		/**
		 * 输入框类型, 支持原生 input 标签的所有
		 */
		type: { type: String, default: "" },

		/**
		 * 是否作为 Picker 的 Trigger
		 */
		mask: { type: Boolean, default: false },
	},
	emits: ["update:modelValue", "click"],
	setup(props, { slots, emit }) {
		const instance = getCurrentInstance()
		const displayText = instance.parent?.parent?.exposed?.displayText

		const state = reactive({
			value: props.mask ? displayText : props.modelValue,
			showHelp: false,
		})

		watch(
			() => props.modelValue,
			() => {
				state.value = props.modelValue
			},
		)

		const isLink = computed(() => (props.mask && !props.disabled && !props.readonly ? true : props.isLink))
		const isReadonly = computed(() => (props.mask ? true : props.readonly))

		const onUpdateValue = (value) => {
			emit("update:modelValue", value)
		}

		/****************** render **********************/

		const helpElem = () => {
			if (props.help) {
				return (
					<Popover v-model:show={state.showHelp} theme={"dark"} placement={"bottom-start"}>
						{{
							default: () => <div class={"ex-field__help"}>{isString(props.help) ? props.help : props.help()}</div>,
							reference: () =>
								props.help ? (
									<span class={"ex-field__help-handler"}>
										<Icon name={"warning-o"}></Icon>
									</span>
								) : null,
						}}
					</Popover>
				)
			}
			return null
		}
		const labelElem = () => (
			<div class={"ex-field__label"}>
				<span>{props.label || slots.label?.()}</span>

				{helpElem()}
			</div>
		)

		const inputElem = () => {
			let inputSlots = omit(slots, Object.keys(defaultFieldSlots))
			let InputElem = slots.input ? slots.input() : null

			if (Object.keys(inputSlots).length) {
				if (InputElem.length > 1) {
					console.warn("More than one root element wrapped in ExField with input slots!")
				}
				InputElem = InputElem[0]
				return <InputElem>{inputSlots}</InputElem>
			}
			return InputElem
		}

		const appendElem = () => {
			if (props.append) {
				const appendResult = isString(props.append) ? props.append : props.append()
				return appendResult ? <div class={"ex-field__append"}>{appendResult}</div> : null
			}
			return null
		}

		return () => {
			let fieldSlots = pick(slots, Object.keys(defaultFieldSlots))
			if (!fieldSlots.label) {
				fieldSlots.label = labelElem
			}

			if (fieldSlots.input) {
				fieldSlots.input = inputElem
			}

			return (
				<div class={`ex-field`}>
					<Field
						v-model={state.value}
						type={props.type}
						name={props.name}
						placeholder={props.placeholder}
						readonly={isReadonly.value}
						disabled={props.disabled}
						required={props.required}
						isLink={isLink.value}
						rules={props.rules}
						onClickInput={() => emit("click")}
						onUpdate:modelValue={onUpdateValue}
						{...props.fieldProps}
						showWordLimit={isReadonly.value ? false : props.fieldProps?.showWordLimit}
					>
						{{ ...fieldSlots }}
					</Field>
					{appendElem()}
				</div>
			)
		}
	},
})
