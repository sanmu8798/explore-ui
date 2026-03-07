import { defineComponent } from "vue"
import { Button } from "vant"
import "./index.less"

/**
 * 主题组件
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExButton",
	props: {
		/**
		 * 按钮类型
		 * @values primary, success, warning, danger
		 */
		type: { type: String, default: "default" },

		/**
		 * 按钮大小
		 * @values large, normal, small, mini
		 */
		size: { type: String, default: "normal" },

		/**
		 * 失效状态
		 */
		disabled: { type: Boolean, default: false },

		/**
		 * 是否圆形按钮
		 */
		round: { type: Boolean, default: true },

		/**
		 * 是否块状按钮
		 */
		block: { type: Boolean, default: true },

		/**
		 * 按钮标签
		 */
		text: { type: String, default: "" },

		/**
		 * 按钮图标，需要使用
		 *
		 */
		icon: { type: Object, default: null },

		/**
		 * 按钮图标位置
		 * @values left, right
		 */
		iconPosition: { type: String, default: "left" },

		/**
		 * 请求状态控制器
		 * @param {boolean} fetcher.loading 是否加载中
		 */
		fetcher: {
			type: Object,
			default: () => ({ loading: false }),
		},

		/**
		 * [原生配置](https://vant-contrib.gitee.io/vant/#/zh-CN/button)
		 */
		buttonProps: {
			type: Object,
			default: () => ({}),
		},
	},
	emits: [
		/**
		 * @event click
		 * @param {Event} event 点击事件
		 */
		"click",
	],

	setup(props, { emit, slots }) {
		const onClick = (e) => {
			/**
			 * @event click 点击事件
			 */
			emit("click", e)
		}

		const defaultLabel = () => {
			return props.text || slots.default?.()
		}

		const defaultSlot = () => {
			if (props.icon && props.iconPosition === "left") {
				return [props.icon, defaultLabel()]
			} else if (props.icon && props.iconPosition === "right") {
				return [defaultLabel(), props.icon]
			}
			return [defaultLabel()]
		}

		return () => (
			<Button
				class={"ex-button"}
				loading={props.fetcher.loading}
				type={props.type}
				size={props.size}
				disabled={props.disabled}
				round={props.round}
				block={props.block}
				onClick={onClick}
				{...props.buttonProps}
			>
				{{
					default: () => defaultSlot(),
				}}
			</Button>
		)
	},
})
