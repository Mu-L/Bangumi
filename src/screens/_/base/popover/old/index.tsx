/*
 * @Author: czy0729
 * @Date: 2019-12-14 16:28:46
 * @Last Modified by: czy0729
 * @Last Modified time: 2025-01-08 20:24:35
 */
import React from 'react'
import { ActionSheet, Button, Touchable } from '@components'
import { _ } from '@stores'
import { useBoolean, useObserver } from '@utils/hooks'
import { FROZEN_FN } from '@constants'
import { memoStyles } from './styles'

export default ({ style, data = [], onSelect = FROZEN_FN, children }: any) => {
  const { state, setTrue, setFalse } = useBoolean(false)

  return useObserver(() => {
    const styles = memoStyles()
    return (
      <>
        <Touchable style={style} onPress={setTrue}>
          {children}
        </Touchable>
        <ActionSheet
          height={Math.max(280, Math.min(_.window.height * 0.64, data.length * 100))}
          show={state}
          onClose={setFalse}
        >
          {data.map((item, index) => (
            <Button
              key={item}
              style={!!index && styles.item}
              onPress={() => {
                setFalse()
                onSelect(item)
              }}
            >
              {item}
            </Button>
          ))}
        </ActionSheet>
      </>
    )
  })
}
