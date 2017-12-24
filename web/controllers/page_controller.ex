defmodule Phoenixchat.PageController do
  use Phoenixchat.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
