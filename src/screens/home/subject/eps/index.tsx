/*
 * @Author: czy0729
 * @Date: 2021-08-07 07:13:33
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-26 11:31:58
 */
import React from 'react'
import { Eps as CompEps } from '@_'
import { _ } from '@stores'
import { window, wind } from '@styles'
import { obc } from '@utils/decorators'
import { InferArray } from '@types'
import { Ctx } from '../types'

const LAYOUT_WIDTH = Math.floor(window.width - wind) - 1

function Eps(props, { $, navigation }: Ctx) {
  global.rerender('Subject.Eps')

  const canPlay = $.onlinePlayActionSheetData.length >= 2
  const showPlay = !$.isLimit && canPlay
  return (
    <CompEps
      layoutWidth={LAYOUT_WIDTH}
      marginRight={_.isLandscape ? 0 : _._wind}
      advance
      pagination
      login={$.isLogin}
      subjectId={$.params.subjectId}
      eps={$.toEps}
      userProgress={$.userProgress}
      canPlay={showPlay}
      onSelect={(value, item: InferArray<typeof $.toEps>) =>
        $.doEpsSelect(value, item, navigation)
      }
      // onLongPress={(item: Item) => $.doEpsLongPress(item)}
    />
  )
}

export default obc(Eps)