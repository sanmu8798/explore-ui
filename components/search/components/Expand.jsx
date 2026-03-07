import { isUndefined } from "lodash-es"
import { reactive } from "vue"
import { Button, Collapse, CollapseItem } from "vant"
import ExGrid from "../../grid/ExGrid.jsx"

const render = (item, queryForm) => {
	if (isUndefined(item._temp)) {
		item._temp = reactive({
			activeNames: item.key,
		})
	}

	const toggleChooseOption = (value) => {
		if (item.expandable === "multiple") {
			if (!queryForm[item.key] || !queryForm[item.key]?.length) {
				queryForm[item.key] = [value]
			} else {
				const index = queryForm[item.key].indexOf(value)
				if (index === -1) {
					queryForm[item.key].push(value)
				} else {
					queryForm[item.key].splice(index, 1)
				}
			}
		} else {
			queryForm[item.key] = queryForm[item.key] === value ? "" : value
		}
	}

	const isOptionActive = (value) => {
		if (item.expandable === "multiple") {
			return queryForm[item.key]?.includes(value)
		} else {
			return queryForm[item.key] === value
		}
	}

	const optionElems = () => (
		<ExGrid columns={3}>
			{{
				default: () =>
					item.options.map((option) => (
						<Button
							class={`ex-search__expand-option`}
							type={`${isOptionActive(option.value) ? "primary" : "default"}`}
							hairline={true}
							round={true}
							size={"small"}
							onClick={() => toggleChooseOption(option.value)}
						>
							{option.text}
						</Button>
					)),
			}}
		</ExGrid>
	)

	return (
		<div class={"ex-search__popup-item ex-search__expand-item"}>
			<Collapse v-model={item._temp.activeNames} border={false} accordion={true}>
				{{
					default: () => (
						<CollapseItem name={item.key}>
							{{
								default: () => <div class={"ex-search__expand-options"}>{optionElems()}</div>,
								title: () => <span class={"ex-search__expand-title"}>{item.title}</span>,
								value: () => <span class={"ex-search__expand-trigger"}>展开</span>,
							}}
						</CollapseItem>
					),
				}}
			</Collapse>
		</div>
	)
}

export default render
