defmodule TestWeb.UsersControllerTest do
  use TestWeb.ConnCase

  alias Test.Accounts
  alias Test.Accounts.Users

  @create_attrs %{
    name: "some name",
    username: "some username"
  }
  @update_attrs %{
    name: "some updated name",
    username: "some updated username"
  }
  @invalid_attrs %{name: nil, username: nil}

  def fixture(:users) do
    {:ok, users} = Accounts.create_users(@create_attrs)
    users
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all users", %{conn: conn} do
      conn = get(conn, Routes.users_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create users" do
    test "renders users when data is valid", %{conn: conn} do
      conn = post(conn, Routes.users_path(conn, :create), users: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.users_path(conn, :show, id))

      assert %{
               "id" => id,
               "name" => "some name",
               "username" => "some username"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.users_path(conn, :create), users: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update users" do
    setup [:create_users]

    test "renders users when data is valid", %{conn: conn, users: %Users{id: id} = users} do
      conn = put(conn, Routes.users_path(conn, :update, users), users: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.users_path(conn, :show, id))

      assert %{
               "id" => id,
               "name" => "some updated name",
               "username" => "some updated username"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, users: users} do
      conn = put(conn, Routes.users_path(conn, :update, users), users: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete users" do
    setup [:create_users]

    test "deletes chosen users", %{conn: conn, users: users} do
      conn = delete(conn, Routes.users_path(conn, :delete, users))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.users_path(conn, :show, users))
      end
    end
  end

  defp create_users(_) do
    users = fixture(:users)
    %{users: users}
  end
end
