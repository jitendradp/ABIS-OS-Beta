#!/bin/bash
prisma generate
rm -r -f "../yoga-server/src/generated"
mkdir "../yoga-server/src/generated"
mv -f  ./generated/prisma-client/* ../yoga-server/src/generated/
