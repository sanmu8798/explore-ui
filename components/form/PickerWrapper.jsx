import { defineComponent, ref } from "vue"
import { Popup } from "vant"
import ExField from "./ExField.jsx"
import { omit, pick } from "lodash-es"
import { defaultFieldProps } from "../utils"

export default defineComponent({
	name: "PickerWrapper",

	props: {
		/**
		 * Picker 标题
		 */
		title: { type: String, default: "" },

		/**
		 * 是否启用卡片模式
		 */
		inset: { type: Boolean, default: false },

		/**
		 * 是否会弹窗
		 */
		disabled: { type: Boolean, default: false },

		/**
		 * 是否显示关闭
		 */
		closeable: { type: Boolean, default: true },
	},
	emits: ["close", "open"],
	setup: (props, { emit, slots, expose }) => {
		const showPopup = ref(false)

		const onClickWrapper = () => {
			if (props.disabled) {
				return
			}
			showPopup.value = true
			emit("open")
		}

		const close = () => {
			showPopup.value = false
			emit("close")
		}

		expose({ close })

		return () => {
			// 为了让 ExField 的 onClickInput 事件才触发 Popup
			// 所以会手动获取 trigger slot 的第一个组件来手动监听 onClick 事件
			// 如果以后有需要多个组件的情况，再做调整

			let TriggerElem = slots.trigger ? slots.trigger() : null

			if (TriggerElem && TriggerElem.length) {
				TriggerElem = TriggerElem[0]
			}

			return [
				<span class={"ex-field-popup-wrapper"}>
					<TriggerElem onClick={onClickWrapper}></TriggerElem>
				</span>,

				<Popup
					v-model:show={showPopup.value}
					closeable={props.closeable}
					position={"bottom"}
					round={true}
					teleport={"body"}
					closeOnPopstate={true}
					class={`ex-field-popup ${props.inset ? "ex-field-popup-inset" : ""}`}
					safeAreaInsetBottom={true}
					safeAreaInsetTop={true}
					onClickOverlay={close}
					onClickCloseIcon={close}
				>
					{{
						default: () => [
							props.closeable ? (
								<div class={"ex-field-popup__header"}>
									<h2 class={"ex-field-popup__title"}>{props.title}</h2>
								</div>
							) : null,
							slots.default?.(),
						],
					}}
				</Popup>,
			]
		}
	},
})

export const pickerProps = (props) => {
	return {
		title: props.title || `请选择${props.label}`,
		disabled: props.readonly || props.disabled,
	}
}

export const pickerSlots = (slots, props) => {
	let triggerElem = slots.default ? slots.default() : null

	if (!triggerElem) {
		const fieldProps = pick(props, Object.keys(defaultFieldProps))
		// default slot 是 trigger, 其它的 slots 全部传给 ExField
		const fieldSlots = omit(slots, "default")

		triggerElem = (
			<ExField {...fieldProps} mask={true}>
				{fieldSlots}
			</ExField>
		)
	}

	return {
		trigger: () => triggerElem,
	}
}
