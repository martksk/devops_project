#!/bin/bash

# Exit immediately if any command fails
set -e

# Define color codes for pretty output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Starting Unified Test Pipeline ===${NC}\n"

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo -e "${GREEN}Running Tests...${NC}"
npm run test

echo -e "\n${GREEN}=== Pipeline Succeeded! All tests passed! ===${NC}"
