/*
 * @Author: czy0729
 * @Date: 2024-11-22 07:43:51
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-11-23 13:28:48
 */
import React, { useEffect } from 'react'
import { r } from '@utils/dev'
import { useNavigation, useObserver } from '@utils/hooks'
import { Track } from '../track'
import Header from './header'
import HeaderV2Popover from './popover'
import { COMPONENT } from './ds'
import { Props as HeaderV2Props } from './types'

export { HeaderV2Props, HeaderV2Popover }

export const HeaderV2 = ({ title, domTitle, hm, alias, headerRight }: HeaderV2Props) => {
  r(COMPONENT)

  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTransparent: false,
      headerShadowVisible: false,
      headerRight
    })
  }, [navigation, headerRight])

  return useObserver(() => (
    <>
      <Header title={title} headerRight={headerRight} />
      <Track title={title} domTitle={domTitle} hm={hm} alias={alias} />
    </>
  ))
}

export default HeaderV2