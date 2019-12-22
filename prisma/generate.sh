#!/bin/bash
prisma generate
mkdir "../yoga-server/src/generated"
mv -f  ./generated/prisma-client/* ../yoga-server/src/generated/
