import "phoenix_html"

// import socket from "./socket"
import {Socket, Presence} from "phoenix"

// Socket
let user = document.getElementById("User").innerText
let socket = new Socket("/socket", {params: {user: user}})
socket.connect()

// Presence
let presences = {}

// サーバーが生成したタイムスタンプを人間が読める形式に変換している
let formatTimestamp = (timestamp) => {
  let date = new Date(timestamp)
  return date.toLocaleTimeString()
}
// ユーザー名とルームに入室した時間を返す
let listBy = (user, {metas: metas}) => {
  return {
    user: user,
    onlineAt: formatTimestamp(metas[0].online_at)
  }
}

let userList = document.getElementById("user_list")
// 全てのオンラインユーザーを表示する
// ユーザーが入退室する度に呼ばれる
let render = (presences) => {
  userList.innerHTML = Presence.list(presences, listBy)
    .map(presence => `
      <li>
        <b>${presence.user}</b>
        <br><small>${presence.onlineAt}からオンライン</small>
      </li>
    `)
    .join("")
}

// Channels
let room = socket.channel("room:lobby", {})
room.on("presence_state", state => {
  presences = Presence.syncState(presences, state)
  render(presences)
})

room.on("presence_diff", diff => {
  presences = Presence.syncDiff(presences, diff)
  render(presences)
})

room.join()

// Chat
// e.keyCode == 13 はEnterKey
// ユーザーの入力があり、EnterKeyが押下された際に送信する
let msgInput = document.getElementById("new_msg")
msgInput.addEventListener("keypress", (e) => {
  if (e.keyCode == 13 && msgInput.value != "") {
    room.push("message:new", msgInput.value)
    msgInput.value = ""
  }
})

let msgList = document.getElementById("msg_list")
let renderMsg = (message) => {
  let msgElement = document.createElement("li")
  msgElement.innerHTML = `
    <b>${message.user}</b>
    <i>${formatTimestamp(message.timestamp)}</i>
    <p>${message.body}</p>
  `
  msgList.appendChild(msgElement)
  msgList.scrollTop = msgList.scrollHeight;
}

room.on("message:new", message => renderMsg(message))