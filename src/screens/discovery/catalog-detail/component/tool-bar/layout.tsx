/*
 * @Author: czy0729
 * @Date: 2024-03-20 00:14:08
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-08-09 20:15:55
 */
import React from 'react'
import { ToolBar } from '@components'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import { LAYOUT_DS } from '../../ds'
import { Ctx } from '../../types'
import { LAYOUT_DATA } from './ds'

function Layout(_props, { $ }: Ctx) {
  const text = LAYOUT_DS.find(item => item.key === $.state.layout)?.['title']
  return (
    <ToolBar.Popover
      data={LAYOUT_DATA}
      icon={text === '网格' ? 'md-grid-view' : 'md-menu'}
      iconColor={_.colorDesc}
      iconSize={17}
      text={text}
      type='desc'
      onSelect={$.onSwitchLayout}
    />
  )
}

export default obc(Layout)
