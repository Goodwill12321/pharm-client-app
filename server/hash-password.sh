#!/usr/bin/env bash

# Переходим в директорию server (где лежит pom.xml)
cd "$(dirname "$0")" || exit 1

if [ $# -lt 1 ]; then
  echo "Usage: $0 <password>"
  exit 1
fi

mvn -q \
  -Dexec.mainClass=com.pharma.clientapp.util.PasswordHashTool \
  -Dexec.args="$1" \
  org.codehaus.mojo:exec-maven-plugin:3.2.0:java