<template>
	<div>
		<ExProvider v-bind="exProvider">
			<Sticky>
				<div style="padding: 10px; background-color: #f0f0f0">
					<RadioGroup v-model="checked" direction="horizontal" @change="changeComponent">
						<Row>
							<Col v-for="item in options" :key="item.value" :span="8" style="padding: 3px 0">
								<Radio :name="item.value">{{ item.label }}</Radio>
							</Col>
						</Row>
					</RadioGroup>
				</div>
			</Sticky>

			<div style="padding: 20px">
				<component v-if="isComponent" :is="isComponent"></component>
			</div>
		</ExProvider>
	</div>
</template>

<script setup>
import { RadioGroup, Radio, Row, Col, Sticky } from "vant"
import ExProvider from "../components/provider/ExProvider.jsx"
import TestButton from "./TestButton.vue"
import TestGrid from "./TestGrid.vue"
import TestForm from "./TestForm.vue"
import TestResult from "./TestResult.vue"
import TestQrcode from "./TestQrcode.vue"
import TestSearch from "./TestSearch.vue"
import TestDecorator from "./TestDecorator.vue"
import TestPagination from "./TestPagination.vue"
import TestSector from "./TestSector.vue"
import TestUploader from "./TestUploader.vue"
import TestCascader from "./TestCascader.vue"
import TestSurvey from "./TestSurvey.vue"
import TestSignaturePad from "./TestSignaturePad.vue"

import { useStyleTag, useWindowSize } from "@vueuse/core"
import { onMounted, ref, shallowRef, watch } from "vue"
import { find } from "lodash-es"

//根据屏幕决定字体大小
const { width } = useWindowSize()
const { css } = useStyleTag("")
const setWidth = (width) => {
	css.value = `html{font-size:${width.value / 10}px}`
}

onMounted(() => setWidth(width))

watch(
	() => width,
	() => {
		setWidth(width)
	},
	{
		deep: true,
	},
)

const exProvider = {
	uploader: {
		defaultFileItem: {
			url: "url",
			path: "path",
		},
	},
	/* address: {
        addressUrl: "index.php/resource/region",
        displayTextType: "last",
        optionKeys: {
            value: "value",
            text: "alias",
            children: "children",
        },
        afterFetched(res) {
            return JSON.parse(res.replace(/window\.MS_Regions=|;/g, ""))
        },
    }, */
	pagination: {
		afterFetched: (res) => {
			if (res.status && res.status !== "SUCCESS") {
				return { errorMessage: res.result }
			}
			res = res.result || res
			return {
				items: res.data,
				totalSize: parseInt(res.total || 0),
				currentPage: parseInt(res.current_page || 0),
			}
		},
		requestKeys: {
			currentPage: "page",
			pageSize: "page_size",
		},
	},
	form: {
		format: {
			boolean: true,
		},
	},
}

const checked = ref("Button")
const isComponent = shallowRef()
const options = shallowRef([
	{
		label: "Button",
		value: "Button",
		component: TestButton,
	},
	{
		label: "Grid",
		value: "Grid",
		component: TestGrid,
	},
	{
		label: "Form",
		value: "Form",
		component: TestForm,
	},
	{
		label: "Result",
		value: "Result",
		component: TestResult,
	},
	{
		label: "Qrcode",
		value: "Qrcode",
		component: TestQrcode,
	},
	{
		label: "Search",
		value: "Search",
		component: TestSearch,
	},
	{
		label: "Pagination",
		value: "Pagination",
		component: TestPagination,
	},
	{
		label: "Uploader",
		value: "Uploader",
		component: TestUploader,
	},
	{
		label: "Decorator",
		value: "Decorator",
		component: TestDecorator,
	},
	{
		label: "Sector",
		value: "Sector",
		component: TestSector,
	},
	{
		label: "Cascader",
		value: "Cascader",
		component: TestCascader,
	},
	{
		label: "Survey",
		value: "Survey",
		component: TestSurvey,
	},
	{
		label: "SignaturePad",
		value: "SignaturePad",
		component: TestSignaturePad,
	},
])

if (window.location.hash) {
	checked.value = window.location.hash.replace("#", "")
}

const showComponent = () => {
	isComponent.value = find(options.value, { value: checked.value }).component
}

showComponent()
const changeComponent = (value) => {
	window.location.hash = value
	showComponent()
}
</script>

<style>
html,
body,
#app {
	font-size: var(--van-font-size-md);
}
</style>
