/*
 * @Author: czy0729
 * @Date: 2024-04-03 22:01:12
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-04-03 22:02:30
 */
import { rc } from '@utils/dev'
import { COMPONENT as PARENT } from '../ds'

export const COMPONENT = rc(PARENT, 'Header')

export const HM = ['discovery/yearbook', 'Yearbook'] as const
