import { defineComponent } from "vue"
import "./index.less"
import { genPixel } from "../../utils/style"

/**
 * 块状导航
 *
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExSector",
	props: {
		/**
		 * 自定义颜色
		 * @values green, blue, orange, red
		 */
		color: { type: String, default: "green" },
		/**
		 * 高度
		 */
		height: { type: [Number, String], default: "100px" },
		/**
		 * 标题
		 */
		title: { type: String, default: "" },
		/**
		 * 副标题
		 */
		subtitle: { type: String, default: "" },
	},
	setup(props, { slots }) {
		const titleElem = () => {
			if (slots.title || props.title) {
				return <div class={"ex-sector__title"}>{slots.title?.() || props.title}</div>
			}
			return null
		}
		const subtitleElem = () => {
			if (slots.subtitle || props.title) {
				return <div class={"ex-sector__subtitle"}>{slots.subtitle?.() || props.subtitle}</div>
			}
			return null
		}

		return () => (
			<div class={`ex-sector ex-sector__${props.color}`} style={{ height: genPixel(props.height) }}>
				{titleElem()}
				{subtitleElem()}
			</div>
		)
	},
})
