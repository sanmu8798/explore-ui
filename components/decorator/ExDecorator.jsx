import { defineComponent } from "vue"
import "./index.less"
import { genPixel } from "../../utils/style.js"

/**
 * 装饰组件
 *
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExDecorator",
	props: {
		/**
		 * 自定义颜色
		 * @values green, blue, black, orange
		 */
		color: { type: String, default: "green" },

		/**
		 * 高度
		 */
		height: { type: [Number, String], default: "auto" },
	},
	setup(props, { slots }) {
		return () => (
			<div class={`ex-decorator ex-decorator__${props.color}`} style={{ height: genPixel(props.height) }}>
				{slots.default?.()}
			</div>
		)
	},
})
