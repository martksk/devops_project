#!/bin/bash

# Exit immediately if any command fails
set -e

# Define color codes for pretty output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Starting Local Test Pipeline ===${NC}\n"

# 1. Test Backend
echo -e "${GREEN}[1/2] Running Backend Tests...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
  echo "Installing backend dependencies..."
  npm install
fi
npm run test
cd ..

echo -e "\n${GREEN}[1/2] Backend Tests Passed!${NC}\n"

# 2. Test Frontend
echo -e "${GREEN}[2/2] Running Frontend Tests...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi
npm run test
cd ..

echo -e "\n${GREEN}[2/2] Frontend Tests Passed!${NC}\n"
echo -e "${GREEN}=== Pipeline Succeeded! All tests passed! ===${NC}"
