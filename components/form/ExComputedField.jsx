import { defineComponent } from "vue"

/**
 * 计算字段组件
 *
 * 运行时不渲染任何 UI（由 FormItem 返回 null），
 * 实际计算逻辑由 ExForm 的 watcher 驱动。
 * 此组件保留用于类型注册和设计时消费。
 *
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExComputedField",
	props: {
		/** 计算公式 DSL，如 "SUM([q1], [q2])" */
		formula: { type: String, default: "" },
	},
	setup() {
		// 运行时不渲染，实际计算由 ExForm watcher 完成
		return () => null
	},
})
