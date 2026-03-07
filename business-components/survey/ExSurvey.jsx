import { computed, defineComponent, nextTick, reactive, watch } from "vue"
import { Progress } from "vant"
import "./index.less"
import { ExButton, ExForm } from "../../components"
import { cloneDeep } from "lodash-es"
import { useProcessStatusSuccess } from "../../hooks"

/**
 * 调查问卷
 * @version 4.4.0
 */
export default defineComponent({
	name: "ExSurvey",
	props: {
		/**
		 * 标题
		 */
		title: { type: String, default: "" },

		/**
		 * 问卷 slug
		 */
		slug: { type: [Number, String], default: "", required: true },
		/**
		 * 开场语
		 */
		intro: { type: String, default: "" },

		/**
		 * 结束语
		 */
		outro: { type: String, default: "" },

		/**
		 * 从哪个章节开始做
		 */
		startChapter: { type: Number, default: 0 },

		/**
		 * 表单项
		 */
		formItems: { type: Array, default: () => [], required: true },

		/**
		 * 提交地址
		 */
		submitUrl: { type: String, default: "" },

		/**
		 *
		 * @typedef {Object} ExposedFormData
		 * @property {Object} formatForm Format后的表单数据
		 *
		 *
		 * 提交数据处理函数
		 * @param {ExposedFormData} data
		 * @return {Boolean|Object} return false会阻止提交操作，return Object会替换提交的数据
		 *
		 */
		beforeSubmit: { type: Function, default: null },
	},
	emits: [
		/**
		 * @event click
		 * @param {Event} event 完结事件
		 */
		"finish",
	],

	setup(props, { emit }) {
		const state = reactive({
			currentStep: "intro",
			formChapters: [], //二维数组，按章节存储
			currentChapter: 0, //当前章节
		})

		const isLastChapter = computed(() => state.currentChapter === state.formChapters.length)
		const progress = computed(() => (!state.formChapters.length ? 0 : (state.currentChapter / state.formChapters.length) * 100))

		// 将 props.formItems 按 break 划分成章节
		const prepareFormItems = () => {
			let chapter = [] //存储章节的数组
			const formItems = cloneDeep(props.formItems)
			for (let i = 0; i < formItems.length; i += 1) {
				const item = formItems[i] // 这个是用于渲染的配置
				item.defaultSlots = {
					label: () => (
						<span style={{ marginBottom: "10px" }}>
							{i + 1}.{item.title}
						</span>
					),
				}
				if (item.break) {
					if (chapter.length) {
						state.formChapters.push(chapter)
					}
					delete item.break
					chapter = [item]
				} else {
					chapter.push(item)
				}

				if (i === formItems.length - 1) {
					state.formChapters.push(chapter)
				}
			}
		}

		watch(
			() => props.formItems,
			() => {
				prepareFormItems()
				nextTick(() => {
					if (props.startChapter) {
						state.currentChapter = Math.min(props.startChapter - 1, state.formChapters.length - 1)
					}
				})
			},
			{ immediate: true },
		)

		const onBeforeSubmit = ({ formatForm }) => {
			let data = { slug: props.slug, answers: formatForm }
			if (props.beforeSubmit) {
				return props.beforeSubmit(data)
			}
			return data
		}

		const onAfterSubmit = (res) => {
			useProcessStatusSuccess(res, () => {
				state.currentChapter += 1
				if (state.currentChapter === state.formChapters.length) {
					state.currentStep = "outro"
				}
			})
		}

		const onFinish = () => {
			emit("finish")
		}

		const progressElem = () => {
			return state.formChapters.length <= 1 || state.currentStep !== "form" ? null : (
				<div class={`ex-survey__progress`}>
					<Progress showPivot={false} percentage={progress.value}></Progress>
				</div>
			)
		}

		const introElem = () =>
			(props.title || props.intro) && state.currentStep === "intro" ? (
				<div class={`ex-survey__intro`}>
					{props.title ? <div class={`ex-survey__title`}>{props.title}</div> : null}
					{props.intro || null}
					<ExButton type={"primary"} class={"ex-survey__start-btn"} onClick={() => (state.currentStep = "form")}>
						{() => "开始"}
					</ExButton>
				</div>
			) : null

		const outroElem = () =>
			props.intro && state.currentStep === "outro" ? (
				<div class={`ex-survey__outro`}>
					{props.outro || "谢谢您的参与，祝您有美好的一天！"}
					<ExButton type={"primary"} class={"ex-survey__finish-btn"} onClick={onFinish}>
						{() => "完成"}
					</ExButton>
				</div>
			) : null

		const formElem = () => {
			return state.currentStep === "form" ? (
				<div class={`ex-survey__form`}>
					<ExForm
						form={state.formChapters[state.currentChapter]}
						labelWidth={"100%"}
						fixed={true}
						submitUrl={props.submitUrl}
						closable={!isLastChapter.value && state.currentChapter !== 0}
						close={() => (state.currentChapter -= 1)}
						cancelButtonText={"上一步"}
						submitButtonText={"确定"}
						beforeSubmit={onBeforeSubmit}
						afterSubmit={onAfterSubmit}
					></ExForm>
				</div>
			) : null
		}

		return () => <div class={`ex-survey`}>{[introElem(), progressElem(), formElem(), outroElem()]}</div>
	},
})
