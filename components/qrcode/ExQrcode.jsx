import { defineComponent, onBeforeUpdate, onMounted, ref, watch } from "vue"
import QRCode from "qrcode"
import "./index.less"

/**
 * ExQrcode 二维码
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExQrcode",
	props: {
		/**
		 * 是否居中显示
		 */
		center: { type: Boolean, default: false },

		/**
		 * 二维码内容
		 */
		text: { type: [String, Number], default: "" },

		/**
		 * 二维码尺寸
		 */
		size: { type: Number, default: 120 },

		/**
		 * 边距
		 */
		margin: { type: Number, default: 0 },

		/**
		 * 前景色
		 */
		colorDark: { type: String, default: "#000000" },

		/**
		 * 背景色
		 */
		colorLight: { type: String, default: "#FFFFFF" },

		/**
		 * 纠错级别
		 * @values L, M, Q, H
		 */
		correctLevel: { type: String, default: "H" },
	},

	setup(props) {
		const containerRef = ref()

		const create = () => {
			QRCode.toDataURL(containerRef.value, String(props.text), {
				errorCorrectionLevel: props.correctLevel,
				color: {
					dark: props.colorDark,
					light: props.colorLight,
				},
				width: props.size,
				margin: props.margin,
			})
		}

		watch(
			() => props,
			() => {
				create()
			},
			{ deep: true },
		)

		onBeforeUpdate(() => {
			containerRef.value = null
		})

		onMounted(() => {
			create()
		})

		return () => (
			<div class={`ex-qrcode ${props.center ? "ex-qrcode__center" : ""}`}>
				<canvas ref={containerRef}></canvas>
			</div>
		)
	},
})
