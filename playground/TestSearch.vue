<template>
	<Button type="primary" @click="clearSearch">清除</Button>
	<ExSearch ref="search" v-model="state.searchData" :columns="columns" @search="onSearch"></ExSearch>
</template>

<script setup>
import { ref, reactive } from "vue"
import { Button } from "vant"
import ExSearch from "../components/search/ExSearch.jsx"
import { computed } from "vue"

const search = ref(null)
const clearSearch = () => {
	search.value.reset()
}

const state = reactive({
	options: [],
	searchData: "fdsfds",
})

const onSearch = (res) => {
	console.log(res)
}

const columns = computed(() => [
	{
		key: "college",
		type: "select",
		title: "学院",
		quick: true,
		options: state.options,
	},
	{
		key: "college1",
		type: "select",
		title: "学院",
		expandable: "multiple",
		options: [
			{ text: "信息学院", value: "12" },
			{ text: "会计学院", value: "13" },
		],
	},
	{
		key: "age",
		title: "年龄",
	},
	{
		key: "date",
		type: "date",
		title: "日期",
	},
	{
		key: "gender",
		type: "select",
		title: "性别",
		expandable: true,
		options: [
			{ text: "男", value: "man" },
			{ text: "女", value: "female" },
		],
	},
	{
		key: "cascade",
		title: "级联选择器",
		type: "cascade",
		quick: true,
		beforeSubmit({ value, queryForm }) {
			console.log(value, queryForm)
			return value[0]
		},
		options: [
			{
				value: "zhejiang",
				label: "Zhejiang",
				children: [
					{
						value: "hangzhou",
						label: "Hangzhou",
						children: [
							{
								value: "xihu",
								label: "West Lake",
							},
						],
					},
				],
			},
			{
				value: "jiangsu",
				label: "Jiangsu",
				children: [
					{
						value: "nanjing",
						label: "Nanjing",
						children: [
							{
								value: "zhonghuamen",
								label: "Zhong Hua Men",
							},
						],
					},
				],
			},
		],
	},
])

setTimeout(() => {
	state.options = [
		{ text: "信息学院", value: "12" },
		{ text: "会计学院", value: "13" },
	]
}, 1000)
</script>
