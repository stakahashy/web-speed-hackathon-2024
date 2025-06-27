#!/bin/bash
export PATH="/Users/shuntaro.takahashi/Library/Application Support/fnm:$PATH"
eval "$(fnm env)"
fnm use 20.11.1

echo "Rebuilding native modules..."
pnpm rebuild

echo "Building server, app, and admin panel..."
pnpm run build

echo "Starting server..."
pnpm run start