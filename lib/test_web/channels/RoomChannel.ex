defmodule TestWeb.RoomChannel do
  use Phoenix.Channel

  def join("room:lobby", _message, socket) do
    {:ok, socket}
  end
  def join("room:" <> _private_room_id, _params, _socket) do
    IO.inspect _private_room_id
    IO.puts "hello"
    {:ok, _socket}

  end

  def handle_in( "new_msg:"<>_private_room_id , %{"body" => body}, socket) do
    IO.inspect body
    broadcast!(socket, "new_msg:"<>_private_room_id , %{body: body})
    {:noreply, socket}
  end

  def handle_in( "chat:new_msg:"<>_private_room_id , %{"body" => body}, socket) do
    IO.inspect body
    broadcast!(socket, "chat:new_msg:"<>_private_room_id , %{body: body})
    {:noreply, socket}
  end


end