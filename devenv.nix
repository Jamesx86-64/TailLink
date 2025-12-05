{ pkgs, ... }:

{
  packages = [
    pkgs.nodejs
    pkgs.sqlite
  ];

  env = {
    DATABASE_URL = "file:./app.db";
  };

  scripts = {
    init-db.exec = ''
      if [ ! -f app.db ]; then
        sqlite3 app.db "VACUUM;"
      fi
    '';
  };
}

