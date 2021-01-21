/*
 * @Author: czy0729
 * @Date: 2019-03-14 15:20:53
 * @Last Modified by: czy0729
 * @Last Modified time: 2021-01-21 13:58:40
 */
import React from 'react'
import { View } from 'react-native'
import { Progress } from '@ant-design/react-native'
import { Flex, Iconfont, Text, Touchable, Heatmap } from '@components'
import { Eps, Popover } from '@screens/_'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import { HTMLDecode } from '@utils/html'
import { t } from '@utils/fetch'
import { IOS, IMG_WIDTH } from '@constants'
import { MODEL_SUBJECT_TYPE } from '@constants/model'
import Cover from './cover'
import OnAir from './onair'

const LIMIT_HEAVY_RENDER = 10
const itemPadding = _._wind
const layoutWidth = _.window.contentWidth - _.wind
const wrapWidth = layoutWidth - IMG_WIDTH - _.wind - itemPadding + 2

export default
@obc
class Item extends React.Component {
  static defaultProps = {
    index: '',
    subjectId: 0,
    subject: {},
    epStatus: ''
  }

  onPress = () => {
    t('首页.跳转', {
      to: 'Subject',
      from: 'list'
    })

    const { navigation } = this.context
    const { subjectId, subject } = this.props
    navigation.push('Subject', {
      subjectId,
      _jp: subject.name,
      _cn: subject.name_cn || subject.name,
      _image: subject?.images?.medium || ''
    })
  }

  onEpsSelect = (value, item) => {
    const { $, navigation } = this.context
    const { subjectId } = this.props
    $.doEpsSelect(value, item, subjectId, navigation)
  }

  onEpsLongPress = item => {
    const { $ } = this.context
    const { subjectId } = this.props
    $.doEpsLongPress(item, subjectId)
  }

  onCheckPress = () => {
    const { $ } = this.context
    const { subjectId } = this.props
    $.doWatchedNextEp(subjectId)
  }

  onStarPress = modal => {
    const { $ } = this.context
    const { subjectId } = this.props
    $.showManageModal(subjectId, modal)
  }

  onGridPress = () => {
    const { $ } = this.context
    const { subjectId } = this.props
    $.itemToggleExpand(subjectId)
  }

  get isTop() {
    const { $ } = this.context
    const { subjectId } = this.props
    const { top } = $.state
    return top.indexOf(subjectId) !== -1
  }

  get label() {
    const { subject } = this.props
    return MODEL_SUBJECT_TYPE.getTitle(subject.type)
  }

  get isSecond() {
    const { index } = this.props
    return index === 1
  }

  get isLazyRendered() {
    const { $ } = this.context
    const { _mounted } = $.state
    const { index } = this.props
    return index >= LIMIT_HEAVY_RENDER && !_mounted
  }

  renderBtnOrigin() {
    const { $ } = this.context
    if (!$.homeOrigin) {
      return null
    }

    const { subjectId, subject } = this.props
    const { type } = subject
    if (type !== 2 && type !== 6) {
      return null
    }

    return (
      <Popover
        style={this.styles.touchable}
        data={$.onlineOrigins(subjectId)}
        onSelect={label => $.onlinePlaySelected(label, subjectId)}
      >
        <Iconfont style={this.styles.icon} name='xin-fan' size={18} />
        <Heatmap right={55} bottom={-7} id='首页.搜索源' />
      </Popover>
    )
  }

  renderBtnNextEp() {
    const { $ } = this.context
    const { subjectId } = this.props
    const { sort } = $.nextWatchEp(subjectId)
    if (!sort) {
      return null
    }

    return (
      <Touchable
        style={$.homeOrigin ? this.styles.touchableNext : this.styles.touchable}
        onPress={this.onCheckPress}
      >
        <Flex justify='center'>
          <Iconfont style={this.styles.icon} name='check' size={18} />
          <View style={[this.styles.placeholder, _.ml.sm]}>
            <Text type='sub'>{sort}</Text>
          </View>
        </Flex>
        {this.isSecond && <Heatmap right={26} id='首页.观看下一章节' />}
      </Touchable>
    )
  }

  renderToolBar() {
    const { subject } = this.props
    return (
      <Flex style={this.styles.toolBar}>
        {this.renderBtnOrigin()}
        {this.renderBtnNextEp()}
        <Touchable
          style={[this.styles.touchable, _.ml.sm]}
          onPress={() =>
            this.onStarPress({
              title: subject.name_cn || subject.name,
              desc: subject.name
            })
          }
        >
          <Iconfont name='star' size={18} />
          {this.isSecond && <Heatmap id='首页.显示收藏管理' />}
        </Touchable>
      </Flex>
    )
  }

  renderCount() {
    const { $ } = this.context
    const { subjectId, subject, epStatus } = this.props
    if (this.label === '游戏') {
      return null
    }

    if (this.label === '书籍') {
      const { list = [] } = $.userCollection
      const { ep_status: epStatus, vol_status: volStatus } = list.find(
        item => item.subject_id === subjectId
      )
      return (
        <Flex>
          <Text type='primary' size={20}>
            <Text type='primary' size={12} lineHeight={20}>
              Chap.{' '}
            </Text>
            {epStatus}
          </Text>
          {this.renderBookNextBtn(epStatus + 1, volStatus)}
          <Text style={_.ml.sm} type='primary' size={20}>
            <Text type='primary' size={12} lineHeight={20}>
              Vol.{' '}
            </Text>
            {volStatus}
          </Text>
          {this.renderBookNextBtn(epStatus, volStatus + 1)}
          {this.isSecond && <Heatmap right={40} id='首页.更新书籍下一个章节' />}
        </Flex>
      )
    }

    const { expand } = $.$Item(subjectId)
    const isBook = MODEL_SUBJECT_TYPE.getTitle(subject.type) === '书籍'
    let _epStatus = epStatus
    if (!_epStatus) {
      const userProgress = $.userProgress(subjectId)
      _epStatus = Object.keys(userProgress).length ? 1 : 0
    }
    return (
      <Flex>
        <Text type='primary' size={20}>
          {epStatus || _epStatus}
          <Text type='sub' size={13} lineHeight={20}>
            {' '}
            / {subject.eps_count || '?'}{' '}
          </Text>
          {!isBook && (
            <Iconfont
              name={expand ? 'down' : 'up'}
              size={13}
              lineHeight={(20 + _.fontSizeAdjust) * _.lineHeightRatio}
              color={_.colorIcon}
            />
          )}
        </Text>
      </Flex>
    )
  }

  renderBookNextBtn(epStatus, volStatus) {
    const { $ } = this.context
    const { subjectId } = this.props
    return (
      <Touchable
        style={this.styles.touchable}
        onPress={() => $.doUpdateNext(subjectId, epStatus, volStatus)}
      >
        <Flex justify='center'>
          <Iconfont style={this.styles.icon} name='check' size={18} />
        </Flex>
      </Touchable>
    )
  }

  render() {
    if (this.isLazyRendered) {
      return <View style={this.styles.lazy} />
    }

    const { $ } = this.context
    const { index, subjectId, subject, epStatus } = this.props
    const { expand } = $.$Item(subjectId)
    const percent = subject.eps_count
      ? (parseInt(epStatus || 0) / parseInt(subject.eps_count)) * 100
      : 0
    const type = MODEL_SUBJECT_TYPE.getTitle(subject.type)
    const isBook = type === '书籍'
    const doing = isBook ? '读' : '看'
    return (
      <View
        style={[
          this.styles.item,
          $.heatMap && expand && this.styles.itemWithHeatMap
        ]}
      >
        <Flex style={this.styles.hd}>
          <Cover index={index} subjectId={subjectId} subject={subject} />
          <Flex.Item style={this.styles.content}>
            <Touchable
              style={this.styles.title}
              withoutFeedback
              onPress={this.onPress}
            >
              <Flex align='start'>
                <Flex.Item>
                  <Text numberOfLines={2} bold>
                    {HTMLDecode(subject.name_cn || subject.name)}
                  </Text>
                  {!!subject?.collection?.doing && (
                    <Text style={_.mt.xs} type='sub' size={12}>
                      {subject.collection.doing} 人在{doing}
                    </Text>
                  )}
                </Flex.Item>
                <OnAir />
              </Flex>
            </Touchable>
            <View>
              <Flex style={this.styles.info}>
                <Flex.Item>
                  {isBook ? (
                    <View style={this.styles.touchablePlaceholder}>
                      {this.renderCount()}
                    </View>
                  ) : (
                    <Touchable
                      style={this.styles.touchablePlaceholder}
                      onPress={this.onGridPress}
                    >
                      {this.renderCount()}
                      {this.isSecond && (
                        <Heatmap
                          right={44}
                          bottom={5}
                          id='首页.展开或收起条目'
                        />
                      )}
                    </Touchable>
                  )}
                </Flex.Item>
                {this.renderToolBar()}
              </Flex>
              <Progress
                style={this.styles.progress}
                barStyle={this.styles.bar}
                wrapWidth={wrapWidth}
                percent={percent}
              />
            </View>
          </Flex.Item>
          {this.isSecond && (
            <View>
              <Heatmap id='首页.置顶或取消置顶' />
            </View>
          )}
        </Flex>
        {expand && (
          <View style={this.styles.eps}>
            <Eps
              layoutWidth={layoutWidth}
              marginRight={itemPadding}
              login={$.isLogin}
              subjectId={subjectId}
              eps={$.eps(subjectId)}
              userProgress={$.userProgress(subjectId)}
              onSelect={this.onEpsSelect}
              onLongPress={this.onEpsLongPress}
            />
            {this.isSecond && (
              <>
                <Heatmap
                  right={72}
                  id='首页.跳转'
                  data={{
                    to: 'Topic',
                    alias: '章节讨论'
                  }}
                  transparent
                />
                <Heatmap bottom={35} id='首页.章节按钮长按' transparent />
                <Heatmap id='首页.章节菜单操作' />
              </>
            )}
          </View>
        )}
        {this.isTop && <View style={this.styles.dot} />}
      </View>
    )
  }

  get styles() {
    return memoStyles()
  }
}

const memoStyles = _.memoStyles(_ => ({
  lazy: {
    height: 150,
    backgroundColor: IOS ? _.colorPlain : 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: _.colorBg
  },
  item: {
    paddingVertical: itemPadding,
    paddingLeft: itemPadding,
    backgroundColor: IOS ? _.colorPlain : 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: _.colorBg
  },
  itemWithHeatMap: {
    paddingBottom: itemPadding + 4
  },
  itemBorder: {
    borderBottomWidth: _.hairlineWidth,
    borderColor: _.colorBorder
  },
  hd: {
    paddingRight: itemPadding
  },
  content: {
    marginLeft: itemPadding
  },
  title: {
    minHeight: 60
  },
  info: {
    height: 40
  },
  toolBar: {
    marginRight: -itemPadding / 2 - 3
  },
  touchablePlaceholder: {
    width: '100%',
    minHeight: 24
  },
  icon: {
    marginBottom: -1
  },
  progress: {
    backgroundColor: _.select(_.colorBg, _._colorDarkModeLevel1),
    borderRadius: 4
  },
  bar: {
    backgroundColor: 'transparent',
    borderBottomColor: _.colorPrimary,
    borderBottomWidth: 4,
    borderRadius: 4
  },
  eps: {
    marginTop: itemPadding
  },
  dot: {
    position: 'absolute',
    top: 6,
    right: 6,
    borderWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: _.colorBorder,
    transform: [
      {
        rotate: '-45deg'
      }
    ]
  },
  touchable: {
    paddingLeft: _.sm,
    paddingRight: _.sm + 2
  },
  touchableNext: {
    paddingLeft: _.sm,
    paddingRight: 2
  },
  placeholder: {
    marginBottom: -1.5
  }
}))