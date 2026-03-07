<template>
	<div>
		<ExButton type="primary">注册</ExButton>

		<Space style="margin-top: 20px" fill :size="20">
			<ExButton type="primary">注册</ExButton>
			<ExButton type="primary">注册</ExButton>
		</Space>

		<ExGrid :gutter="[10, 10]" style="margin-top: 20px">
			<ExButton type="primary">注册</ExButton>
			<ExButton type="primary">注册</ExButton>
			<ExButton type="primary">注册</ExButton>
		</ExGrid>
	</div>
</template>

<script setup>
import { Space } from "vant"
import ExButton from "../components/button/ExButton.jsx"
import ExGrid from "../components/grid/ExGrid.jsx"
</script>
