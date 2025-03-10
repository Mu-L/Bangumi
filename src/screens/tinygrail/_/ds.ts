/*
 * @Author: czy0729
 * @Date: 2019-11-23 03:00:28
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-12-27 07:33:46
 */
import { _ } from '@stores'
import { rc } from '@utils/dev'
import { COMPONENT as PARENT } from '../ds'

export const COMPONENT = rc(PARENT, 'Base')

export const VALHALL_PRICE = {}

export const ITEMS_DESC = {
  混沌魔方: '消耗 10 点「固定资产」获取随机角色 10-200 股，需要有一座塔才能使用，每天 3 次',
  虚空道标:
    '消耗 100 点「固定资产」获取指定角色 10-100 股，需当前角色等级大于等于目标等级，每天 3 次',
  星光碎片: '消耗当前角色「活股」补充目标「固定资产」，受等级差倍率影响，最高为 32 倍',
  闪光结晶:
    '消耗当前角色 100 点「固定资产」，对目标「星之力」造成 20-200 股随机伤害，受等级差倍率影响',
  鲤鱼之眼:
    '消耗当前角色 100 点「固定资产」，将「幻想乡」中 100-300 股转移到「英灵殿」，可能会让（33%-50%）目标股份转化为「星之力」'
} as const

export const TINYGRAIL_LIST_PROPS = {
  windowSize: 6,
  initialNumToRender: 24,
  maxToRenderPerBatch: 24,
  updateCellsBatchingPeriod: 24,
  lazy: 24,
  refreshControlProps: {
    titleColor: _.colorTinygrailText,
    tintColor: _.colorTinygrailText
  },
  footerTextType: 'tinygrailText'
} as const
