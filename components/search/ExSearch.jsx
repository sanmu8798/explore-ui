import { cloneDeep, find, isArray, isBoolean, isFunction, isUndefined } from "lodash-es"
import { Button, Icon, Popup, Search } from "vant"
import { computed, defineComponent, inject, nextTick, onMounted, reactive, ref, watch } from "vue"
import ExGrid from "../grid/ExGrid.jsx"
import { createExpand, createField, createQuick } from "./components"
import "./index.less"
import { useCache, useFormFormat, useSm3 } from "../../hooks"
import { EX_FORM } from "../provider/ExProvider.jsx"

/**
 * ExSearch 搜索组件
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExSearch",
	props: {
		modelValue: { type: String, default: "" },

		/**
		 * @typedef {Object} ExSearchItemConfig 搜索项
		 * @property {string} key 搜索项的 key
		 * @property {string} title 搜索项的标题
		 * @property {string} type 搜索项的类型
		 * @property {boolean} [quick] 为 true 展示为快速检索项
		 * @property {boolean|Object} [expandable] 搜索项是否展开
		 * @property {Array|Function} [options] 搜索项的选项
		 * @property {Object} [inputProps] 搜索项的输入框属性
		 * @property {Function} [beforeSubmit] 在提交前修改搜索项的值
		 * @property {*} [defaultValue] 搜索项的值
		 * @property {*} [_temp] 搜索项的临时值[内部使用]
		 * */

		/**
		 *
		 * 搜索项的配置, 详见 [ExSearchItemConfig](#exsearchitemconfig-配置)
		 *
		 */
		columns: { type: Array, default: () => [] },

		/**
		 * 占位提示文字
		 */
		placeholder: { type: String, default: "请输入搜索关键词" },

		/**
		 * 名称，作为提交表单时的标识符
		 */
		keyword: { type: String, default: "keyword" },

		/**
		 * 搜索框左侧文本
		 */
		label: { type: String, default: "" },

		/**
		 * 是否将输入框设为只读状态，只读状态下无法输入内容
		 */
		readonly: { type: Boolean, default: false },

		/**
		 * 是否禁用输入框
		 */
		disabled: { type: Boolean, default: false },

		/**
		 * 输入框内容对齐方式
		 * @values left, right, center
		 */
		inputAlign: { type: String, default: "left" },

		/**
		 * 持久化，传入 localStorage 的 key，如果为 true, 将会以 URL Hash 为 key
		 */
		persistence: { type: [Boolean, String], default: false },

		/**
		 * @typedef {Object} SearchFormData
		 * @property {Object} searchForm 搜索表单
		 *
		 *
		 * 搜索数据处理函数
		 * @param {SearchFormData} data
		 * @return {Boolean|Object} return false会阻止提交操作，return Object会替换提交的数据
		 */
		beforeSearch: { type: Function, default: null },

		/**
		 * 适配器，目前仅支持 newbie
		 * @values newbie
		 */
		adapter: { type: String, default: null },

		/**
		 * [原生配置](https://vant-contrib.gitee.io/vant/#/zh-CN/search)
		 */
		searchProps: { type: Object, default: () => ({}) },
	},
	emits: ["update:modelValue", "search"],
	setup(props, { expose, emit }) {
		const componentValue = ref(props.modelValue)

		const formProvider = inject(EX_FORM, () => ({}))

		watch(
			() => props.modelValue,
			() => {
				componentValue.value = props.modelValue
			},
		)

		const state = reactive({
			queryForm: {}, // 搜索表单
			showFilterPopup: false,
		})

		const genPersistenceKey = (prefix) => {
			if (!props.persistence) {
				return null
			}
			prefix = prefix || ""
			if (isBoolean(props.persistence)) {
				return `exSearch_${prefix}` + useSm3(location.href)
			}

			return `exSearch_${prefix}` + useSm3(location.pathname + "_" + props.persistence)
		}

		const searchItemDefaultValue = (item) => {
			let value = ""
			//如果是展开显示的，那么默认值为空字符串
			//如果展开为多选，那么默认值为 []
			if (item.expandable === "multiple" || item.type === "cascade") {
				value = []
			}

			if (item.defaultValue) {
				value = isFunction(item.defaultValue) ? item.defaultValue() : item.defaultValue
			}

			if ((item.type === "date" || item.type === "datetime") && !value) {
				return null
			}

			return value
		}

		//快速检索项
		const quickColumns = computed(() => {
			return props.columns.filter((item) => item.quick)
		})

		//表单搜索项
		const fieldColumns = computed(() => {
			return props.columns.filter((item) => !item.quick)
		})

		const initQueryForm = () => {
			const form = {}

			const persistenceSearchData = props.persistence ? useCache(genPersistenceKey()).get({}) : {}

			props.columns.forEach((item) => {
				let value
				if (!isUndefined(persistenceSearchData[item.key])) {
					value = persistenceSearchData[item.key]
				} else {
					value = searchItemDefaultValue(item)
				}
				form[item.key] = value
			})

			if (persistenceSearchData[props.keyword]) {
				form[props.keyword] = persistenceSearchData[props.keyword]
				componentValue.value = persistenceSearchData[props.keyword]
			}

			state.queryForm = form
		}

		initQueryForm()

		const onUpdateValue = (value) => {
			emit("update:modelValue", value)
		}

		const getQueryForm = () => {
			const form = {}
			Object.keys(state.queryForm).forEach((key) => {
				let value = state.queryForm[key]

				let filedItem = find(props.columns, { key })
				if (filedItem && filedItem.beforeSubmit && isFunction(filedItem.beforeSubmit)) {
					value = filedItem.beforeSubmit({
						value,
						queryForm: state.queryForm, //改成将 form 传出去，这样可以在 form 中添加参数
					})
				}

				if (value && (!isArray(value) || value.length)) {
					form[key] = value
				}
			})

			if (componentValue.value) {
				form[props.keyword] = componentValue.value
			}

			return form
		}

		const onOpenFilter = () => {
			state.showFilterPopup = true
		}

		const onCloseFilter = () => {
			state.showFilterPopup = false
		}

		const onSearch = () => {
			nextTick(() => {
				let form = cloneDeep(getQueryForm())
				if (props.persistence) {
					useCache(genPersistenceKey()).set(form)
				}

				//使用 FormProvider 的 format
				form = useFormFormat(form, formProvider.format || {})

				if (props.adapter === "newbie") {
					const data = {}

					Object.keys(form).forEach((key) => {
						const column = find(props.columns, { key })
						data[key] = {
							//condition
							c: key === props.keyword ? "in" : column?.condition || "=", //keyword 条件固定为 include（即 like), 其它的默认为 equal
							//type
							t: column?.type || "i", //默认为 input
							//value
							v: form[key],
						}
					})
					form = { _q: data }
				}

				if (props.beforeSearch && isFunction(props.beforeSearch)) {
					form = props.beforeSearch({ searchForm: form })
					//如果为 false 则不触发搜索
					if (form !== false) {
						emit("search", form)
					}
				} else {
					emit("search", form)
				}
			})
		}

		const onFieldSearch = () => {
			state.showFilterPopup = false
			onSearch()
		}

		const onClearSearchField = () => {
			state.queryForm[props.keyword] = ""
			componentValue.value = ""
			emit("search", getQueryForm())
		}

		const onClearFields = () => {
			fieldColumns.value.forEach((item) => {
				state.queryForm[item.key] = searchItemDefaultValue(item)
			})
		}

		const reset = () => {
			fieldColumns.value.forEach((item) => {
				state.queryForm[item.key] = searchItemDefaultValue(item)
			})
			quickColumns.value.forEach((item) => {
				state.queryForm[item.key] = searchItemDefaultValue(item)
			})
			componentValue.value = ""
		}

		onMounted(() => {
			if (props.persistence) {
				emit("search", { persistence: true, ...getQueryForm() })
			}
		})

		expose({ reset, getQueryForm })

		/******************* render *********************/

		const quickElems = () => {
			return quickColumns.value.map((item) => createQuick(item, state.queryForm, onSearch))
		}

		const popupHeaderElem = () => (
			<div class={"ex-search-popup__header van-hairline--bottom"}>
				<h2 class={"ex-search-popup__title"}>{props.title}</h2>
				<span class={"ex-search-popup__closer"}>
					<Icon
						name={"cross"}
						class={"van-badge__wrapper van-popup__close-icon van-popup__close-icon--top-right van-haptics-feedback"}
						onClick={() => (state.showFilterPopup = false)}
					></Icon>
				</span>
			</div>
		)

		const fieldElems = () => (
			<div class={"ex-search-popup__content"}>
				{fieldColumns.value.map((item) => (item.expandable ? createExpand(item, state.queryForm) : createField(item, state.queryForm)))}
			</div>
		)

		const popupFooterElem = () => (
			<div class={"ex-search-popup__footer van-hairline--top"}>
				<ExGrid>
					{{
						default: () => [
							<Button type={"default"} size={"small"} round={true} onClick={onClearFields}>
								清除
							</Button>,
							<Button type={"primary"} size={"small"} round={true} onClick={onFieldSearch}>
								搜索
							</Button>,
						],
					}}
				</ExGrid>
			</div>
		)

		const quickBarElem = () => {
			if (!quickColumns.value?.length && !fieldColumns.value?.length) {
				return null
			}
			return (
				<div class={"ex-search__quick-bar"}>
					<div class={"ex-search__quick-container"}>{quickElems()}</div>
					{fieldColumns.value?.length ? (
						<div class={"ex-search__filter"} onClick={onOpenFilter}>
							筛选<Icon name={"filter-o"}></Icon>
						</div>
					) : null}
				</div>
			)
		}

		return () => (
			<div class="ex-search">
				<form action="/">
					<Search
						v-model={componentValue.value}
						name={props.keyword}
						shape={"round"}
						label={props.label}
						inputAlign={props.inputAlign}
						disabled={props.disabled}
						readonly={props.readonly}
						placeholder={props.placeholder}
						onUpdate:modelValue={onUpdateValue}
						onSearch={onSearch}
						onClear={onClearSearchField}
						{...props.searchProps}
					></Search>
				</form>
				{quickBarElem()}
				<Popup
					v-model:show={state.showFilterPopup}
					closeable={false}
					position={"bottom"}
					round={true}
					teleport={"body"}
					closeOnPopstate={true}
					class={`ex-search-popup`}
					safeAreaInsetBottom={true}
					safeAreaInsetTop={true}
					onClickOverlay={onCloseFilter}
					onClickCloseIcon={onCloseFilter}
				>
					{{ default: () => [popupHeaderElem(), fieldElems(), popupFooterElem()] }}
				</Popup>
			</div>
		)
	},
})
