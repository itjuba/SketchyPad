defmodule Test.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :name, :string
      add :username, :string

      timestamps()
    end
    
    alter table(:users) do
          add :fuckyou, :string
          
     end
    
  end
end
