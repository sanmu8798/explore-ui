import { ref } from "vue"
import ExSelect from "../../form/ExSelect.jsx"
import ExCascader from "../../form/ExCascader.jsx"
import { Icon } from "vant"

const render = (item, queryForm, onSearch) => {
	const selectRef = ref()
	const cascadeRef = ref()

	let renderItem
	if (item.type === "select") {
		renderItem = (
			<ExSelect
				ref={selectRef}
				v-model={queryForm[item.key]}
				options={item.options}
				clearable={true}
				onChange={onSearch}
				defaultProps={item.defaultProps}
			>
				{() => (
					<div class={`ex-search__quick-trigger ${queryForm[item.key] ? "active" : ""}`}>
						<span class={"ex-search__quick-label"}>{selectRef.value?.displayText || item.title}</span>
						<span class={"ex-search__quick-icon"}>
							<Icon name={"arrow-down"}></Icon>
						</span>
					</div>
				)}
			</ExSelect>
		)
	} else if (item.type === "cascade") {
		renderItem = (
			<ExCascader
				ref={cascadeRef}
				v-model={queryForm[item.key]}
				options={item.options}
				clearable={true}
				title={`搜索${item.title}`}
				onChange={onSearch}
				defaultProps={item.defaultProps}
			>
				{() => (
					<div class={`ex-search__quick-trigger ${queryForm[item.key]?.length ? "active" : ""}`}>
						<span class={"ex-search__quick-label"}>{cascadeRef.value?.displayText || item.title}</span>
						<span class={"ex-search__quick-icon"}>
							<Icon name={"arrow-down"}></Icon>
						</span>
					</div>
				)}
			</ExCascader>
		)
	}

	return <div class={"ex-search__quick-item"}>{renderItem}</div>
}

export default render
