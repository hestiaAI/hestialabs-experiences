import type { DatabaseConfig } from '@/types'
import { SQLType } from '@/types/database-config'

const { TEXT } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'TiktokFollowerList',
      columns: [
        ['date', TEXT],
        ['username', TEXT]
      ]
    },
    {
      name: 'TiktokFollowingList',
      columns: [
        ['date', TEXT],
        ['username', TEXT]
      ]
    },
    {
      name: 'LikeList',
      columns: [
        ['date', TEXT],
        ['videolink', TEXT]
      ]
    },
    {
      name: 'LoginHistory',
      columns: [
        ['date', TEXT],
        ['ip', TEXT],
        ['devicemodel', TEXT],
        ['devicesystem', TEXT],
        ['networktype', TEXT],
        ['carrier', TEXT]
      ]
    },
    {
      name: 'SearchHistory',
      columns: [
        ['date', TEXT],
        ['searchterm', TEXT]
      ]
    },
    {
      name: 'ShareHistory',
      columns: [
        ['date', TEXT],
        ['sharedcontent', TEXT],
        ['link', TEXT],
        ['method', TEXT]
      ]
    },
    {
      name: 'StatusList',
      columns: [
        ['resolution', TEXT],
        ['appversion', TEXT],
        ['idfa', TEXT],
        ['gaid', TEXT],
        ['androidid', TEXT],
        ['idfv', TEXT],
        ['webid', TEXT]
      ]
    },
    {
      name: 'VideoBrowsingHistory',
      columns: [
        ['date', TEXT],
        ['videolink', TEXT]
      ]
    },
    {
      name: 'BlockList',
      columns: [
        ['date', TEXT],
        ['username', TEXT]
      ]
    },
    {
      name: 'TiktokComment',
      columns: [
        ['date', TEXT],
        ['comment', TEXT]
      ]
    },
    {
      name: 'ChatHistory',
      columns: [
        ['date', TEXT],
        ['sender', TEXT],
        ['content', TEXT]
      ]
    }
  ],
  getters: [
    {
      fileId: 'userdata',
      path: '$.Activity.Follower List.FansList[*]',
      table: 'TiktokFollowerList',
      getters: [
        {
          column: 'date',
          path: '$.Date'
        },
        {
          column: 'username',
          path: '$.UserName'
        }
      ]
    },
    {
      fileId: 'userdata',
      path: '$.Activity.Following List.Following[*]',
      table: 'TiktokFollowingList',
      getters: [
        {
          column: 'date',
          path: '$.Date'
        },
        {
          column: 'username',
          path: '$.UserName'
        }
      ]
    },
    {
      fileId: 'userdata',
      path: '$.Activity.Like List.ItemFavoriteList[*]',
      table: 'LikeList',
      getters: [
        {
          column: 'date',
          path: '$.Date'
        },
        {
          column: 'videolink',
          path: '$.VideoLink'
        }
      ]
    },
    {
      fileId: 'userdata',
      path: '$.Activity.Login History.LoginHistoryList[*]',
      table: 'LoginHistory',
      getters: [
        {
          column: 'date',
          path: '$.Date'
        },
        {
          column: 'ip',
          path: '$.IP'
        },
        {
          column: 'devicemodel',
          path: '$.DeviceModel'
        },
        {
          column: 'devicesystem',
          path: '$.DeviceSystem'
        },
        {
          column: 'networktype',
          path: '$.NetworkType'
        },
        {
          column: 'carrier',
          path: '$.Carrier'
        }
      ]
    },
    {
      fileId: 'userdata',
      path: '$.Activity.Search History.SearchList[*]',
      table: 'SearchHistory',
      getters: [
        {
          column: 'date',
          path: '$.Date'
        },
        {
          column: 'searchterm',
          path: '$.SearchTerm'
        }
      ]
    },
    {
      fileId: 'userdata',
      path: '$.Activity.Share History.ShareHistoryList[*]',
      table: 'ShareHistory',
      getters: [
        {
          column: 'date',
          path: '$.Date'
        },
        {
          column: 'sharedcontent',
          path: '$.SharedContent'
        },
        {
          column: 'link',
          path: '$.Link'
        },
        {
          column: 'method',
          path: '$.Method'
        }
      ]
    },
    {
      fileId: 'userdata',
      path: '$.Activity.Status.Status List[*]',
      table: 'StatusList',
      getters: [
        {
          column: 'resolution',
          path: '$.Resolution'
        },
        {
          column: 'appversion',
          path: '$[App Version]'
        },
        {
          column: 'idfa',
          path: '$.IDFA'
        },
        {
          column: 'gaid',
          path: '$.GAID'
        },
        {
          column: 'androidid',
          path: '$[Android ID]'
        },
        {
          column: 'idfv',
          path: '$.IDFV'
        },
        {
          column: 'webid',
          path: '$[Web ID]'
        }
      ]
    },
    {
      fileId: 'userdata',
      path: '$.Activity.Video Browsing History.VideoList[*]',
      table: 'VideoBrowsingHistory',
      getters: [
        {
          column: 'date',
          path: '$.Date'
        },
        {
          column: 'videolink',
          path: '$.VideoLink'
        }
      ]
    },
    {
      fileId: 'userdata',
      path: '$.App Settings.Block.BlockList[*]',
      table: 'BlockList',
      getters: [
        {
          column: 'date',
          path: '$.Date'
        },
        {
          column: 'username',
          path: '$.UserName'
        }
      ]
    },
    {
      fileId: 'userdata',
      path: '$.Comment.Comments.CommentsList[*]',
      table: 'TiktokComment',
      getters: [
        {
          column: 'date',
          path: '$.Date'
        },
        {
          column: 'comment',
          path: '$.Comment'
        }
      ]
    },
    {
      fileId: 'userdata',
      path: '$.Direct Messages.Chat History.ChatHistory.*[*]',
      table: 'ChatHistory',
      getters: [
        {
          column: 'date',
          path: '$.Date'
        },
        {
          column: 'sender',
          path: '$.From'
        },
        {
          column: 'content',
          path: '$.Content'
        }
      ]
    }
  ]
}

export default config
