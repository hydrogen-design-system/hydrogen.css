#!/usr/bin/env bash

cd tests/test-settings
node env/modify-settings-complete.js
npx h2-build