defmodule Test.Accounts.Users do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :name, :string
    field :username, :string

    timestamps()
  end

  @doc false
  def changeset(users, attrs) do
    users
    |> cast(attrs, [:name, :username])
    |> validate_required([:name, :username])
  end
end
