<template>
	<ExResult type="success" title="恭喜你" description="支付成功了">
		<template #extra>
			<Button type="primary" icon="arrow-left">返回</Button>
		</template>
	</ExResult>
</template>

<script setup>
import ExResult from "../components/result/ExResult.jsx"
import { Button } from "vant"
</script>
