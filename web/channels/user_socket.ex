defmodule Phoenixchat.UserSocket do
  use Phoenix.Socket

  ## Channels
  channel "room:*", Phoenixchat.RoomChannel

  ## Transports
  transport :websocket, Phoenix.Transports.WebSocket

  # 追加
  def connect(%{"user" => user}, socket) do
    {:ok, assign(socket, :user, user)}
  end

  def id(_socket), do: nil
end
