#!/usr/bin/env bash

cd tests/test-settings
node env/modify-settings-duplicate-color-keys.js
npx h2-build