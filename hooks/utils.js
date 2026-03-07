import { find, flatMapDeep, isNull, isUndefined, reduce } from "lodash-es"

/**
 * 从 options 中根据 value 获取 text
 * @param value
 * @param options
 * * @param {Object} [adapter={value: "value",label: "label",children: "children"}] - 选项适配器
 * @param adapter
 * @return {*|string|string}
 */
export function useTextFromOptionsValue(value, options, adapter) {
	if (!options) {
		return ""
	}
	adapter = adapter || {
		value: "value",
		label: "text",
	}
	const option = options.find((option) => option[adapter.value] === value)
	return option ? option[adapter.label] : ""
}

/**
 * 从嵌套的 options 中根据 value 获取 text, 如 [1, 3] => ["东", "南"]
 *
 * @param {Array} options - 嵌套的选项
 * @param {Array} values - 需要查找的值
 * @param {Object} [adapter={value: "value",label: "label",children: "children"}] - 选项适配器
 * @return Array
 */
export function useFindTextsInValues(options, values, adapter) {
	adapter = adapter || {
		value: "value",
		label: "text",
		children: "children",
	}

	const labels = []

	function recursiveSearch(node) {
		if (values.includes(node[adapter.value])) {
			labels.push(node[adapter.label])
		}

		if (node[adapter.children]?.length) {
			node[adapter.children].forEach((child) => {
				recursiveSearch(child)
			})
		}
	}

	options.forEach((item) => {
		recursiveSearch(item)
	})

	return labels
}

/**
 * 从嵌套的 options 中根据 value 获取 label, 如地区路径:  [440000, 440100, 440113] => ['广东省', '广州市', '番禺区']
 * @param {Array} options
 * @param {Array} path
 * @param {Object} [adapter]
 * @return Array
 */
export function useFindLabelsFromPath(options, path, adapter) {
	adapter = adapter || {
		value: "value",
		label: "text",
		children: "children",
	}

	let labels = []
	reduce(
		path,
		(acc, value) => {
			const item = find(acc, { [adapter.value]: value })
			if (item) {
				labels.push(item[adapter.label])
				return item[adapter.children]
			}
		},
		options,
	)
	return labels
}

/**
 * 从 options 为 [{text: "", value: "", children: []] 样式的多层数组中，根据所给的 value 递归找出该 option
 * @param {Array} options
 * @param {Number|String} value
 * @param {Object} [adapter]
 * @return {Object|null}
 */
export function useFindOptionByValue(options, value, adapter) {
	adapter = adapter || {
		value: "value",
		label: "text",
		children: "children",
	}

	// 遍历 options 数组
	for (let option of options) {
		// 如果当前 option 的 value 匹配目标值，则返回当前 option
		if (option[adapter.value] === value) {
			return option
		}
		// 如果当前 option 有子选项
		if (option[adapter.children] && option[adapter.children].length) {
			// 递归搜索子选项数组
			const foundOption = useFindOptionByValue(option[adapter.children], value, adapter)
			// 如果找到了匹配的子选项，则返回
			if (foundOption) {
				return foundOption
			}
		}
	}
	// 如果未找到匹配的选项，则返回 null
	return null
}

/**
 * [移动端适配]
 * 从嵌套的 options 中根据 value 获取 text
 * @param {Array} options
 * @param {Array} path
 * @param {Object} [adapter]
 * @return Array
 */
export function useFindTextsFromPath(options, path, adapter) {
	adapter = adapter || {
		value: "value",
		label: "text",
		children: "children",
	}
	return useFindLabelsFromPath(options, path, adapter)
}

/**
 * let obj = {
 *     "name": "西学楼1号",
 *     "parent": {
 *         "name": "学生宿舍",
 *         "parent": {
 *             "name": "宿舍区域",
 *         }
 *     }
 * }
 * useFindPropertyRecursive(obj, 'name', 'parent') // ["西学楼1号", "学生宿舍", "宿舍区域"]
 *
 * 从嵌套的对象中递归获取某个属性
 * @param {Object} item 获取对象
 * @param {String} propertyKey 想获取的属性名称
 * @param {String} nestedKey 嵌套的属性
 * @return Array
 */
export function useFindPropertyRecursive(item, propertyKey, nestedKey) {
	return flatMapDeep(item, (value, key) => {
		if (key === propertyKey) {
			return value
		}
		if (key === nestedKey) {
			return useFindPropertyRecursive(value, propertyKey, nestedKey)
		}
		return []
	})
}

/**
 * 从嵌套的 options 中根据 value 获取 text 路径, 如地区路径: 440113 => ["广东省", "广州市", " 番禺区"]
 * @param options
 * @param value
 * @param adapter
 * @return {*}
 */
export function useFindParentLabels(options, value, adapter) {
	adapter = adapter || {
		value: "value",
		label: "text",
		children: "children",
	}

	const labels = []

	function findParentLabels(options, value, labels) {
		for (const option of options) {
			if (option[adapter.value] === value) {
				labels.unshift(option[adapter.label])
				break
			} else if (option[adapter.children]) {
				const childResult = findParentLabels(option[adapter.children], value, labels)
				if (childResult.length > 0) {
					labels.unshift(option[adapter.label])
					break
				}
			}
		}

		return labels
	}

	return findParentLabels(options, value, labels)
}

/**
 * 从嵌套的 options 中根据 value 获取整个 values 路径, 如地区路径: 440113 => [440000, 440100, 440113]
 * @param options
 * @param value
 * @param adapter
 * @return Array
 */
export function useFindParentValues(options, value, adapter) {
	adapter = adapter || {
		value: "value",
		label: "text",
		children: "children",
	}

	const values = []

	function findParentValues(options, value, values) {
		for (const option of options) {
			if (option[adapter.value] === value) {
				values.unshift(option[adapter.value])
				break
			} else if (option[adapter.children]) {
				const childResult = findParentValues(option[adapter.children], value, values)
				if (childResult.length > 0) {
					values.unshift(option[adapter.value])
					break
				}
			}
		}

		return values
	}

	return findParentValues(options, value, values)
}

const localCacheSession = {}
const localSession = {
	setItem(key, value) {
		localCacheSession[key] = value
	},
	getItem(key) {
		return localCacheSession[key]
	},
	removeItem(key) {
		delete localCacheSession[key]
	},
}

window._printCache = () => {
	console.log(JSON.parse(JSON.stringify(localCacheSession, null, 2)))
}

/**
 * 用于储存缓存的值
 * @param {*} key 缓存的 key
 * @param {*} [sessionType] 缓存的类型，默认为内存缓存
 * @returns get(默认值) 获取缓存的值，set(键, 值) 设置缓存的值
 */
export function useCache(key, sessionType) {
	const cacheSession = sessionType || localSession
	const shouldTransform = !!sessionType // 如果是 localStorage 之类的，则需要转换一下
	return {
		get(defaultValue) {
			const value = cacheSession.getItem(key)
			if (isNull(value) || isUndefined(value)) {
				return defaultValue
			}
			return shouldTransform ? JSON.parse(value) : value
		},
		set(value) {
			cacheSession.setItem(key, shouldTransform ? JSON.stringify(value) : value)
		},
		remove() {
			cacheSession.removeItem(key)
		},
	}
}
