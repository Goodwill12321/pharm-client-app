#!/bin/bash

# Настройки
REMOTE_USER=root
REMOTE_HOST=alterserv.ru
REMOTE_PATH=/home/projects/pharm-client-app/

# Синхронизация (исключаем лишнее)
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude 'target' \
  --exclude '.git' \
  --exclude '.idea' \
  --exclude '.env'
  ./ $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH