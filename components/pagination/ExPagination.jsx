import { defineComponent, inject, nextTick, onMounted, onUnmounted, reactive, ref } from "vue"
import { useCache, useFetch, useSm3 } from "../../hooks"
import { closeToast, Empty, List, Pagination, PullRefresh, showLoadingToast, showToast, Sticky } from "vant"
import ExSearch from "../search/ExSearch.jsx"
import "./index.less"
import { EX_PAGINATION } from "../provider/ExProvider.jsx"
import { isBoolean, isFunction, isObject, isUndefined, pick } from "lodash-es"

/**
 * ExPagination 翻页
 *
 */
export default defineComponent({
	name: "ExPagination",
	props: {
		/**
		 * 下拉刷新的配置
		 * true：表示启用下拉刷新
		 * Object：用于PullRefresh组件的配置
		 * [PullRefresh配置](https://vant-contrib.gitee.io/vant/#/zh-CN/pull-refresh)
		 */
		pullRefresh: { type: [Boolean, Object], default: true },

		/**
		 * ExSearch 搜索配置
		 */
		search: { type: Object, default: null },

		/**
		 * 是否Fix搜索栏
		 * true：表示自动吸顶
		 * Object：用于Sticky组件的配置，常用属性`offsetTop`
		 * [Sticky配置](https://vant-contrib.gitee.io/vant/#/zh-CN/sticky)
		 */
		searchFixed: { type: [Boolean, Object], default: true },

		/**
		 * 请求数据URL
		 *
		 */
		url: { type: String, default: "" },

		/**
		 * 请求方式，默认为 GET
		 *
		 * @values get, post
		 */
		method: { type: String, default: "get" },

		/**
		 * 请求时的附带参数
		 */
		extraData: { type: Object, default: () => ({}) },

		/**
		 * 是否自动加载
		 */
		autoLoad: { type: Boolean, default: true },

		/**
		 * 每页条数
		 */
		pageSize: { type: Number, default: 10 },

		/**
		 * 加载后数据的回调函数
		 */
		afterFetched: { type: Function, default: null },

		/**
		 * 数据为空文案
		 */
		emptyText: { type: String, default: "暂无内容" },

		/**
		 * 加载完毕文案
		 */
		finishText: { type: String, default: "加载完毕" },

		/**
		 * 加载错误文案
		 */
		errorText: { type: String, default: "加载失败，点击重新加载" },

		/**
		 * 滚动条与底部距离小于 offset 时触发 load 事件
		 */
		offset: { type: [Number, String], default: 300 },

		/**
		 * 持久化，传入 localStorage 的 key，如果为 true, 将会以 URL Hash 为 key
		 */
		persistence: { type: [Boolean, String], default: false },

		/**
		 * 是否单页模式
		 */
		singlePage: { type: Boolean, default: false },

		/**
		 * [原生配置](https://vant-contrib.gitee.io/vant/#/zh-CN/list)
		 */
		defaultProps: { type: Object, default: () => ({}) },
	},
	setup(props, { expose, slots }) {
		const paginationProvider = inject(EX_PAGINATION, () => ({}))
		const searchRef = ref(null)

		const { currentPage: currentPageKey, pageSize: pageSizeKey } = paginationProvider.requestKeys

		const genPersistenceKey = (prefix) => {
			if (!props.persistence) {
				return null
			}
			prefix = prefix || ""
			if (isBoolean(props.persistence)) {
				return `exPagination_${prefix}` + useSm3(location.href)
			}

			return `exPagination_${prefix}` + useSm3(location.pathname + "_" + props.persistence)
		}

		let persistencePagination = props.persistence ? useCache(genPersistenceKey()).get({}) : {}

		const state = reactive({
			items: props.singlePage ? [] : persistencePagination.items || [],
			loading: false,
			error: persistencePagination.error || false,
			errorMessage: "",
			totalSize: persistencePagination.totalSize || 0,
			currentPage: persistencePagination.currentPage || 1,
			finished: persistencePagination.finished || false,
			empty: persistencePagination.empty || false,
			searchParams: {},
			offsetTop: 0,
			refreshLoading: false,
			isFirstLoad: true,
		})

		/**
		 * 持久化翻页与滚动
		 */
		const onPersistence = () => {
			if (!props.persistence) {
				return
			}

			const data = {
				empty: state.empty,
				finished: state.finished,
				currentPage: state.currentPage,
				totalSize: state.totalSize,
				error: state.error,
			}

			if (!props.singlePage) {
				data.items = state.items
			}

			useCache(genPersistenceKey()).set(data)
		}

		const onScroll = () => {
			if (props.persistence && !state.loading) {
				useCache(genPersistenceKey("scroll")).set(window.scrollY)
			}
		}

		onMounted(() => {
			window.addEventListener("scroll", onScroll)
		})

		onUnmounted(() => {
			window.removeEventListener("scroll", onScroll)
		})

		const loadMore = async (refresh) => {
			if (refresh) {
				state.items = []
				state.currentPage = 1
				state.error = false
				state.errorMessage = ""
				if (props.persistence) {
					useCache(genPersistenceKey()).remove()
					useCache(genPersistenceKey("scroll")).remove()
				}
			} else if (state.finished) {
				return
			}

			let currentPage = state.currentPage ? state.currentPage : 1

			//如果是错误状态，重新加载时，从当前页开始加载
			if (state.error) {
				currentPage = state.currentPage || 1
			}

			if (props.singlePage) {
				showLoadingToast({
					message: "加载中...",
					forbidClick: true,
				})
			}

			let res,
				data = {}
			try {
				state.loading = true
				state.refreshLoading = true

				const method = props.method

				const params = {
					[currentPageKey]: currentPage,
					[pageSizeKey]: props.pageSize,
					...props.extraData,
					...state.searchParams,
				}

				if (method === "get") {
					data = { params }
				} else if (method === "post") {
					data = { ...params }
				}

				res = await useFetch()[method](props.url, data)
			} catch (e) {
                console.error(e)
				state.error = true
				state.errorMessage = "加载失败"
				if (props.persistence) {
					onPersistence()
				}
				return
			}

			/**
			 * @var {PaginationRes} res
			 */

			if (props.afterFetched && isFunction(props.afterFetched)) {
				res = props.afterFetched(res)
			} else if (paginationProvider.afterFetched && isFunction(paginationProvider.afterFetched)) {
				res = paginationProvider.afterFetched(res)
			}

			if (res.errorMessage) {
				state.error = true
				state.errorMessage = res.errorMessage
				if (props.persistence) {
					onPersistence()
				}
				return
			} else {
				state.error = false
				state.errorMessage = ""
			}

			state.items = props.singlePage ? res.items : [...state.items, ...res.items]
			state.currentPage = res.currentPage
			state.empty = res.totalSize === 0
			state.finished = res.totalSize <= state.items.length
			state.totalSize = res.totalSize

			if (props.persistence) {
				onPersistence()
			}

			if (props.singlePage) {
				if (!state.isFirstLoad) {
					//如果有 persistence 则重置 scroll 来回到顶部
					useCache(genPersistenceKey("scroll")).set(0)
					window.scrollTo({ top: 0 })
				}
				closeToast()
			}

			nextTick(() => {
				state.isFirstLoad = false
				state.refreshLoading = false
				state.loading = false
			})
		}

		const onSearch = (searchData) => {
			if (state.loading || state.refreshLoading) {
				showToast({
					message: "加载中，请稍后",
					forbidClick: true,
				})
				return
			}

			const isPersistence = !isUndefined(searchData.persistence) && searchData.persistence

			if (isPersistence) {
				delete searchData.persistence
			}

			state.searchParams = searchData

			loadMore(!isPersistence)
		}

		/**
		 * 是否自动加载第一页数据
		 * @returns {boolean}
		 */
		const onImmediateCheck = () => {
			if (!props.autoLoad) {
				return false
			}

			if (state.isFirstLoad && props.persistence && state.items.length) {
				return false
			}

			return true
		}

		/**
		 * 瀑布形式自动加载
		 */
		const onLoad = () => {
			//state.searchParams = searchRef.value?.getQueryForm() || {}
			if (!state.isFirstLoad || (state.isFirstLoad && state.currentPage !== 1)) {
				state.currentPage += 1
			}
			loadMore(false)
		}

		/**
		 * 如果没有下拉刷新，并且自动加载，则手动加载一次
		 * 如果是带 Search ，则由 Search 挂载后加载
		 */
		if (props.singlePage && props.autoLoad && !props.search) {
			loadMore(!props.persistence)
		}

		/****************** exposed ******************/

		/**
		 * 获取列表数据
		 * @returns Array
		 */
		const items = () => {
			return state.items || []
		}

		/**
		 * 设置列表数据
		 * @param items
		 */
		const setItems = (items) => {
			state.items = items
		}

		expose({
			loadMore,
			items,
			setItems,
			pagination: pick(state, ["loading", "finished", "empty", "error", "currentPage"]),
		})

		/****************** render ******************/
		const searchElem = () => {
			if (props.search) {
				if (props.searchFixed) {
					const stickyObj = isObject(props.searchFixed) ? props.searchFixed : {}
					//给list添加一个top属性，用于计算顶部距离
					if (isObject(props.searchFixed) && props.searchFixed.offsetTop) {
						state.offsetTop = props.searchFixed.offsetTop
					}
					return (
						<Sticky {...stickyObj}>
							<div class={`ex-pagination__search`}>
								<ExSearch ref={searchRef} persistence={props.persistence} {...props.search} onSearch={onSearch}></ExSearch>
							</div>
						</Sticky>
					)
				} else {
					return (
						<div class={`ex-pagination__search`}>
							<ExSearch ref={searchRef} persistence={props.persistence} {...props.search} onSearch={onSearch}></ExSearch>
						</div>
					)
				}
			} else {
				return null
			}
		}

		const renderItems = () => {
			const elems = state.items
				? state.items.map((item, index) =>
						slots.renderItem
							? slots.renderItem({
									item,
									index,
								})
							: null,
					)
				: null

			nextTick(() => {
				if (props.persistence) {
					const scrollY = useCache(genPersistenceKey("scroll")).get(0)
					window.scrollTo({ top: scrollY })
				}
			})

			return elems
		}

		const paginationElem = () => {
			return (
				<div class={`ex-pagination`}>
					{searchElem()}
					{slots.prepend?.()}

					<div class={`ex-pagination__list`} style={{ paddingTop: `${state.offsetTop}px` }}>
						{state.empty ? (
							<Empty description={props.emptyText}></Empty>
						) : (
							<div>
								<List
									v-model:loading={state.loading}
									v-model:error={state.error}
									immediateCheck={onImmediateCheck()}
									disabled={props.singlePage}
									finished={state.finished}
									finishedText={props.finishText}
									errorText={state.errorMessage || props.errorText}
									onLoad={onLoad}
									offset={props.offset}
									{...props.defaultProps}
								>
									{() => renderItems()}
								</List>
								{props.singlePage ? (
									<Pagination
										v-model={state.currentPage}
										totalItems={state.totalSize}
										onChange={() => loadMore(false)}
									></Pagination>
								) : null}
							</div>
						)}
					</div>
				</div>
			)
		}

		const refreshElem = () => {
			if (props.pullRefresh) {
				const pullRefreshObj = isObject(props.pullRefresh) ? props.pullRefresh : {}
				return (
					<PullRefresh v-model={state.refreshLoading} class={`ex-pagination__refresh`} onRefresh={() => loadMore(true)} {...pullRefreshObj}>
						{() => paginationElem()}
					</PullRefresh>
				)
			} else {
				return paginationElem()
			}
		}

		return () => refreshElem()
	},
})
