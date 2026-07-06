import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

export function ensureDir(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
}

export function writeTextFile(filePath, content) {
  ensureDir(filePath);
  writeFileSync(filePath, content);
  return filePath;
}

export function writeJsonFile(filePath, data) {
  return writeTextFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

export function ensureEmptyDir(dirPath) {
  mkdirSync(dirPath, { recursive: true });
  return dirPath;
}

export function resolvePath(root, relativePath) {
  return join(root, relativePath);
}

export function fileExists(filePath) {
  return existsSync(filePath);
}
