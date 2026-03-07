<template>
	<ExGrid :columns="3" :gutter="[10, 10]" style="padding: 10px">
		<ExSector title="剑道式" subtitle="实力派激励" />
		<ExSector title="落叶式" color="blue"
			><template #subtitle><view style="color: red">aaaa</view>游久奔腾着</template></ExSector
		>
		<ExSector title="琪参式" color="orange" />
		<ExSector title="琪参式" subtitle="山中绎膛派" color="red" />
	</ExGrid>
</template>

<script setup>
import ExGrid from "../components/grid/ExGrid.jsx"
import ExSector from "../components/sector/ExSector.jsx"
</script>
