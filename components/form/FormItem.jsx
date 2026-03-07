import { inject } from "vue"
import { EX_UPLOADER } from "../provider/ExProvider.jsx"
import { isBoolean, isFunction, isString, merge, pick } from "lodash-es"
import ExField from "./ExField.jsx"
import ExSelect from "./ExSelect.jsx"
import ExDate from "./ExDate.jsx"
import ExSwitch from "./ExSwitch.jsx"
import ExCheckbox from "./ExCheckbox.jsx"
import ExRadio from "./ExRadio.jsx"
import ExDatetime from "./ExDatetime.jsx"
import ExNumber from "./ExNumber.jsx"
import ExRate from "./ExRate.jsx"
import ExSlider from "./ExSlider.jsx"
import ExAddress from "./ExAddress.jsx"
import ExCascader from "./ExCascader.jsx"
import ExTime from "./ExTime.jsx"
import ExFieldUploader from "./ExFieldUploader.jsx"
import ExMatrixRadio from "./ExMatrixRadio.jsx"
import ExMatrixScale from "./ExMatrixScale.jsx"
import ExMatrixCheckbox from "./ExMatrixCheckbox.jsx"
import { Divider } from "vant"

/**
 *
 * @param {FormItemConfig} item
 * @param {Object} submitForm
 * @param {Object} [props]
 * @param {Object} [slots]
 * @return {*|JSX.Element}
 */
const render = (item, submitForm, { props, slots }) => {
	const uploaderProvider = inject(EX_UPLOADER, () => ({}))

	const pickerTypes = ["select", "date", "datetime", "time", "address", "cascade"]
	const isPicker = pickerTypes.includes(item.type)

	// ExField 的 props
	const fieldPropsList = ["placeholder", "help", "append", "required", "disabled", "rules", "readonly", "isLink", "fieldProps"]
	let fieldProps = pick(item, fieldPropsList)

	fieldProps.required = isFunction(fieldProps.required) ? fieldProps.required(submitForm) : fieldProps.required
	fieldProps.disabled = isFunction(fieldProps.disabled) ? fieldProps.disabled(submitForm) : fieldProps.disabled

	fieldProps = { readonly: props.readonly, disabled: props.disabled, ...fieldProps }

	if (fieldProps.readonly || fieldProps.disabled) {
		fieldProps.required = false
	}

	fieldProps.label = item.title
	fieldProps.name = item.key
	fieldProps.placeholder = fieldProps.placeholder || (isPicker ? `请选择${item.title}` : `请填写${item.title}`)
	fieldProps.rules = fieldProps.rules?.length
		? fieldProps.rules.map((rule) =>
				rule.pattern
					? {
							...rule,
							pattern: new RegExp(rule.pattern),
						}
					: { ...rule },
			)
		: []

	// 具体组件的 props
	const componentProps = merge(pick(item, ["options", "defaultProps", "rows"]), item.exProps || {})

	//混合了Field和input slot组件的slots组合
	const componentSlots = item.defaultSlots || {}

	item.type = item.type ? item.type.toLowerCase() : item.type

	//特殊：readonly 的情况下不显示 required
	if (fieldProps.required) {
		fieldProps.rules.push({
			required: true,
			message: isPicker ? `请选择${item.title || ""}` : `请填写${item.title || ""}`,
			trigger: isPicker ? "onChange" : "onBlur", //特意
		})
	}

	//特殊：readonly 情况下不显示 placeholder
	if (fieldProps.readonly || fieldProps.disabled) {
		fieldProps.placeholder = "--"
	}

	let renderItem = null

	// 处理 hidden
	if ((isFunction(item.hidden) && item.hidden(submitForm)) || (isBoolean(item.hidden) && item.hidden)) {
		return null
	} else if (item.type === "slot" && slots[item.key]) {
		return slots[item.key]({ submitForm })
	} else if (item.customRender) {
		renderItem = item.customRender({ submitForm, item })
		if (!renderItem) {
			return null
		}
	} else if (item.match) {
		// 匹配模式, 合并选项后需要移除 match
		const matchItem = { ...item, ...item.match(submitForm), match: null }
		return render(matchItem, submitForm, { props, slots })
	} else {
		switch (item.type) {
			case "select":
				renderItem = (
					<ExSelect key={item.key} v-model={submitForm[item.key]} {...componentProps} {...fieldProps}>
						{componentSlots}
					</ExSelect>
				)
				break
			case "date":
				renderItem = (
					<ExDate key={item.key} v-model={submitForm[item.key]} {...componentProps} {...fieldProps}>
						{componentSlots}
					</ExDate>
				)
				break
			case "datetime":
				renderItem = (
					<ExDatetime key={item.key} v-model={submitForm[item.key]} {...componentProps} {...fieldProps}>
						{componentSlots}
					</ExDatetime>
				)
				break
			case "time":
				renderItem = (
					<ExTime key={item.key} v-model={submitForm[item.key]} {...componentProps} {...fieldProps}>
						{componentSlots}
					</ExTime>
				)
				break
			case "switch":
				renderItem = (
					<ExSwitch key={item.key} v-model={submitForm[item.key]} {...componentProps} {...fieldProps}>
						{componentSlots}
					</ExSwitch>
				)
				break
			case "radio":
				renderItem = (
					<ExRadio key={item.key} v-model={submitForm[item.key]} {...componentProps} {...fieldProps}>
						{componentSlots}
					</ExRadio>
				)
				break
			case "checkbox":
				renderItem = (
					<ExCheckbox key={item.key} v-model={submitForm[item.key]} {...componentProps} {...fieldProps}>
						{componentSlots}
					</ExCheckbox>
				)
				break
			case "address":
				renderItem = (
					<ExAddress key={item.key} v-model={submitForm[item.key]} {...componentProps} {...fieldProps}>
						{componentSlots}
					</ExAddress>
				)
				break
			case "cascade":
				renderItem = (
					<ExCascader key={item.key} v-model={submitForm[item.key]} {...componentProps} {...fieldProps}>
						{componentSlots}
					</ExCascader>
				)
				break
			case "number":
				renderItem = (
					<ExNumber key={item.key} v-model={submitForm[item.key]} {...componentProps} {...fieldProps}>
						{componentSlots}
					</ExNumber>
				)
				break
			case "rate":
				renderItem = (
					<ExRate key={item.key} v-model={submitForm[item.key]} {...componentProps} {...fieldProps}>
						{componentSlots}
					</ExRate>
				)
				break
			case "slider":
				renderItem = (
					<ExSlider key={item.key} v-model={submitForm[item.key]} {...componentProps} {...fieldProps}>
						{componentSlots}
					</ExSlider>
				)
				break
			case "uploader":
				renderItem = (
					<ExFieldUploader key={item.key} v-model={submitForm[item.key]} {...componentProps} {...fieldProps}>
						{componentSlots}
					</ExFieldUploader>
				)
				if (item.required) {
					if (!Object.keys(uploaderProvider).length) {
						console.error("请在根组件中注入 NEWBIE_UPLOADER 配置项")
						renderItem = null
						break
					}

					/*if (item.defaultProps?.maxNum && item.defaultProps?.maxNum > 1) {
                        rules.type = "array"
                        rules.message = `请上传${item.title}`
                    } else {
                        rules = {
                            type: "object",
                            required: true,
                            message: `请上传${item.title}`,
                            fields: {
                                [uploaderProvider.path]: {
                                    type: "string",
                                    required: true,
                                    message: `请上传${item.title}`,
                                },
                            },
                        }
                    }*/
				}
				break
			/* case "html":
                  renderItem = Fields.createHtml(item, submitForm)
                  break

              case "text":
                  renderItem = Fields.createText(item, submitForm)
                  break
              case "group":
                  renderItem = Fields.createGroup(item, submitForm, { provider: { uploaderProvider } })
                  break*/
			case "textarea":
				fieldProps.type = "textarea"
				renderItem = (
					<ExField key={item.key} v-model={submitForm[item.key]} {...fieldProps}>
						{componentSlots}
					</ExField>
				)
				break
			case "password":
				fieldProps.type = "password"
				renderItem = (
					<ExField key={item.key} v-model={submitForm[item.key]} {...fieldProps}>
						{componentSlots}
					</ExField>
				)
				break
			case "matrix-radio": {
				if (item.required) {
					fieldProps.rules[fieldProps.rules.length - 1].validator = () => {
						for (let i = 0; i < item.rows.length; i++) {
							if (!submitForm[item.key][item.rows[i]]) {
								return `请选择${item.rows[i]}`
							}
						}
						return true
					}
				}
				renderItem = <ExMatrixRadio key={item.key} v-model={submitForm[item.key]} {...componentProps} {...fieldProps} />
				break
			}
			case "matrix-scale": {
				if (item.required) {
					fieldProps.rules[fieldProps.rules.length - 1].validator = () => {
						for (let i = 0; i < item.rows.length; i++) {
							if (!submitForm[item.key][item.rows[i]]) {
								return `请选择${item.rows[i]}`
							}
						}
						return true
					}
				}
				renderItem = <ExMatrixScale key={item.key} v-model={submitForm[item.key]} {...componentProps} {...fieldProps} />
				break
			}
			case "matrix-checkbox": {
				if (item.required) {
					fieldProps.rules[fieldProps.rules.length - 1].validator = () => {
						for (let i = 0; i < item.rows.length; i++) {
							if (!submitForm[item.key][item.rows[i]]) {
								return `请选择${item.rows[i]}`
							}
						}
						return true
					}
				}
				renderItem = <ExMatrixCheckbox key={item.key} v-model={submitForm[item.key]} {...componentProps} {...fieldProps} />
				break
			}
			default:
				renderItem = (
					<ExField key={item.key} v-model={submitForm[item.key]} {...fieldProps}>
						{componentSlots}
					</ExField>
				)
				break
		}
	}

	// 为了可以在 renderItem 中使用添加 Break, 所以使用数组包裹, 在外面一层处理
	const formItem = [renderItem]

	if (item.break) {
		formItem.unshift(<Divider {...props.dividerProps}>{{ default: () => (isString(item.break) ? item.break : null) }}</Divider>)
	}

	return formItem
}

export default render
