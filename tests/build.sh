#!/usr/bin/env bash

cd tests/test-properties
node ../log-test-setup.js --test="Property test"
npm install
npm link @hydrogen-css/hydrogen
cd ../test-parsing
node ../log-test-setup.js --test="Parser test"
npm install
npm link @hydrogen-css/hydrogen
cd ../test-initialization
node ../log-test-setup.js --test="Initialization test"
npm install
npm link @hydrogen-css/hydrogen