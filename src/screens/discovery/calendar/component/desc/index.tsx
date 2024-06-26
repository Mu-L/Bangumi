/*
 * @Author: czy0729
 * @Date: 2024-03-29 10:25:04
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-03-30 07:52:04
 */
import React from 'react'
import { Text } from '@components'
import { getOnAirItem } from '@utils'
import { obc } from '@utils/decorators'
import { ReactNode, SubjectId, TextStyle } from '@types'
import { Ctx } from '../../types'
import { COMPONENT } from './ds'

function Desc(
  {
    style,
    subjectId,
    sites,
    size = 11,
    filterToShow = false
  }: {
    style?: TextStyle
    subjectId: SubjectId
    sites?: any
    size?: number

    /** 是否筛选中才显示 */
    filterToShow?: boolean
  },
  { $ }: Ctx
) {
  if (filterToShow) {
    if (!($.state.adapt || $.state.origin || $.state.tag)) return null
  }

  const els: ReactNode[] = []

  const extra: string[] = []
  if (sites?.b) extra.push('bilibili')
  if (!sites?.b && sites?.bhmt) extra.push('bilibili 港澳台')
  if (sites?.i) extra.push('爱奇艺')
  if (sites?.q) extra.push('腾讯视频')
  if (extra.length) {
    els.push(
      <Text type='sub' size={size} lineHeight={size + 1} bold>
        {extra.join(' / ')}
      </Text>
    )
  }

  const { type: adapt = '', tag = '', origin = '' } = getOnAirItem(subjectId)
  if (adapt) {
    els.push(
      <Text type={$.state.adapt === adapt ? 'main' : 'sub'} size={size} lineHeight={size + 1} bold>
        {adapt}
      </Text>
    )
  }

  if (tag) {
    els.push(
      ...tag.split('/').map(item => (
        <Text type={$.state.tag === item ? 'main' : 'sub'} size={size} lineHeight={size + 1} bold>
          {item}
        </Text>
      ))
    )
  }

  if (origin) {
    els.push(
      ...origin.split('/').map(item => (
        <Text
          type={$.state.origin === item ? 'main' : 'sub'}
          size={size}
          lineHeight={size + 1}
          bold
        >
          {item}
        </Text>
      ))
    )
  }

  if (!els.length) return null

  return (
    <Text style={style} size={size} lineHeight={size + 1}>
      {els.map((item, index) => (
        <>
          {!!index && (
            <Text type='sub' size={size} lineHeight={size + 1} bold>
              {' '}
              /{' '}
            </Text>
          )}
          {item}
        </>
      ))}
    </Text>
  )
}

export default obc(Desc, COMPONENT)
