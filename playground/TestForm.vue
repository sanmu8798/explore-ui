<template>
	<div>
		<Button @click="reset">reset</Button>
		<ExForm
			cacheable="xx-create"
			label-width="100%"
			ref="form"
			:form="getTestForm()"
			title="测试表单"
			submit-url="/api/test/submit"
			:data="formData"
			closable
			:divider-props="{ contentPosition: 'left' }"
			:before-submit="onBeforeSubmit"
			:after-fetched="onAfterFetched"
		>
			<template #footer>
				<div style="font-size: 13px">
					<Checkbox v-model="checked">《活动参与协议》</Checkbox>
				</div>
			</template>
		</ExForm>
	</div>
</template>
<script setup>
import ExForm from "../components/form/ExForm.jsx"
import { Checkbox, Icon, showFailToast, Button } from "vant"
import { h, ref } from "vue"
import { useDayjs } from "../hooks/datetime.js"

const checked = ref(false)

const form = ref(null)

const formData = ref({
	"test-input": 123123,
})

const reset = () => {
	formData.value.cascade = "zhonghuamen"
	formData.value.cascade_cn = "夸张"
	form.value.reset(formData.value)
}

const onBeforeSubmit = ({ formatForm }) => {
	console.log(formatForm)
	/*if (!checked.value) {
        showFailToast("请先同意参与协议")
        return false
    }*/
	return formatForm
}

const onAfterFetched = (res) => {
	return res.result
}

const getTestForm = () => {
	return [
		/*{
            key: "appointment_at",
            title: "预约日期",
            type: "date",
            init({ value }) {
                return value ? new Date(value) : null
            },
        },*/
		{
			title: "凭证",
			key: "attachment",
			type: "uploader",
			defaultProps: {
				accept: ".png,.jpg,.jpeg",
				action: "api/v1/student/tool/file/upload",
				type: "picture",
				maxSize: 10,
			},
		},
		{
			title: "选择",
			key: "test-select",
			type: "select",
			options: ["A", "B"],
			exProps: {
				filterable: true,
			},
		},
	]
}

const getForm = () => [
	{ key: "test-input", title: "测试" },
	/*{
        key: "uploader1",
        title: "上传文件",
        type: "uploader",
        defaultValue: [{ path: "xxxx.jpg" }, { path: "xxx2.jpg" }],
        defaultProps: {
            type: "text",
            maxNum: 2,
        },
    },*/
	/*{
        key: "matrix-radio",
        type: "matrix-radio",
        title: "矩阵单选",
        rows: ["质量", "外观"],
        options: ["很好", "一般", "很差", "很差", "很差", "很差", "很差"],
        //defaultValue: { 质量: "很好", 外观: "一般" },
        //required: true,
    },
    {
        key: "matrix-scale",
        type: "matrix-scale",
        title: "矩阵量表",
        rows: ["质量", "外观"],
        options: ["很好", "一般", "很差"],
        defaultProps: {
            level: 5,
        },
        //required: true,
    },
    {
        key: "matrix-checkbox",
        type: "matrix-checkbox",
        title: "矩阵多选",
        rows: ["质量", "外观"],
        options: ["很好", "一般", "很差"],
        //required: true,
        //defaultValue: { 质量: ["很好", "一般"] },
    },*/
	/*    {
   key: "select",
   title: "选择 Select",
   type: "select",
   options: ["一", "二"],
},{
   key: "q_rank",
   type: "rate",
   title: "咨询评价",
   required: true,
   defaultProps: {
       count: 10,
       clearable: false,
   },
},*/
	/*	{
            key: "numbe1r",
            title: "number",
            required: true,
            defaultProps: {
                min: -10,
            },
            type: "number",
        },*/
	/* {
        key: "match",
        required: true,
        title: "动态匹配 match",
        match(submitForm) {
            if (submitForm.text === "1") {
                return { type: "input" }
            } else {
                return { type: "number" }
            }
        },
        append() {
            return `aaaaaa`
        },
    }, */
	/*{
        key: "cascade",
        title: "级联选择器 Cascader",
        type: "cascade",
        required: false,
        defaultValue: "xihu",
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
                            {
                                value: "aaa",
                                label: "aaaaa",
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

        exProps: {},
        defaultProps: {
            onFinish({ value }) {
                console.log("value", value)
            },
        },
    },*/
	/*{
        key: "s_local",
        title: "地址",
        type: "address",
        required(submitForm) {
            return submitForm.text === "1"
        },
        disabled(submitForm) {
            return submitForm.text === "2"
        },
        hidden(submitForm) {
            return submitForm.text === "3"
        },
        help() {
            return h("div", { innerHTML: "请填写您的<br />地址请填写您的地址请填写您的地址请填写您的地址请填写您的地址" })
        },
        beforeSubmit({ submitForm }) {
            return submitForm.address
        },
        exProps: {
            textInValue: true,
        },
        init({ existingData }) {
            return [{ value: existingData.s_local, alias: existingData.s_local_cn }]
        },
        append() {
            return null
        },
    },
    {
        key: "text",
        title: "Text",
    },
    {
        key: "readonlyinput",
        title: "readonly",
        readonly: true,
        defaultValue() {
            return "老丈人"
        },
    },
    {
        key: "input",
        title: "输入 Input",
        required: true,
        defaultValue() {
            return "测试的文字"
        },
        slots: {
            button: () => {
                return h(Icon, { name: "cross" })
            },
        },
    },
    {
        key: "s_job_pic",
        title: "上传图片",
        type: "uploader",
        defaultProps: {
            action: "/index.php/stu/StuInfo/job_save_pic",
            maxNum: 3,
        },
    },
    {
        key: "uploader1",
        title: "上传文件",
        type: "uploader",
        defaultProps: {
            exUploaderProps: {
                type: "text",
            },
        },
    },
    {
        key: "members",
        title: "参赛选手",
        type: "group",
        columnIndex: [0, 2],
        children: [
            {
                title: "姓名",
                key: "name",
            },
            {
                title: "年龄",
                key: "age",
                type: "number",
                cellProps: {
                    align: "center",
                    customRender: ({ record }) => {
                        return h("span", { style: { color: "red" } }, `${record.age}岁`)
                    },
                },
            },
            {
                title: "性别",
                key: "gender",
                type: "select",
                options: [
                    { label: "男", value: 1 },
                    { label: "女", value: 2 },
                ],
            },
        ],
    },
    {
        key: "password",
        title: "密码 Password",
        type: "password",
    },
    {
        key: "textarea",
        title: "长文本 Textarea",
        type: "textarea",
        readonly: true,
        break: "一个新的行",
        fieldProps: {
            maxlength: 100,
            showWordLimit: true,
        },
    },
        {
            key: "html",
            title: "HTML",
            type: "html",
            defaultValue: "<p style='color: #ff0000; margin: 0;'>插播一条 HTML</p>",
        },
    {
        key: "gender",
        title: "性别",
        type: "radio",
        options: ["男", "女"],
        defaultProps: {
            direction: "vertical",
        },
    },
    {
        key: "checkbox",
        title: "多选 Checkbox",
        type: "Checkbox",
        options: ["选项1", "选项2"],
        defaultValue: ["选项2"],
        defaultProps: {
            direction: "horizontal",
        },
    },

    {
        key: "switch",
        title: "开关 switch",
        type: "switch",
        options: ["开", "关"],
    },
    {
        key: "s_job_start",
        title: "日期 Date",
        type: "date",
        init({ existingData }) {
            return existingData.s_job_start && existingData.s_job_start !== "0" ? new Date(existingData.s_job_start * 1000) : null
            //return useDayjs(existingData.s_job_start)
        },
    },
    {
        key: "datetime",
        title: "日期+时间 Datetime",
        type: "datetime",
        defaultProps: {
            calendarProps: {
                onSelect: (val) => {
                    console.log(val)
                },
            },
        },
    },
    {
        key: "time",
        title: "时间 Time",
        type: "time",
        defaultProps: {
            onChange: (val) => {
                console.log(val)
            },
        },
    },
    {
        key: "remote",
        title: "远程检索 Remote",
        type: "remote",
        url: "https://suggest.taobao.com/sug",
        keyword: "q",
        onSearch: (res) => {
            return res.result.map((item) => {
                return {
                    label: item[0],
                    value: item[1],
                }
            })
        },
    },*/
]
</script>

<style>
body {
	background: #f3f9f8;
}
</style>
