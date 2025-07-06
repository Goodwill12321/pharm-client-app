#!/bin/bash

# Настройки
REMOTE_USER=root
REMOTE_HOST=51.89.157.175
REMOTE_PATH=/home/projects/pharm-app/pharm-client-app/

# Синхронизация (исключаем лишнее)
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude 'target' \
  --exclude '.git' \
  --exclude '.idea' \
  ./ $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH