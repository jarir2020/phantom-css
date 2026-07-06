import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createPhantomTheme } from '@phantom-css/core';
import { listPresets } from '@phantom-css/presets';
import { listFrameworkAdapters } from '@phantom-css/adapters';
import { createPreviewApp } from '@phantom-css/web';
import { fileURLToPath } from 'node:url';
import { frameworkNames, getPreset, listPresets as listMetaPresets } from './src/index.js';

assert.equal(listMetaPresets().length, 30);
assert.deepEqual(frameworkNames, listFrameworkAdapters());
assert.equal(getPreset('light').name, 'light');

const theme = createPhantomTheme();
assert.ok(theme.cssVariables);
assert.equal(listPresets().length, 30);
assert.ok(createPreviewApp().html.includes('Theme Gallery'));

const binPath = fileURLToPath(new URL('./bin/phantom.js', import.meta.url));
const helpOutput = execFileSync(process.execPath, [binPath, 'help'], { encoding: 'utf8' });
assert.ok(helpOutput.includes('phantom theme:switch'));

console.log('✅ Phantom CSS meta package tests passed!');
