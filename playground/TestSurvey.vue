<template>
	<ExSurvey
		:title="state.survey.title"
		:slug="state.survey.slug"
		:intro="state.survey.intro"
		:outro="state.survey.outro"
		:start-chapter="state.survey.last_finish_chapter"
		:form-items="state.survey.form?.items || []"
		submit-url="http://uni-affair.test/api/v1/student/survey/answer"
	></ExSurvey>
</template>
<script setup>
import ExSurvey from "../business-components/survey/ExSurvey.jsx"
import { useFetch } from "../hooks"
import { reactive } from "vue"

const state = reactive({
	survey: {},
})

const fetchSurvey = async () => {
	const res = await useFetch().get("http://uni-affair.test/api/v1/student/survey/1")
	state.survey = res.result
}

fetchSurvey()
</script>
