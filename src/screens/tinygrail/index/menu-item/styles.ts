/*
 * @Author: czy0729
 * @Date: 2022-11-07 14:24:31
 * @Last Modified by:   czy0729
 * @Last Modified time: 2022-11-07 14:24:31
 */
import { _ } from '@stores'

export const memoStyles = _.memoStyles(() => {
  const num = _.portrait(2, 4)
  const margin = _.md
  const width = (_.window.width - _.wind * 2 - _.md * (num - 1)) / num
  return {
    container: {
      marginBottom: margin,
      marginLeft: margin,
      borderRadius: _.radiusSm,
      overflow: 'hidden'
    },
    left: {
      marginLeft: 0
    },
    block: {
      width,
      height: width * _.device(0.39, 0.34),
      paddingLeft: 20,
      backgroundColor: _.tSelect(_.colorTinygrailBorder, _.colorTinygrailBg)
    },
    icon: {
      position: 'absolute',
      top: '50%',
      right: -10,
      marginTop: -24,
      color: _.colorTinygrailIcon,
      opacity: 0.24
    }
  }
})