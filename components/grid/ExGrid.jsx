import { defineComponent } from "vue"
import "./index.less"
import { isArray } from "lodash-es"
import { genPixel } from "../../utils/style"

/**
 * Grid 布局组件
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExGrid",
	props: {
		/**
		 * 间距方向
		 * @values vertical, horizontal
		 */
		direction: { type: String, default: "horizontal" },

		/**
		 * 列数，如果没有定义将会把元素置于同一行
		 */
		columns: { type: Number, default: 0 },

		/**
		 * 间距大小，如 20px 2em，默认单位为 px，支持数组形式来分别设置横向和纵向间距
		 */
		gutter: { type: [Array, Number, String], default: 20 },
	},
	setup(props, { slots }) {
		return () => {
			const columns = props.columns || slots.default()?.length

			let gridTemplateColumns = ""

			for (let i = 0; i < columns; i++) {
				gridTemplateColumns += " 1fr"
			}
			return (
				<div
					class={"ex-grid"}
					style={{
						gridAutoFlow: props.direction === "horizontal" ? "row" : "column",
						gridRowGap: isArray(props.gutter) ? genPixel(props.gutter?.[1]) : "0",
						gridColumnGap: isArray(props.gutter) ? genPixel(props.gutter?.[0]) : genPixel(props.gutter),
						gridTemplateColumns,
					}}
				>
					{slots.default?.()}
				</div>
			)
		}
	},
})
