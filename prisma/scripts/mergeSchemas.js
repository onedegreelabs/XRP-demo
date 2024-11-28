const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '..', 'models');
const schemaPath = path.join(__dirname, '..', 'schema.prisma');

// Recursive function to get all .prisma files in a directory and its subdirectories
function getAllPrismaFiles(directory) {
  let prismaFiles = [];

  fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      // Recursively add files from subdirectories
      prismaFiles = prismaFiles.concat(getAllPrismaFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.prisma')) {
      // Read and store .prisma file content
      prismaFiles.push(fs.readFileSync(fullPath, 'utf8'));
    }
  });

  return prismaFiles;
}

// Get all .prisma file contents from models directory
const allPrismaFiles = getAllPrismaFiles(modelsDir);

const schemaContent =
  `
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextSearch"]
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

` + allPrismaFiles.join('\n');

// Write the combined schema to schemaPath
fs.writeFileSync(schemaPath, schemaContent);
console.log('Prisma schema file generated successfully');
