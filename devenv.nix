{ pkgs, ... }:

{
  packages = with pkgs; [
    nodejs
    sqlite
  ];
}