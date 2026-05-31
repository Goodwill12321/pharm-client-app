#!/usr/bin/env bash
# Remote/local dev helper — sync code to server, restart containers, run tests.
# Usage: ./scripts/dev.sh <command>
# Config: scripts/dev.env (copy from scripts/dev.env.example)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [[ -f "$SCRIPT_DIR/dev.env" ]]; then
  # shellcheck disable=SC1091
  source "$SCRIPT_DIR/dev.env"
fi

DEV_TARGET="${DEV_TARGET:-remote}"
REMOTE_USER="${REMOTE_USER:-root}"
REMOTE_HOST="${REMOTE_HOST:-alterserv.ru}"
REMOTE_PATH="${REMOTE_PATH:-/home/projects/pharm-client-app}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_rsa}"
RSYNC_CHOWN="${RSYNC_CHOWN:-root:root}"
SWARM_STACK="${SWARM_STACK:-pharmopt}"
TUNNEL_DEBUG_PORT="${TUNNEL_DEBUG_PORT:-5005}"
TUNNEL_BACKEND_PORT="${TUNNEL_BACKEND_PORT:-8383}"
TUNNEL_FRONTEND_PORT="${TUNNEL_FRONTEND_PORT:-5173}"

SSH_KEY_EXPANDED="${SSH_KEY/#\~/$HOME}"
REMOTE="${REMOTE_USER}@${REMOTE_HOST}"
SSH_OPTS=(-i "$SSH_KEY_EXPANDED" -o StrictHostKeyChecking=accept-new)

RSYNC_EXCLUDES=(
  --exclude node_modules
  --exclude '*.log'
  --exclude .git
  --exclude .idea
  --exclude .env
  --exclude server/data
  --exclude client/node_modules
  --exclude client/dist
  --exclude .cursor
  --exclude scripts/dev.env
)

ssh_remote() {
  ssh "${SSH_OPTS[@]}" "$REMOTE" "$@"
}

remote_compose() {
  ssh_remote "cd '$REMOTE_PATH' && docker compose $*"
}

local_compose() {
  cd "$PROJECT_ROOT"
  docker compose "$@"
}

compose() {
  if [[ "$DEV_TARGET" == "local" ]]; then
    local_compose "$@"
  else
    remote_compose "$@"
  fi
}

require_remote() {
  if [[ "$DEV_TARGET" == "local" ]]; then
    echo "Command '$1' requires DEV_TARGET=remote in scripts/dev.env" >&2
    exit 1
  fi
}

cmd_sync() {
  require_remote sync
  echo "→ rsync to $REMOTE:$REMOTE_PATH"
  rsync -avz \
    --chown="$RSYNC_CHOWN" \
    --checksum \
    --delete \
    "${RSYNC_EXCLUDES[@]}" \
    -e "ssh -i '$SSH_KEY_EXPANDED'" \
    "$PROJECT_ROOT/" \
    "$REMOTE:$REMOTE_PATH/"
  echo "✓ sync done"
}

cmd_restart_backend() {
  echo "→ restart backend ($DEV_TARGET)"
  compose restart backend
  echo "✓ backend restarted"
}

cmd_restart_frontend() {
  echo "→ restart frontend ($DEV_TARGET)"
  compose restart frontend
  echo "✓ frontend restarted"
}

cmd_swarm_rebuild() {
  require_remote swarm-rebuild
  echo "→ docker compose build + stack deploy ($SWARM_STACK)"
  ssh_remote "cd '$REMOTE_PATH' && docker compose build && docker stack deploy -c docker-compose.yml '$SWARM_STACK'"
  echo "✓ swarm rebuild done"
}

cmd_sync_restart() {
  cmd_sync
  cmd_restart_backend
}

cmd_tunnel() {
  require_remote tunnel
  echo "→ SSH tunnel (Ctrl+C to stop)"
  echo "  localhost:$TUNNEL_DEBUG_PORT → debug"
  echo "  localhost:$TUNNEL_BACKEND_PORT → backend"
  echo "  localhost:$TUNNEL_FRONTEND_PORT → frontend"
  ssh "${SSH_OPTS[@]}" \
    -L "${TUNNEL_DEBUG_PORT}:127.0.0.1:${TUNNEL_DEBUG_PORT}" \
    -L "${TUNNEL_BACKEND_PORT}:127.0.0.1:${TUNNEL_BACKEND_PORT}" \
    -L "${TUNNEL_FRONTEND_PORT}:127.0.0.1:${TUNNEL_FRONTEND_PORT}" \
    -N "$REMOTE"
}

cmd_logs() {
  local service="${1:-backend}"
  compose logs -f "$service"
}

cmd_test() {
  local extra="${*:-}"
  echo "→ mvn test on $DEV_TARGET"
  if [[ "$DEV_TARGET" == "local" ]]; then
    docker exec -w /app pharmopt-pa-backend mvn -q test $extra
  else
    ssh_remote "docker exec -w /app pharmopt-pa-backend mvn -q test $extra"
  fi
}

cmd_lint() {
  echo "→ npm run lint (local)"
  cd "$PROJECT_ROOT/client"
  npm run lint
}

cmd_up() {
  local env="${1:-}"
  if [[ -n "$env" ]]; then
    if [[ "$DEV_TARGET" == "local" ]]; then
      ENV="$env" local_compose up -d
    else
      ssh_remote "cd '$REMOTE_PATH' && ENV='$env' docker compose up -d"
    fi
  else
    compose up -d
  fi
}

cmd_ps() {
  compose ps
}

cmd_help() {
  cat <<EOF
Usage: ./scripts/dev.sh <command>

Config: scripts/dev.env (see scripts/dev.env.example)
DEV_TARGET=remote|local  (default: remote)

Sync & deploy (remote):
  sync              rsync project to remote (excludes node_modules, .git, server/data, …)
  restart-backend   docker compose restart backend
  restart-frontend  docker compose restart frontend
  sync-restart      sync + restart backend (typical after code change)
  swarm-rebuild     docker compose build + docker stack deploy

Remote access:
  tunnel            SSH port-forward for debug ($TUNNEL_DEBUG_PORT) and app ports

Docker ($DEV_TARGET):
  up [ENV]          docker compose up -d  (e.g. up dev-dbfull)
  ps                docker compose ps
  logs [service]    docker compose logs -f (default: backend)

Tests & lint:
  test [mvn args]   mvn test inside backend container on remote/local
  lint              npm run lint in client/ (always local)

Examples:
  ./scripts/dev.sh sync-restart
  ./scripts/dev.sh test -Dtest=ClientControllerTest
  ./scripts/dev.sh up dev-dbfull
  ./scripts/dev.sh tunnel

Current: DEV_TARGET=$DEV_TARGET  REMOTE=$REMOTE  PATH=$REMOTE_PATH
EOF
}

main() {
  local cmd="${1:-help}"
  shift || true

  case "$cmd" in
    sync | rsync-to-remote)       cmd_sync "$@" ;;
    restart-backend | remote-docker-rebuild) cmd_restart_backend "$@" ;;
    restart-frontend)             cmd_restart_frontend "$@" ;;
    sync-restart)                 cmd_sync_restart "$@" ;;
    swarm-rebuild | remote-swarm-rebuild) cmd_swarm_rebuild "$@" ;;
    tunnel)                       cmd_tunnel "$@" ;;
    logs)                         cmd_logs "$@" ;;
    test)                         cmd_test "$@" ;;
    lint)                         cmd_lint "$@" ;;
    up)                           cmd_up "$@" ;;
    ps)                           cmd_ps "$@" ;;
    help | -h | --help)           cmd_help ;;
    *)
      echo "Unknown command: $cmd" >&2
      cmd_help
      exit 1
      ;;
  esac
}

main "$@"
