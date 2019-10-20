#!/bin/sh

GOOS=js GOARCH=wasm go build -ldflags="-s -w" -o main.wasm main.go
