/*
 * @Author: czy0729
 * @Date: 2024-01-03 00:33:26
 * @Last Modified by:   czy0729
 * @Last Modified time: 2024-01-03 00:33:26
 */
import { rc } from '@utils/dev'
import { COMPONENT as PARENT } from '../ds'

export const COMPONENT = rc(PARENT, 'Cover')

export const COMPONENT_MAIN = rc(COMPONENT)
