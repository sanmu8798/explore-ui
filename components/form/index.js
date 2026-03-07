import "./index.less"

import withInstall from "../../utils/withInstall"

import _ExField from "./ExField.jsx"
import _ExAddress, {
	addressData as _addressData,
	useAddressFullCode as _useAddressFullCode,
	useAddressNameFormCode as _useAddressNameFormCode,
} from "./ExAddress.jsx"
import _ExCascader from "./ExCascader.jsx"
import _ExCheckbox from "./ExCheckbox.jsx"
import _ExDate from "./ExDate.jsx"
import _ExDatetime from "./ExDatetime.jsx"
import _ExTime from "./ExTime.jsx"
import _ExNumber from "./ExNumber.jsx"
import _ExRadio from "./ExRadio.jsx"
import _ExSelect from "./ExSelect.jsx"
import _ExSwitch from "./ExSwitch.jsx"
import _ExRate from "./ExRate.jsx"
import _ExSlider from "./ExSlider.jsx"
import _ExFieldUploader from "./ExFieldUploader.jsx"
import _ExMatrixRadio from "./ExMatrixRadio.jsx"

import _ExForm from "./ExForm.jsx"

export const useAddressFullCode = _useAddressFullCode
export const useAddressNameFormCode = _useAddressNameFormCode
export const addressData = _addressData
export const ExAddress = withInstall(_ExAddress)
export const ExField = withInstall(_ExField)
export const ExCascader = withInstall(_ExCascader)
export const ExCheckbox = withInstall(_ExCheckbox)
export const ExDate = withInstall(_ExDate)
export const ExDatetime = withInstall(_ExDatetime)
export const ExTime = withInstall(_ExTime)
export const ExNumber = withInstall(_ExNumber)
export const ExRadio = withInstall(_ExRadio)
export const ExSelect = withInstall(_ExSelect)
export const ExSwitch = withInstall(_ExSwitch)
export const ExRate = withInstall(_ExRate)
export const ExSlider = withInstall(_ExSlider)
export const ExFieldUploader = withInstall(_ExFieldUploader)
export const ExMatrixRadio = withInstall(_ExMatrixRadio)

export const ExForm = withInstall(_ExForm)
