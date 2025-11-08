{
  description = "User Manager full-stack application (Laravel + React + Vite)";

  inputs = {
    # Use stable nixpkgs for reproducible development environment
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
  };

  outputs = { self, nixpkgs }:
  let
    system = "x86_64-linux"; # Change to "aarch64-darwin" if using Apple M1/M2
    pkgs = import nixpkgs { inherit system; };
  in {
    devShells.${system}.default = pkgs.mkShell {
      name = "user-manager-dev";

      # Define the packages included in the development shell
      buildInputs = with pkgs; [
        # PHP + extensions
        php
        phpExtensions.pdo
        phpExtensions.pdo_sqlite
        phpExtensions.pdo_mysql
        phpExtensions.mbstring
        phpExtensions.tokenizer
        phpExtensions.xml
        phpExtensions.curl
        phpPackages.composer  # Composer

        # Node.js LTS for frontend development
        nodejs  # uses latest LTS available in nixpkgs

        # Utilities
        git
        sqlite
        
        # Docker + Docker Compose
        docker
        docker-compose
      ];

      # Hook executed when entering the shell
      shellHook = ''
        echo "Development environment for User Manager is ready"
        echo "-----------------------------------------------"
        echo "PHP: $(php -v | head -n 1)"
        echo "Node: $(node -v)"
        echo "Composer: $(composer --version | head -n 1)"
        echo "Docker: $(docker --version)"
        echo "Docker Compose: $(docker-compose --version)"
        echo
        echo "Backend: ./backend (Laravel)"
        echo "Frontend: ./frontend (React + Vite)"
        echo
        echo "Useful commands:"
        echo "  cd backend && php artisan serve"
        echo "  cd frontend && npm run dev"
        echo "  docker-compose up --build  # Start both frontend & backend in Docker"
      '';
    };
  };
}

