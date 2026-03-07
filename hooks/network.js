import axios from "axios"
import { allowMultipleToast, closeToast, showLoadingToast } from "vant"
import { isObject, isString } from "lodash-es"

/**
 * 请求返回状态码
 * @type {{STATE_CODE_NOT_FOUND: string, STATE_CODE_SUCCESS: string, STATE_CODE_FAIL: string, STATE_CODE_INFO_NOT_COMPLETE: string, STATE_CODE_NOT_ALLOWED: string}}
 */
export const STATUS = {
	STATE_CODE_SUCCESS: "SUCCESS", // 成功
	STATE_CODE_FAIL: "FAIL", // 失败
	STATE_CODE_NOT_FOUND: "NOT_FOUND", // 找不到资源
	STATE_CODE_INFO_NOT_COMPLETE: "INCOMPLETE", // 信息不完整
	STATE_CODE_NOT_ALLOWED: "NOT_ALLOWED", //没有权限
}

/**
 * STATUS 适配器，内部使用
 * @param status
 * @private
 */
export function _configStatus(status) {
	Object.keys(status).forEach((key) => {
		STATUS[key] = status[key]
	})
}

/**
 * 通用 AJAX 请求
 * @param {Object} [fetcher] - 用于存储请求状态的对象
 * @returns {{post(*=, *=, *=): Promise<unknown>, get(*=, *=): Promise<unknown>}}
 */
export function useFetch(fetcher) {
	// 记录当前 Fetcher 是否处于 Loading 状态
	let globalLoading = null

	if (!fetcher) {
		fetcher = {}
	}
	fetcher.loading = true

	return {
		/**
		 * get请求
		 * @param url
		 * @param {Object} [config] - axios config
		 * @returns {Promise<unknown>}
		 */
		get(url, config) {
			return new Promise((resolve, reject) => {
				axios
					.get(url, config)
					.then((res) => {
						resolve(res)
					})
					.catch((err) => {
						reject(err)
					})
					.finally(() => {
						if (globalLoading) {
							allowMultipleToast(false)
							globalLoading.close()
						}
						fetcher.loading = false
					})
			})
		},
		/**
		 * post请求
		 * @param {string} url
		 * @param {Object} data
		 * @param {Object} [config] - axios config
		 * @returns {Promise<unknown>}
		 */
		post(url, data, config) {
			return new Promise((resolve, reject) => {
				axios
					.post(url, data, config)
					.then((res) => {
						resolve(res)
					})
					.catch((err) => {
						reject(err)
					})
					.finally(() => {
						if (globalLoading) {
							allowMultipleToast(false)
							globalLoading.close()
						}
						fetcher.loading = false
					})
			})
		},

		/**
		 * 参数为
		 * @param {String|Object} [message] Toast 的 Message 或者是 Toast 的配置
		 * @return {*}
		 */
		loading(message) {
			closeToast(true)
			allowMultipleToast()
			if (isString(message)) {
				globalLoading = showLoadingToast({
					message: message || "加载中...",
					duration: 0,
					forbidClick: true,
				})
			} else if (isObject(message)) {
				globalLoading = showLoadingToast({ duration: 0, ...message })
			} else {
				globalLoading = showLoadingToast({
					message: "加载中...",
					duration: 0,
					forbidClick: true,
				})
			}

			return this
		},
	}
}
