/*
 * @Author: czy0729
 * @Date: 2023-04-22 16:24:03
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-22 16:34:26
 */
import { computed } from 'mobx'
import {
  APP_USERID_IOS_AUTH,
  APP_USERID_TOURIST,
  getOTA,
  HOST,
  IOS,
  LIST_EMPTY,
  UA,
  VERSION_GOOGLE
} from '@constants'
import {
  CollectionStatusCn,
  EpId,
  Id,
  ListEmpty,
  StoreConstructor,
  SubjectId,
  SubjectType,
  UserId
} from '@types'
import State from './state'
import { DEFAULT_SCOPE, INIT_USER_INFO, STATE } from './init'
import {
  CollectionsItem,
  CollectionsStatusItem,
  PmItem,
  PmParamsItem,
  UserCollection
} from './types'

export default class Computed extends State implements StoreConstructor<typeof STATE> {
  /** 授权信息 (api) */
  @computed get accessToken() {
    this.init('accessToken')
    return this.state.accessToken
  }

  /** 用户 cookie (html) */
  @computed get userCookie() {
    this.init('userCookie')
    return this.state.userCookie
  }

  /**
   * 是html中后续在请求头中获取的更新cookie的标志
   * 会随请求一直更新, 并带上请求防止一段时候后掉登录
   */
  @computed get setCookie() {
    this.init('setCookie')
    return this.state.setCookie
  }

  /** @deprecated hm.js 请求 cookie , 区分唯一用户, 一旦获取通常不再变更 */
  @computed get hmCookie() {
    this.init('hmCookie')
    return this.state.hmCookie
  }

  /** 自己用户信息 */
  @computed get userInfo() {
    this.init('userInfo')
    return this.state.userInfo
  }

  /** @deprecated 在看收藏 */
  @computed get userCollection(): UserCollection {
    this.init('userCollection')
    return this.state.userCollection
  }

  /** 在看收藏 (新 API, 取代 userCollection) */
  @computed get collection(): UserCollection {
    this.init('collection')
    return this.state.collection
  }

  /** 表单提交唯一码 */
  @computed get formhash() {
    this.init('formhash')
    return this.state.formhash
  }

  /** 短信收信 */
  @computed get pmIn() {
    this.init('pmIn')
    return this.state.pmIn
  }

  /** 短信发信 */
  @computed get pmOut() {
    this.init('pmOut')
    return this.state.pmOut
  }

  /** 个人设置 */
  @computed get userSetting() {
    this.init('userSetting')
    return this.state.userSetting
  }

  /** 登录是否过期 */
  @computed get outdate() {
    return this.state.outdate
  }

  /** 某用户信息 */
  usersInfo(userId?: UserId) {
    this.init('usersInfo')
    return computed<typeof INIT_USER_INFO>(() => {
      const { usersInfo } = this.state
      const key = userId || this.myUserId
      return usersInfo[key] || INIT_USER_INFO
    }).get()
  }

  /** 用户介绍 */
  users(userId?: UserId) {
    return computed<string>(() => {
      const { users } = this.state
      const key = userId || this.myUserId
      return users[key] || ''
    }).get()
  }

  /** 收视进度 (章节) */
  userProgress(subjectId: SubjectId) {
    this.init('userProgress')
    return computed<{
      [K: EpId]: CollectionStatusCn
    }>(() => {
      const { userProgress } = this.state
      return userProgress[subjectId] || {}
    }).get()
  }

  /** 用户收藏概览 (每种状态最多25条数据) */
  userCollections(scope = DEFAULT_SCOPE, userId: UserId) {
    return computed<ListEmpty<CollectionsItem>>(() => {
      const { userCollections } = this.state
      const key = `${scope}|${userId || this.myUserId}`
      return userCollections[key] || LIST_EMPTY
    }).get()
  }

  /** 用户收藏统计 (每种状态条目的数量) */
  userCollectionsStatus(userId: UserId) {
    this.init('userCollectionsStatus')
    return computed<CollectionsStatusItem[]>(() => {
      const { userCollectionsStatus } = this.state
      const key = userId || this.myUserId
      return userCollectionsStatus[key] || []
    }).get()
  }

  /** 短信详情 */
  pmDetail(id: Id) {
    this.init('pmDetail')
    return computed<ListEmpty<PmItem>>(() => {
      const { pmDetail } = this.state
      return pmDetail[id] || LIST_EMPTY
    }).get()
  }

  /** 新短信参数 */
  pmParams(userId: UserId) {
    return computed<PmParamsItem>(() => {
      const { pmParams } = this.state
      return pmParams[userId] || {}
    }).get()
  }

  /** 在线用户最后上报时间集 */
  onlines(userId: UserId) {
    this.init('onlines')
    if (!userId) return 0

    return computed<number>(() => {
      const { onlines } = this.state
      if (onlines[userId]) {
        return Math.floor(Number(onlines[userId]) / 1000)
      }
      return 0
    }).get()
  }

  /** 我的标签 */
  tags(subjectType: SubjectType) {
    this.init('tags')

    return computed<ListEmpty>(() => {
      return this.state.tags[subjectType] || LIST_EMPTY
    }).get()
  }

  // -------------------- computed --------------------
  /** 自己用户 Id (数字) */
  @computed get myUserId() {
    return this.userInfo.id || this.accessToken.user_id
  }

  /** 自己用户 Id (改过后的) */
  @computed get myId() {
    return this.userInfo.username || this.userInfo.id || this.accessToken.user_id
  }

  /** 用户空间地址 */
  @computed get url() {
    return `${HOST}/user/${this.myId}`
  }

  /** 有新短信 */
  @computed get hasNewPM() {
    return this.pmIn.list.findIndex(item => item.new) !== -1
  }

  /** 是否开发者 */
  @computed get isDeveloper() {
    return this.myUserId == 456208
  }

  /** 是否登录 (api) */
  @computed get isLogin() {
    return !!this.accessToken.access_token
  }

  /** 是否登录 (web) */
  @computed get isWebLogin() {
    return !!this.userCookie.cookie
  }

  /** 是否限制内容展示, 用于审核 */
  @computed get isLimit() {
    if (!VERSION_GOOGLE) return false
    if (IOS || !VERSION_GOOGLE) return false

    const { GOOGLE_AUTH } = getOTA()
    if (!GOOGLE_AUTH) return false
    if (!this.isLogin) return true

    const { id } = this.userInfo
    if (!id || id == APP_USERID_TOURIST || id == APP_USERID_IOS_AUTH) return true
    return false
  }

  /** api.v0 需要使用的 headers */
  @computed get requestHeaders() {
    return {
      Authorization: `${this.accessToken.token_type} ${this.accessToken.access_token}`,
      'User-Agent': UA
    }
  }
}