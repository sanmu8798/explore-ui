import dayjs from "dayjs"
import { isString } from "lodash-es"

/**
 * 根据格式创建 Dayjs 对象
 * @param {string|number} date
 * @param {string} [format] - 日期格式
 * @return {dayjs.Dayjs}
 */
export function useDayjs(date, format) {
	if ((/^\d+$/.test(date) || /^-\d+$/.test(date)) && String(date).length <= 10) {
		date = parseInt(date + "000")
	}
	return format ? dayjs(date, format) : dayjs(date)
}

/**
 * 格式化日期
 * @param {dayjs.Dayjs|Date} date
 * @param {string} format
 * @return {string}
 */
export function useDateFormat(date, format) {
	if (!date) {
		return ""
	}
	if (!dayjs.isDayjs(date)) {
		date = dayjs(date)
	}

	return date.format(format || "YYYY-MM-DD HH:mm")
}

/**
 * 获取日期的 Unix 时间戳
 * @param {dayjs.Dayjs|Date} date
 * @return {number|string}
 */
export function useDateUnix(date) {
	if (!date) {
		return ""
	}
	if (!dayjs.isDayjs(date)) {
		date = dayjs(date)
	}

	return date.unix()
}

/**
 * 根据时间戳格式化日期
 * @param timestamp 时间戳
 * @param [format] 日期格式
 * @return {string}
 */
export function useTimestampFormat(timestamp, format) {
	if (timestamp && isString(timestamp)) {
		timestamp = parseInt(timestamp)
	}
	if (!timestamp) {
		return ""
	}

	if (timestamp < 9999999999) {
		timestamp *= 1000
	}

	return useDateFormat(new Date(timestamp), format)
}
