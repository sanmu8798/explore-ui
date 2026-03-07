import { defineComponent, provide } from "vue"

export const EX_UPLOADER = Symbol("EX_UPLOADER")
export const EX_ADDRESS = Symbol("EX_ADDRESS")
export const EX_FORM = Symbol("EX_FORM")
export const EX_SEARCH = Symbol("EX_SEARCH")
export const EX_PAGINATION = Symbol("EX_PAGINATION")

/**
 * Explore 配置组件
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExProvider",
	/**
	 * @typedef {Object} ProviderProps
	 * @property {UploaderProviderProps} [uploader] `ExUploader` 配置
	 * @property {AddressProviderProps} [address] `ExAddress` 配置
	 * @property {FormProviderProps} [form] `ExForm` 配置
	 * @property {SearchProviderProps} [search] `ExSearch` 配置
	 * @property {PaginationProviderProps} [pagination] `ExPagination` 配置
	 *
	 */
	props: {
		/**
		 * @typedef {Object} UploaderProviderProps `ExUploader` 配置
		 * @property {string} uploadUrl 上传地址
		 * @property {UploadFileItem} defaultFileItem 默认文件项
		 *
		 * @typedef {Object} UploadFileItem 文件项
		 * @property {string} [id] 文件 ID
		 * @property {string} [name] 文件名
		 * @property {string} defaultFileItem.url 文件地址
		 * @property {string} defaultFileItem.path 文件路径
		 * @property {string} [thumbUrl] 缩略图地址
		 */
		uploader: {
			type: Object,
			default: () => ({
				uploadUrl: "",
				defaultFileItem: {
					id: "id",
					name: "name",
					url: "url",
					path: "path",
					thumbUrl: "thumbUrl",
				},
			}),
		},

		/**
		 * @typedef {Object} AddressProviderProps `ExAddress` 配置
		 * @property {string} addressUrl 选项请求地址
		 * @property {string} displayTextType 显示值的类型。"all": 所有, last：最后选中的值
		 * @property {Function} [afterFetched] 处理接口返回数据的函数
		 * @property {AddressOptionKeys} optionKeys 地址选项键名
		 *
		 * @typedef {Object} AddressOptionKeys 地址选项键名
		 * @property {string} optionKeys.value 选项对应的值
		 * @property {string} optionKeys.text 选项文字
		 * @property {string} optionKeys.children 子选项列表
		 */
		address: {
			type: Object,
			default: () => ({
				addressUrl: "",
				displayTextType: "",
				afterFetched: null,
				optionKeys: {
					value: "code",
					text: "name",
					children: "children",
				},
			}),
		},

		/**
		 * @typedef {Object} FormProviderProps `ExForm` 配置
		 * @property {Object} [format] 格式化配置, 如 {date: true} 表示在提交表单时使用 `useFormFormat` 格式所有日期字段
		 * @property {Function} [afterFetched] 处理接口返回数据的函数
		 */
		form: {
			type: Object,
			default: () => ({
				format: {},
				afterFetched: null,
			}),
		},

		/**
		 * @typedef {Object} SearchProviderProps `ExSearch` 配置
		 * @property {Object} [maskClass] 定制伪 Input 样式
		 * @property {Object} [inputClass] 弹层中 Input 的样式
		 */
		search: {
			type: Object,
			default: () => ({
				maskClass: "",
				inputClass: "",
			}),
		},

		/**
		 * @typedef {Object} PaginationRes
		 * @property {Array} items 数据
		 * @property {number} currentPage 当前页码
		 * @property {number} totalSize 总条数
		 * @property {String} [errorMessage] 错误信息
		 */

		/**
         * @typedef {Object} PaginationProviderProps `ExPagination` 配置
         * @property {function():PaginationRes} [afterFetched] 处理接口返回数据的函数
         * @property {PaginationRequestKeys} [requestKeys] 请求参数键名
         * /

         /**
         * @typedef {Object} PaginationRequestKeys 请求参数键名
         * @property {string} [currentPage] 当前页码
         * @property {string} [pageSize] 每页条数
         */
		pagination: {
			type: Object,
			default: () => ({
				afterFetched: null,
				requestKeys: {
					currentPage: "currentPage",
					pageSize: "pageSize",
				},
			}),
		},
	},
	setup(props, { slots }) {
		provide(EX_UPLOADER, {
			uploadUrl: props.uploader?.uploadUrl || "",
			defaultFileItem: {
				id: "id",
				name: "name",
				url: "url",
				path: "path",
				thumbUrl: "thumbUrl",
				...props.uploader?.defaultFileItem,
			},
		})
		provide(EX_ADDRESS, {
			addressUrl: props.address?.addressUrl || "",
			displayTextType: props.address?.displayTextType || "",
			afterFetched: props.address?.afterFetched,
			optionKeys: {
				value: "code",
				text: "name",
				children: "children",
				...props.address?.optionKeys,
			},
		})
		provide(EX_FORM, { format: {}, ...props.form })
		provide(EX_SEARCH, {
			maskClass: "",
			inputClass: "",
			...props.search,
		})
		provide(EX_PAGINATION, {
			afterFetched: props.pagination?.afterFetched,
			requestKeys: {
				currentPage: "currentPage",
				pageSize: "pageSize",
				...props.pagination?.requestKeys,
			},
		})

		return () => <div>{slots.default?.()}</div>
	},
})
