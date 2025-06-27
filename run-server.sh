#!/bin/bash
export PATH="/Users/shuntaro.takahashi/Library/Application Support/fnm:$PATH"
eval "$(fnm env)"
fnm use 20.11.1
pnpm start