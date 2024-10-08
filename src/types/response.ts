/*
 * 仅保留可能需要到的字段的类型
 * @Author: czy0729
 * @Date: 2024-09-09 16:28:07
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-09-20 01:43:04
 */

/** https://api.github.com/repos/czy0729/Bangumi/releases/latest */
export type ResponseGHReleases = {
  url: string
  target_commitish: 'master'

  /** 8.13.1 */
  name: string
  draft: boolean
  prerelease: boolean
  created_at: string

  /** 2024-09-02T11:48:57Z */
  published_at: string
  assets: {
    /** https://github.com/czy0729/Bangumi/releases/download/8.13.1/bangumi_v8.13.1_arm64-v8a.apk */
    browser_download_url: string
  }[]
  body: string
}

export type ResponseKVAdvance = Record<string, string>

/** `${API_HOST}/v0/episodes?subject_id=${subjectId}&type=0&limit=100&offset=1000` */
export type ResponseV0Episodes = {
  data: {
    airdate: any
    comment: any
    duration: any
    id: any
    name: any
    name_cn: any
    sort: any
    type: any
  }[]
}
