#!/bin/sh

pnpm exec prisma migrate deploy
node build
