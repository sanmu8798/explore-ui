import ExSelect from "../../form/ExSelect.jsx"
import ExDate from "../../form/ExDate.jsx"
import ExDatetime from "../../form/ExDatetime.jsx"
import ExField from "../../form/ExField.jsx"
import ExNumber from "../../form/ExNumber.jsx"

const render = (item, queryForm) => {
	const fieldElem = () => {
		const fieldProps = { label: item.title, name: item.key, placeholder: `搜索${item.title}` }

		if (item.type === "select") {
			return <ExSelect v-model={queryForm[item.key]} clearable={true} options={item.options} {...fieldProps} {...item.inputProps}></ExSelect>
		} else if (item.type === "date") {
			return <ExDate v-model={queryForm[item.key]} {...fieldProps} {...item.inputProps}></ExDate>
		} else if (item.type === "datetime") {
			return <ExDatetime v-model={queryForm[item.key]} {...fieldProps} {...item.inputProps}></ExDatetime>
		} else if (item.type === "number") {
			return <ExNumber v-model={queryForm[item.key]} {...fieldProps} {...item.props}></ExNumber>
		}

		return <ExField v-model={queryForm[item.key]} {...fieldProps} {...item.inputProps}></ExField>
	}

	return <div class={"ex-search__popup-item ex-search__field-item"}>{fieldElem()}</div>
}

export default render
