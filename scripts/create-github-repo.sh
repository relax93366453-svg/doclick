#!/usr/bin/env bash
set -e

REPO_NAME=${1:-bizflow-multi-industry-template}

git init
git add .
git commit -m "Initial BizFlow multi-industry SaaS template"

echo "接下來你可以執行："
echo "gh repo create $REPO_NAME --public --source=. --remote=origin --push"
