import { sm2, sm3, sm4 } from "sm-crypto-v2"

/**
 * 国密 sm2 加密
 * @param msg
 * @param key
 * @param {Object} [cipherMode]
 * @return {Uint8Array}
 */
export function useSm2Encrypt(msg, key, cipherMode) {
	return sm2.doEncrypt(msg, key, cipherMode)
}

/**
 * 国密 sm3 加密
 * @param msg
 * @param {Object} [options]
 * @return {*}
 */
export function useSm3(msg, options) {
	return sm3(msg, options) // 杂凑
}

/**
 * 国密 sm4 加密
 * @param msg
 * @param key
 * @param {Object} [options]
 * @return {Uint8Array}
 */
export function useSm4Encrypt(msg, key, options) {
	return sm4.encrypt(msg, key, options)
}

/**
 * 国密 sm4 解密
 * @param encryptData
 * @param key
 * @param {Object} [options]
 * @return {Uint8Array}
 */
export function useSm4Decrypt(encryptData, key, options) {
	return sm4.encrypt(encryptData, key, options)
}
