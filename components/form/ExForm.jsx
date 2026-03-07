import { computed, defineComponent, inject, nextTick, onMounted, reactive, ref, watch } from "vue"
import { EX_FORM, EX_UPLOADER } from "../provider/ExProvider.jsx"
import { cloneDeep, every, isArray, isEqual, isFunction, isObject, isString, pick } from "lodash-es"
import { initItemDefaultValue } from "./utils"
import { useCache, useFetch, useFormFail, useFormFormat, useProcessStatusSuccess } from "../../hooks"
import { CellGroup, Form, showConfirmDialog, showSuccessToast, Skeleton } from "vant"
import createFormItem from "./FormItem.jsx"
import ExButton from "../button/ExButton.jsx"

/**
 * ExForm 表单
 *
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExForm",
	props: {
		/**
		 * 表单标题
		 */
		title: { type: String, default: "" },

		/**
		 * 表单项 label 宽度，默认单位为px
		 */
		labelWidth: { type: [String, Number], default: "6.2em" },

		/**
		 * 是否在 label 后面添加冒号
		 */
		colon: { type: Boolean, default: false },

		/**
		 * 是否使用卡片模式
		 */
		inset: { type: Boolean, default: false },

		/**
		 * 表单数据，用于初始化表单，并会进行 Watch
		 */
		data: { type: [Object, String], default: "" },

		/**
		 * 是否自动加载
		 * true: 表示自动加载数据
		 * Array,String: 表示会对 `extraData` 数据中的相关字段进行非空验证，不为空再加载数据
		 */
		autoLoad: {
			//自动加载数据,在fetchData里找
			type: [Boolean, Array, String],
			default: true,
		},

		/**
		 * 获取表单数据的URL
		 */
		fetchUrl: { type: String, default: "" },

		/**
		 * 额外的数据，在提交时会合并到表单数据中并一起提交
		 */
		extraData: { type: Object, default: () => ({}) },

		/**
		 * 是否禁用表单
		 */
		disabled: { type: Boolean, default: false },

		/**
		 * 是否只读
		 */
		readonly: { type: Boolean, default: false },

		/**
		 * submit button 是否固定在底部
		 */
		fixed: { type: Boolean, default: false },

		/**
		 * 提交数据URL
		 */
		submitUrl: { type: String, default: "" },

		/**
		 * 提交按钮文字
		 */
		submitButtonText: { type: String, default: "保存" },

		/**
		 * 提交确认提示内容
		 */
		submitConfirmText: { type: String, default: "" },

		/**
		 * 是否禁用提交按钮
		 */
		submitDisabled: { type: Boolean, default: false },

		/**
		 * 表单项改变后，用哪种方式回填数据，默认是"auto"不变，可以设置为"auto"、"init"和Function回调
		 */
		fillMode: { type: [String, Function], default: "auto" },

		/**
		 * 是否显示关闭按钮
		 */
		closable: { type: Boolean, default: false },

		/**
		 * 取消按钮文字
		 */
		cancelButtonText: { type: String, default: "取消" },

		/**
		 * 点击关闭时的动作
		 */
		close: { type: Function, default: null },

		/**
		 * 当有分割线时，分割线的配置
		 */
		dividerProps: { type: Object, default: () => ({}) },

		/**
		 * 是否缓存表单数据
		 * 开启后，该数据会缓存在 localStorage
		 */
		cacheable: { type: String, default: "" },

		/**
		 *
		 * 表单配置
		 *
		 * @typedef {Object} FormItemConfig
		 * @property {string} key 数据库关联名称
		 * @property {string} title 显示的名字
		 * @property {string} [type] 类型,默认是input
		 * @property {array|Function} [options] 组件选项
		 * @property {array|Function} [rows] 矩阵组件行标题
		 * @property {string} [placeholder] 组件里的提示
		 * @property {string|Function} [help] ExField 里的提示
		 * @property {string|Function} [append] ExField 外的提示
		 * @property {array} [rules] 验证规则
		 * @property {boolean} [isLink] 是否展示右侧箭头并开启点击反馈
		 * @property {boolean} [readonly] 是否只读
		 * @property {boolean|Function} [required] 是否必填,默认是false
		 * @property {boolean|Function} [disabled] 组件不可编辑状态,默认是false
		 * @property {boolean|Function} [hidden] 组件是否隐藏
		 * @property {Function} [match] 支持根据条件返回不同的配置进行动态渲染
		 * @property {Function} [init] 初始化函数，用于初始化表单项的值
		 * @property {Function} [beforeSubmit] 在提交前修改表单项的值，该函数会在 ExForm 的 beforeSubmit 之前调用
		 * @property {boolean|string} [break] 新起一行，默认为false，如果为 String 则以 Divider 分割
		 * @property {Object} [fieldProps] ExField 的原生配置
		 * @property {Object} [exProps] Ex组件配置
		 * @property {Object} [defaultProps] 原生 Vant 组件的配置
		 * @property {Object} [defaultSlots] 混合 Field 和 input slot 组件的 slots 组合
		 * @property {*} [defaultValue] 默认值，默认是空字符串
		 * @property {*} [_temp] 临时数据，内部使用
		 */

		/**
		 * 表单配置，[见下表](#form-表单配置)
		 */
		form: {
			type: [Array, Function],
			default() {
				return []
			},
		},

		/**
		 * fetch 返回数据处理函数
		 * @return {Object} 返回处理后的数据，将用于初始化表单
		 */
		afterFetched: { type: Function, default: null },

		/**
		 *
		 * @typedef {Object} ExposedFormData
		 * @property {Object} formatForm Format后的表单数据
		 * @property {Object} originalForm 原生的表单数据
		 *
		 *
		 * 提交数据处理函数
		 * @param {ExposedFormData} data
		 * @return {Boolean|Object} return false会阻止提交操作，return Object会替换提交的数据
		 *
		 */
		beforeSubmit: { type: Function, default: null },

		/**
		 * 提交成功后的回调
		 */
		afterSubmit: { type: Function, default: null },

		/**
		 * [原生配置](https://vant-contrib.gitee.io/vant/#/zh-CN/form)
		 */
		formProps: { type: Object, default: () => ({}) },
	},
	emits: ["success"],

	setup(props, { expose, emit, slots }) {
		const formRef = ref(null) //表单容器

		const state = reactive({
			temporary: {}, // 用于存放一些临时数据
			submitFetcher: {
				loading: false,
			},
			isInitializing: true, //是否正在初始化
			rules: {},
			submitForm: {}, //提交表单，初始化数据后会生成
			submitFormBackup: {}, //初始化后的表单数据备份，用于重置表单以及脏数据判断
		})

		const formItems = computed(() => (isFunction(props.form) ? props.form() : props.form))

		const uploaderProvider = inject(EX_UPLOADER, () => ({}))
		const formProvider = inject(EX_FORM, () => ({}))

		// 初始化表单数据
		const dataForInit = ref(props.data)

		watch(
			() => props.data,
			(newV) => {
				dataForInit.value = newV
				initFormData(newV || false)
			},
		)

		watch(
			() => state.submitForm,
			() => {
				if (props.cacheable) {
					useCache(props.cacheable, localStorage).set(state.submitForm)
				}
			},
			{ deep: true },
		)

		watch(
			() => formItems.value,
			() => {
				recoverFormData()
			},
		)

		const init = (data) => {
			state.isInitializing = false
			initFormData(data || dataForInit.value || false)
		}

		onMounted(() => {
			if (props.autoLoad && props.fetchUrl) {
				let auto = true
				if (props.autoLoad && isObject(props.autoLoad)) {
					auto = every(Object.values(pick(props.extraData, Object.keys(props.autoLoad))))
				} else if (props.autoLoad && isString(props.autoLoad)) {
					auto = !!props.extraData[props.autoLoad]
				}

				if (auto) {
					fetchItem()
				} else {
					init()
				}
			} else {
				if (props.cacheable) {
					const cachedData = useCache(props.cacheable, localStorage).get()
					if (cachedData) {
						showConfirmDialog({ message: "存在未提交的数据，是否恢复？", lockScroll: false })
							.then(() => {
								init(cachedData)
							})
							.catch(() => {
								useCache(props.cacheable, localStorage).remove()
								init()
							})
					} else {
						init()
					}
				} else {
					init()
				}
			}
		})

		/**
		 * 初始化表单数据
		 *
		 * @param {Object} formData 表单数据
		 */
		const initFormData = (formData) => {
			// 如果有 FormData, 则从中提取 FormItem 中有定义的数据，并进行初始化后存放于 extractFormData
			// 无 FromData 则直接使用 FormItem 的 defaultValue
			let extractFormData = {}
			let existingData = formData ? cloneDeep(formData) : false
			formItems.value.forEach((item) => {
				extractFormData[item.key] = initItemDefaultValue(item, existingData, state.submitForm, { uploaderProvider })
			})

			if (existingData) {
				// 将初始化后的数据覆盖原有数据，并保留不在 FormItems 中的数据
				extractFormData = { ...existingData, ...extractFormData }
			}

			state.submitForm = extractFormData
			state.submitFormBackup = cloneDeep(extractFormData)
		}

		/**
		 * formItems改变后，恢复表单数据
		 */
		const recoverFormData = () => {
			if (props.fillMode === "init") {
				initFormData(dataForInit.value || false)
			} else if (isFunction(props.fillMode)) {
				props.fillMode({ submitForm: state.submitForm, initForm: dataForInit.value })
			}
		}

		//远程拿数据模式
		const fetchItem = () => {
			if (props.fetchUrl) {
				state.isInitializing = true
				useFetch()
					.get(props.fetchUrl, { params: props.extraData })
					.then((res) => {
						state.isInitializing = false
						useProcessStatusSuccess(res, () => {
							if (props.afterFetched && isFunction(props.afterFetched)) {
								res = props.afterFetched(res)
							} else if (formProvider.afterFetched && isFunction(formProvider.afterFetched)) {
								res = formProvider.afterFetched(res)
							}
							dataForInit.value = res
							//有可能出现 isInitializing 未生效 skeleton 还未关闭的情况
							nextTick(() => {
								initFormData(res)
							})
						})
					})
					.finally(() => {
						state.isInitializing = false
					})
			}
		}

		const onSubmit = async () => {
			await formRef.value.validate()

			if (props.submitConfirmText) {
				try {
					await showConfirmDialog({ message: props.submitConfirmText })
				} catch (e) {
                    console.error(e)
					return
				}
			}

			// 为了在 item 中也能定制 beforeSubmit 这里和下面的 useFormFormat 会重复 copy 一次 submitForm
			let form = cloneDeep(state.submitForm)

			const itemsWithBeforeSubmit = formItems.value
				.map((item) => {
					if (item.match) {
						// match 的属性需要在这里处理
						return { ...item, ...item.match(form) }
					}
					return item
				})
				.filter((item) => item.beforeSubmit && isFunction(item.beforeSubmit))

			for (const item of itemsWithBeforeSubmit) {
				form[item.key] = await item.beforeSubmit({
					value: form[item.key],
					submitForm: form, //改成将 form 传出去，这样可以在 form 中添加参数
				})
			}

			form = useFormFormat(form, formProvider.format || {})

			if (props.beforeSubmit && isFunction(props.beforeSubmit)) {
				form = await props.beforeSubmit({ formatForm: form, originalForm: state.submitForm })
				if (form === false) {
					return
				}
			}

			try {
				let res = await useFetch(state.submitFetcher).post(props.submitUrl, form)

				//提交后再次备份表单数据，isDirty 检测即为 false
				state.submitFormBackup = cloneDeep(state.submitForm)

				if (props.cacheable) {
					useCache(props.cacheable, localStorage).remove()
				}

				if (props.afterSubmit) {
					props.afterSubmit(res)
				} else {
					useProcessStatusSuccess(res, () => {
						showSuccessToast(`${props.submitButtonText}成功`)
						emit("success", res)
					})
				}
			} catch (e) {
				useFormFail(e)
			}
		}

		/********** exposes **********/

		/**
		 * 获取复制的表单数据
		 * @return {*}
		 */
		const getFormStandalone = () => cloneDeep(state.submitForm)

		/**
		 * 获取表单实时数据，慎用，会改变内部的值
		 * @return {*}
		 */
		const getFormRealtime = () => state.submitForm

		/**
		 * 获取表单的字段值
		 * @param {String} key
		 * @return {*}
		 */
		const getField = (key) => cloneDeep(state.submitForm[key])

		/**
		 *
		 * 设置表单数据
		 * @param {Object} fields
		 */
		const setForm = (fields) => {
			Object.keys(fields).forEach((key) => {
				state.submitForm[key] = fields[key]
			})
		}

		/**
		 * 判断表单是否被修改
		 * @return {boolean}
		 */
		const isDirty = () => {
			return !isEqual(state.submitForm, state.submitFormBackup)
		}

		/**
		 * 重置表单
		 * @param {Object} formData 表单数据
		 */
		const reset = (formData) => {
			initFormData(formData)
			nextTick(() => {
				formRef.value.resetValidation()
			})
		}

		expose({
			getForm: getFormStandalone,
			getFormStandalone,
			getFormRealtime,
			getField,
			setForm,
			isDirty,
			fetchItem,
			reset,
		})

		/********** render **********/

		const formItemElems = () => {
			let formItemElems = []
			formItems.value.forEach((formItem) => {
				const formItemElem = createFormItem(formItem, state.submitForm, {
					props,
					slots,
				})
				if (formItemElem) {
					if (isArray(formItemElem)) {
						formItemElems = [...formItemElems, ...formItemElem]
					} else {
						formItemElems.push(formItemElem)
					}
				}
			})

			return formItemElems
		}

		const skeletonElem = () => (
			<Skeleton row={10} title loading={state.isInitializing}>
				{{
					default: () => formItemElems(),
				}}
			</Skeleton>
		)

		const footerElem = () => {
			if (state.isInitializing) {
				return null
			}
			if (slots.footer) {
				return <div class={"ex-form__footer"}>{slots.footer()}</div>
			}
			return null
		}

		const buttonsElem = () => {
			if (state.isInitializing) {
				return null
			}
			if (props.readonly) {
				return null
			}

			const cancelBtn = (
				<ExButton
					class={"ex-form__cancel-btn"}
					type={"default"}
					plain
					onClick={() => {
						if (props.close && isFunction(props.close)) {
							props.close()
						}
					}}
				>
					{() => props.cancelButtonText}
				</ExButton>
			)

			const submitBtn = (
				<ExButton disabled={props.submitDisabled} type={"primary"} fetcher={state.submitFetcher} buttonProps={{ nativeType: "submit" }}>
					{() => props.submitButtonText}
				</ExButton>
			)

			if (props.fixed) {
				return <div class={"ex-form__btn-wrapper-fixed van-hairline--top"}>{[props.closable ? cancelBtn : null, submitBtn]}</div>
			}

			return <div class={"ex-form__btn-wrapper"}>{[props.closable ? cancelBtn : null, submitBtn]}</div>
		}

		return () => (
			<Form
				ref={formRef}
				labelWidth={props.labelWidth}
				colon={props.colon}
				class={`ex-form ${props.fixed ? "ex-form__fixed" : ""}`}
				disabled={props.disabled}
				readonly={props.readonly}
				scrollToError={true}
				validateFirst={true}
				onSubmit={onSubmit}
				{...props.formProps}
			>
				{{
					default: () => [
						<CellGroup inset={props.inset} title={props.title}>
							{{ default: () => skeletonElem() }}
						</CellGroup>,
						footerElem(),
						buttonsElem(),
					],
				}}
			</Form>
		)
	},
})
