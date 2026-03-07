<template>
	<ExUploader action="api/v1/student/tool/file/upload" v-model="img" :max-num="3" upload-text="上传相片"></ExUploader>
</template>

<script setup>
import { ref } from "vue"
import ExUploader from "../components/uploader/ExUploader.jsx"

const img = ref({
	short_url: "sdfdsf",
	full_url: "https://www.gdfs.edu.cn/_mediafile/zhuwangzhan/2021/11/29/3d96zy6lu7.jpg",
})
//const img = ref(null)
</script>
