import { defineComponent, ref, watch } from "vue"
import { Popup, Checkbox, showToast } from "vant"
import SignaturePad from "signature_pad"
import ExButton from "../button/ExButton.jsx"
import "./index.less"

export default defineComponent({
	name: "ExSignaturePad",
	props: {
		title: {
			type: String,
			default: "",
		},
		readonly: {
			type: Boolean,
			default: false,
		},
		agreement: {
			type: String,
			default: "",
		},
		preset: {
			type: String,
			default: "",
		},
	},
	emits: ["save"],
	setup(props, { emit, expose }) {
		const showPopup = ref(false)
		const signaturePad = ref(null)
		const canvasContainerRef = ref(null)
		const canvasRef = ref(null)
		const agreed = ref(false)
		const open = () => {
			showPopup.value = true
		}

		const resizeCanvas = () => {
			canvasRef.value.width = canvasContainerRef.value.offsetWidth
			//canvasRef.value.height = canvasContainerRef.value.offsetHeight
			// have to clear it manually.
			//signaturePad.clear();

			// If you want to keep the drawing on resize instead of clearing it you can reset the data.
			signaturePad.value?.fromData(signaturePad.value?.toData())
		}

		// On mobile devices it might make more sense to listen to orientation change,
		// rather than window resize events.
		window.onresize = resizeCanvas

		const initSignaturePad = () => {
			if (!canvasRef.value) {
				return
			}
			resizeCanvas()
			signaturePad.value = new SignaturePad(canvasRef.value)
			if (props.preset) {
				signaturePad.value.fromDataURL(props.preset, { ratio: 1 })
			}
			if (props.readonly) {
				signaturePad.value.off()
			}
		}

		const onClearSignature = () => {
			if (signaturePad.value) {
				signaturePad.value.clear()
			}
		}

		const onSaveSignature = () => {
			if (!signaturePad.value || signaturePad.value.isEmpty()) {
				return
			}

			if (props.agreement && !agreed.value) {
				showToast("请先同意协议")
				return
			}
			const dataUrl = signaturePad.value.toDataURL()
			emit("save", dataUrl)
			showPopup.value = false
		}

		const onClose = () => {
			showPopup.value = false
		}

		watch(showPopup, (val) => {
			if (val) {
				setTimeout(initSignaturePad, 100)
			}
		})

		expose({
			open,
		})

		return () => (
			<Popup v-model={[showPopup.value, "show"]} position="bottom">
				<div class="ex-signature-pad">
					{props.title && <div class="ex-signature-pad__title">{props.title}</div>}
					<div class="ex-signature-pad__canvas-container" ref={canvasContainerRef}>
						<canvas class="ex-signature-pad__canvas" ref={canvasRef} />
					</div>
					{props.agreement && !props.readonly && (
						<div class="ex-signature-pad__agreement">
							<Checkbox shape="square" v-model={agreed.value}>
								{props.agreement}
							</Checkbox>
						</div>
					)}
					{props.readonly ? (
						<div class="ex-signature-pad__actions">
							<ExButton type="default" onClick={onClose}>
								关闭
							</ExButton>
						</div>
					) : (
						<div class="ex-signature-pad__actions">
							<ExButton type="default" onClick={onClearSignature} style={{ marginRight: "4px" }}>
								清除
							</ExButton>
							<ExButton type="primary" onClick={onSaveSignature}>
								保存
							</ExButton>
						</div>
					)}
				</div>
			</Popup>
		)
	},
})
