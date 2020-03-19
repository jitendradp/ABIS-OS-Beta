#!/bin/bash
prisma generate
rm -r -f "../yoga-server/src/generated"
mkdir "../yoga-server/src/generated"
mv -f  ./generated/prisma_client/* ../yoga-server/src/generated/
