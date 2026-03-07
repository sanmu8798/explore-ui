import { computed, defineComponent, inject, onMounted, reactive, watch } from "vue"
import { Button, showToast, Uploader } from "vant"
import { every, findIndex, isArray, isEqual, isFunction, map, pick, random } from "lodash-es"
import { STATUS, useFetch } from "../../hooks"
import { EX_UPLOADER } from "../provider/ExProvider.jsx"

/**
 * ExUploader 文件上传
 * @version 1.0.0
 */
export default defineComponent({
	name: "ExUploader",
	props: {
		modelValue: { type: [Object, Array], default: () => ({}) },

		/**
		 * 上传文件字段名
		 */
		name: { type: String, default: "file" },

		/**
		 * 接受上传的文件类型, 详见 [input accept Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept)
		 */
		accept: { type: String, default: "" },

		/**
		 * 设置上传的请求头部，IE10 以上有效
		 */
		headers: { type: Object, default: () => ({}) },

		/**
		 * 上传列表的基本样式 text, picture
		 *
		 * @values text, picture
		 */
		type: { type: String, default: "picture" },

		/**
		 * 是否禁用
		 */
		disabled: { type: Boolean, default: false },

		/**
		 * 是否只读
		 */
		readonly: { type: Boolean, default: false },

		/**
		 * 单个文件大小上限，单位为 MB
		 */
		maxSize: { type: Number, default: 10 },

		/**
		 * 上传文件个数上限
		 */
		maxNum: { type: Number, default: 1 },

		/**
		 * 是否支持多选文件
		 */
		multiple: { type: Boolean, default: false },

		/**
		 * 上传文件的服务器地址
		 */
		action: { type: String, default: "" },

		/**
		 * 上传后的数据处理回调
		 */
		afterUpload: { type: Function, default: null },

		/**
		 * 上传时的附加参数
		 */
		extraData: { type: Object, default: () => ({}) },

		/**
		 * 上传按钮文本
		 */
		uploadText: { type: String, default: "上传" },

		/**
		 * 上传区域图标名称或图片链接，等同于 Icon 组件的 name 属性
		 */
		uploadIcon: { type: String, default: "photograph" },

		/**
		 * 上传盘符标志，可以灵活配合后台使用
		 */
		disk: { type: String, default: "" },

		/**
		 * [原生配置](https://vant-contrib.gitee.io/vant/#/zh-CN/uploader)
		 */
		uploaderProps: {
			type: Object,
			default: () => ({}),
		},
	},
	emits: ["update:modelValue", "success", "change"],
	setup(props, { emit, slots }) {
		const uploaderProvider = inject(EX_UPLOADER, () => ({}))
		const defaultUploadUrl = uploaderProvider.uploadUrl || ""
		const defaultFileItem = uploaderProvider.defaultFileItem || {}

		const { url: urlKey, path: pathKey, name: nameKey } = defaultFileItem

		const state = reactive({
			fileList: [],
		})

		const maxSize = computed(() => props.maxSize * 1024 * 1024)

		const isImage = computed(() => props.type === "picture")

		const isSingle = computed(() => props.maxNum === 1)

		const processFileList = (fileList) => {
			if (!fileList) {
				return []
			}
			fileList = isArray(fileList) ? fileList : [fileList]

			fileList = fileList.filter((item) => item.status === "done" || !!item[nameKey] || !!item[pathKey])
			fileList = fileList.map((item) => ({
				...pick(item, Object.values(defaultFileItem)),
				_type: "file",
				_disk: props.disk,
			}))
			if (isSingle.value) {
				return (
					fileList[0] || {
						[pathKey]: "",
						[urlKey]: "",
						_type: "file",
					}
				)
			}

			return fileList || []
		}

		const submitFile = () => {
			const fileList = processFileList(state.fileList)
			emit("update:modelValue", fileList)
			emit("change", fileList)
		}

		const prepareFileList = (fileList) => {
			if (!fileList) {
				return []
			}

			fileList = isArray(fileList) ? fileList : [fileList]

			state.fileList = fileList
				.filter((item) => item[urlKey] || item[pathKey])
				.map((item) => ({
					uid: random(1, 10000000),
					url: item[urlKey],
					status: "done",
					isImage: isImage.value,
					_type: "file",
					...item,
				}))

			//由于初始值可能不符合文件结构，处理后再次触发更新
			const processedFileList = processFileList(state.fileList)
			emit("update:modelValue", processedFileList)
			emit("change", processedFileList)
		}

		onMounted(() => prepareFileList(props.modelValue))

		watch(
			() => props.modelValue,
			(newFileList) => {
				let fileList = newFileList && !isArray(newFileList) ? [newFileList] : newFileList
				fileList = fileList.filter((item) => item[urlKey] || item[pathKey])
				//有时会由于种种原因丢失初始化后的信息，有异常的话再次初始化
				//异常情况包括：1. 文件列表不一致了， 2. 文件类型标识不见了 ...有后有其它的再加
				if (
					!isEqual(map(fileList, pathKey).sort(), map(state.fileList, pathKey).sort()) ||
					!every(fileList, (item) => item._type === "file")
				) {
					prepareFileList(fileList)
				} else if (Object.prototype.toString.call(newFileList) === "[object Object]" && !newFileList._type && fileList.length === 0) {
					//如果是对象，并且没有文件类型，可以认为文件改变了，需要更新文件列表
					prepareFileList(newFileList)
				}
			},
		)

		const onOversize = () => {
			showToast(`文件大小不能超过 ${props.maxSize}mb`)
		}

		const onSuccess = (file, result) => {
			file.status = "done"
			file.message = "上传成功"
			file = { ...file, ...pick(result, Object.values(defaultFileItem)) }
			file.url = file[urlKey]

			const fileIndex = findIndex(state.fileList, { uid: file.uid })

			state.fileList[fileIndex] = file

			submitFile()

			emit("success", { file, response: result })
		}

		const onError = (file, result) => {
			file.status = "failed"
			file.message = result || "上传失败"
		}

		const onDelete = () => {
			submitFile()
		}

		const onSubmit = async (files) => {
			if (!isArray(files)) {
				files = [files]
			}

			for (let file of files) {
				file.uid = random(1, 10000000)
				file.status = "uploading"
				file.message = "上传中..."

				const formData = new FormData()
				Object.keys(props.extraData).forEach((key) => {
					formData.append(key, props.extraData[key])
				})

				if (props.disk) {
					formData.append("_disk", props.disk)
				}

				formData.append(props.name, file.file)

				try {
					let res = await useFetch().post(props.action || defaultUploadUrl, formData, {
						withCredentials: true,
						headers: props.headers,
					})

					let result = res.result

					if (res.status !== STATUS.STATE_CODE_SUCCESS) {
						onError(file, result)
						return
					}

					if (props.afterUpload && isFunction(props.afterUpload)) {
						result = props.afterUpload(res)
					}

					onSuccess(file, result)
				} catch (e) {
                    console.error(e)
					onError(file)
				}
			}
		}

		const customSlot = () => {
			if (!isImage.value) {
				slots.default = () => (
					<Button icon="plus" type="primary" size={"small"}>
						{props.uploadText}
					</Button>
				)
			}
			return slots
		}

		return () => (
			<div class={"ex-uploader"}>
				<Uploader
					v-model={state.fileList}
					maxCount={props.maxNum}
					maxSize={maxSize.value}
					accetp={props.accept}
					uploadText={props.uploadText}
					uploadIcon={props.uploadIcon}
					disabled={props.disabled}
					readonly={props.readonly}
					deletable={!(props.readonly || props.disabled)}
					showUpload={!props.readonly && !props.disabled}
					afterRead={onSubmit}
					onOversize={onOversize}
					onDelete={onDelete}
					multiple={props.multiple}
					{...props.uploaderProps}
				>
					{customSlot()}
				</Uploader>
			</div>
		)
	},
})
