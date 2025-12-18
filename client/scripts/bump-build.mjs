import fs from 'fs';
import path from 'path';

const root = process.cwd();
const buildInfoPath = path.resolve(root, 'build-info.json');

function readJsonSafe(file, fallback) {
  try {
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {}
  return fallback;
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

const info = readJsonSafe(buildInfoPath, {});
const nextBuild = Number.isFinite(info.build) ? (Number(info.build) + 1) : 1;
const buildTime = new Date().toISOString();

const newInfo = {
  build: nextBuild,
  buildTime,
};

writeJson(buildInfoPath, newInfo);

console.log(`[bump] build=${nextBuild} time=${buildTime}`);
