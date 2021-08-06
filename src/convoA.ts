import { opening } from '@/services/messages'
import { users } from '@/UserState'
import type { IGSender } from '@/lib'

// 連續對話, 測試A
async function convoA(event: MsgerPostbackEvent, sender: IGSender) {
  const sid = event.sender.id
  const payload = event.postback.payload

  // 建立新對話
  if (payload === 'convo_a') {
    users.push({ id: sid, step: 'step_a', data: {} })

    sender.sendTemplate(sid, [
      {
        title: '請選擇種族',
        buttons: [
          {
            type: 'postback',
            title: '人類',
            payload: 'step_a',
          },
          {
            type: 'postback',
            title: '精靈',
            payload: 'step_a',
          },
          {
            type: 'postback',
            title: '半獸人',
            payload: 'step_a',
          },
        ],
      },
    ])
  }

  // 檢查 user 是否在連續對話中
  const user = users.find((user) => user.id === sid)
  if (!user) {
    await sender.sendText(sid, '對話已結束, 請重新選擇')
    return sender.sendTemplate(sid, opening)
  }

  // 對話階段
  if (payload === 'step_a') {
    if (user.step !== payload) {
      return sender.sendText(sid, '錯誤輸入，請重新選擇')
    }

    // 更新狀態
    user.step = 'step_b'
    user.data.race = event.postback.title

    sender.sendTemplate(sid, [
      {
        title: '請選擇職業',
        buttons: [
          {
            type: 'postback',
            title: '戰士',
            payload: 'step_b',
          },
          {
            type: 'postback',
            title: '法師',
            payload: 'step_b',
          },
          {
            type: 'postback',
            title: '牧師',
            payload: 'step_b',
          },
        ],
      },
    ])
  } else if (payload === 'step_b') {
    if (user.step !== payload) {
      return sender.sendText(sid, '錯誤輸入，請重新選擇')
    }

    // 更新狀態
    user.step = 'step_c'
    user.data.job = event.postback.title

    sender.sendTemplate(sid, [
      {
        title: '請選擇性別',
        buttons: [
          {
            type: 'postback',
            title: '男',
            payload: 'step_c',
          },
          {
            type: 'postback',
            title: '女',
            payload: 'step_c',
          },
        ],
      },
    ])
  } else if (payload === 'step_c') {
    if (user.step !== payload) {
      return sender.sendText(sid, '錯誤輸入，請重新選擇')
    }

    // 更新狀態
    user.step = ''
    user.data.gender = event.postback.title

    const msgs = [
      '您選擇了:',
      `種族: ${user.data.race}`,
      `職業: ${user.data.job}`,
      `性別: ${user.data.gender}`,
    ]
    sender.sendText(sid, msgs.join('\n'))

    // 對話結束, 移除紀錄
    const targetIdx = users.findIndex(item => item.id === user.id)
    users.splice(targetIdx, 1)
    console.log('remove user')
  }
}

export { convoA }
