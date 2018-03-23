#!/bin/bash

pushd node_modules/realm
./scripts/download-core.sh node
sed -i -- "s/\.\.\/\.\.\/node_modules\/nan/\<\!\(node \-e \'require\(\\\\\"nan\\\\\"\)\'\)/g" src/node/binding.gyp
./src/node/build-node.sh
popd