import { defineComponent } from "vue"
import "./index.less"

/**
 * ExResult 结果页
 */
export default defineComponent({
	name: "ExResult",
	props: {
		/**
		 * 结果类型
		 * @values 'success', 'error', 'info', 'warning'
		 */
		type: { type: String, default: "success" },

		/**
		 * 标题
		 */
		title: { type: String, default: "" },

		/**
		 * 描述
		 */
		description: { type: String, default: "" },
	},
	setup(props, { slots }) {
		const iconElem = () => {
			let elem = null

			if (slots.icon) {
				elem = slots.icon()
			} else {
				switch (props.type) {
					case "success":
						elem = (
							<i class={"exicon"}>
								<svg
									viewBox="64 64 896 896"
									data-icon="check-circle"
									width="1em"
									height="1em"
									fill="currentColor"
									aria-hidden="true"
									focusable="false"
								>
									<path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path>
								</svg>
							</i>
						)
						break

					case "info":
						elem = (
							<i class={"exicon"}>
								<svg
									viewBox="64 64 896 896"
									data-icon="exclamation-circle"
									width="1em"
									height="1em"
									fill="currentColor"
									aria-hidden="true"
									focusable="false"
								>
									<path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path>
								</svg>
							</i>
						)
						break

					case "warning":
						elem = (
							<i class={"exicon"}>
								<svg
									viewBox="64 64 896 896"
									data-icon="warning"
									width="1em"
									height="1em"
									fill="currentColor"
									aria-hidden="true"
									focusable="false"
								>
									<path d="M955.7 856l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zM480 416c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v184c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V416zm32 352a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path>
								</svg>
							</i>
						)
						break

					case "error":
						elem = (
							<i class={"exicon"}>
								<svg
									viewBox="64 64 896 896"
									data-icon="close-circle"
									width="1em"
									height="1em"
									fill="currentColor"
									aria-hidden="true"
									focusable="false"
								>
									<path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
								</svg>
							</i>
						)
						break
					default:
						break
				}
			}

			return elem
		}

		return () => (
			<div class={`ex-result ex-result__${props.type}`}>
				<div class={"ex-result-icon"}>{iconElem()}</div>
				<div class={"ex-result-title"}>{slots.title ? slots.title?.() : props.title}</div>
				<div class={"ex-result-description"}>{slots.description ? slots.description?.() : props.description}</div>
				<div class={"ex-result-extra"}>{slots.extra?.()}</div>
			</div>
		)
	},
})
