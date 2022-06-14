/*
 * @Author: czy0729
 * @Date: 2021-01-21 14:11:56
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-06-12 15:14:27
 */
import React from 'react'
import { View } from 'react-native'
import { Heatmap } from '@components'
import { Eps as CompEps } from '@_'
import { _ } from '@stores'
import { window } from '@styles'
import { obc } from '@utils/decorators'

function Eps({ index, subjectId }, { $, navigation }) {
  return (
    <View style={styles.eps}>
      <CompEps
        layoutWidth={window.contentWidth}
        login={$.isLogin}
        subjectId={subjectId}
        eps={$.eps(subjectId)}
        userProgress={$.userProgress(subjectId)}
        onSelect={(value, item) => $.doEpsSelect(value, item, subjectId, navigation)}
        onLongPress={item => $.doEpsLongPress(item, subjectId)}
      />
      {index === 1 && (
        <>
          <Heatmap right={72} id='首页.跳转' to='Topic' alias='章节讨论' transparent />
          <Heatmap bottom={35} id='首页.章节按钮长按' transparent />
          <Heatmap id='首页.章节菜单操作' />
        </>
      )}
    </View>
  )
}

export default obc(Eps)

const styles = _.create({
  eps: {
    marginTop: _._wind
  }
})