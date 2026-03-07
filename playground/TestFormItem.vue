<template>
	<Form :label-width="80" @submit="onSubmit">
		<ExField v-model="form.name" label="姓名" help="好好填啊" placeholder="填写点东西吧"></ExField>

		<ExAddress v-model="form.address" title="请选择地址" label="地址" help="有什么话就写在这里">
			<template #button>
				<Icon name="fire-o"></Icon>
			</template>
		</ExAddress>
		<ExCheckbox v-model="form.checkbox" label="多选" required :options="getOptions" help="选哪个？">
			<template #button>
				<Icon name="fire-o"></Icon>
			</template>
		</ExCheckbox>

		<ExFieldUploader v-model="form.uploader" label="上传文件" :ex-uploader-props="{ maxNum: 2 }"></ExFieldUploader>

		<ExCascader v-model="form.cascader" :options="state.options" label="级联" required :rules="[{ required: true, message: '请选择级联' }]">
		</ExCascader>

		<ExDate v-model="form.date" :date-props="{ columnsType: ['year', 'month'] }" label="日期" help="行不行的？"></ExDate>

		<ExNumber v-model="form.number" label="数字" rquired></ExNumber>

		<ExRadio v-model="form.radio" label="单选" required :options="getOptions" help="选哪个？"></ExRadio>

		<ExDatetime v-model="form.datetime" label="日期与时间"></ExDatetime>

		<ExSelect label="选择" v-model="form.select" :options="state.options"> </ExSelect>

		<ExRate v-model="form.rate" label="评分" rquired></ExRate>

		<ExSlider v-model="form.slider" label="评分" rquired :slider-props="{ range: true }">
			<template #leftButton>
				<Button>Hello</Button>
			</template>
		</ExSlider>

		<ExSwitch v-model="form.switch" label="开关" rquired></ExSwitch>

		<ExButton :button-props="{ nativeType: 'submit' }">提交</ExButton>
	</Form>

	<div style="margin-top: 20px">
		<ExButton @click="state.options = state.options2">换选项</ExButton>
		<ExButton @click="onChangeDatetime">换DateTime时间</ExButton>
		<ExButton @click="form.select = 'option1'">改 Select 为选项1</ExButton>
	</div>
</template>

<script setup>
import {
	ExAddress,
	ExButton,
	ExCascader,
	ExCheckbox,
	ExNumber,
	ExRadio,
	ExDatetime,
	ExSelect,
	ExDate,
	ExField,
	ExSwitch,
	ExRate,
	ExSlider,
	ExFieldUploader,
} from "../components"
import { reactive } from "vue"
import { Form, Icon, Button } from "vant"

const state = reactive({
	options: [
		{ text: "选项一", value: "option1" },
		{ text: "选项二", value: "option2" },
	],

	options2: [
		{ text: "选项三", value: "option3" },
		{ text: "选项四", value: "option4" },
	],
})

const getOptions = () => {
	return state.options
}

const form = reactive({
	name: "",
	address: ["110000", "110100", "110101"],
	cascader: ["option2"],
	checkbox: ["option1"],
	date: null,
	number: "",
	radio: null,
	datetime: null,
	select: "option1",
	switch: true,
	rate: 0,
	slider: [],
	uploader: {},
})

const onChangeDatetime = () => {
	form.datetime = new Date("2011/01/01 08:12")
}

const onSubmit = () => {
	console.log(form)
}
</script>
