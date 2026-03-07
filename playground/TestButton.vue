<template>
	<div>
		<ExButton type="primary" @click="testFetcher">注册</ExButton>

		<Space style="margin-top: 20px" fill :size="20">
			<ExButton type="primary">注册</ExButton>
			<ExButton type="primary">注册</ExButton>
		</Space>
	</div>
</template>

<script setup>
import { Space } from "vant"
import ExButton from "../components/button/ExButton.jsx"
import { useTimestampFormat, useProcessStatusSuccess, useFindPropertyRecursive, useFindOptionByValue } from "../hooks/index.js"
import { useAddressNameFormCode } from "../components/index.js"

const date = new Date()
console.log(useTimestampFormat(date.getTime()))

console.log(useAddressNameFormCode("440281", 3))

const obj = {
	name: "西学楼1号",
	parent: {
		name: "学生宿舍",
		parent: {
			name: "宿舍区域",
		},
	},
}

const options = [
	{ text: "Option 1", value: "1", children: [] },
	{
		text: "Option 2",
		value: "2",
		children: [
			{ text: "Sub Option 1", value: "2-1", children: [] },
			{
				text: "Sub Option 2",
				value: "2-2",
				children: [
					{ text: "Sub Sub Option 1", value: "2-2-1", children: [] },
					{ text: "Sub Sub Option 2", value: "2-2-2", children: [] },
				],
			},
		],
	},
]

console.log(useFindPropertyRecursive(obj, "name", "parent"))

console.log(useFindOptionByValue(options, "2-2-2"))

const testFetcher = () => {
	useProcessStatusSuccess({ status: 1000, result: { a: 1 } }, () => {
		console.log("SUCCESS")
	})
}
</script>
