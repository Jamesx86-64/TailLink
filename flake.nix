{
  description = "Nix Flake For NodeJS and PostgreSQL Development Environment For TailLink";

  # Uses the latest stable nixpkgs
  # You can change the URL to point to a specific commit or branch if needed
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-25.05";

  # Boilerplate for a flake
  outputs = { self, nixpkgs, ... }: let system = "x86_64-linux"; in {

    # Creates a nix development shell
    devShells.${system}.default = let pkgs = import nixpkgs { inherit system; }; in pkgs.mkShell {

      # Installs PostgreSQL and Node.js within the shell
      buildInputs = with pkgs; [
        postgresql
        nodejs
      ];

      # Initializes PostgreSQL database and start the server when entering the shell
      # Stops the server when exiting the shell
      shellHook = ''
        export PGDATA=$PWD/.pgdata
        export PGHOST=/tmp/pg-run

        mkdir -p $PGHOST
        chmod 777 $PGHOST

        if [ ! -d "$PGDATA" ]; then
          initdb -D "$PGDATA"
          pg_ctl -D "$PGDATA" -o "-k $PGHOST" start
          createdb TailLinkDB
        else pg_ctl -D "$PGDATA" -o "-k $PGHOST" start
        fi  

        trap 'pg_ctl -D "$PGDATA" stop' EXIT    
      '';
    };
  };
}
