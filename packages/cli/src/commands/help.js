function createPreviewManifestHelp() {
  return {
    usage: 'phantom preview:manifest [--json] [--pretty] [--stdout] [--file=manifest.json]',
    options: [
      '--json',
      '--pretty',
      '--stdout',
      '--file=manifest.json'
    ],
    examples: [
      'phantom preview:manifest --json --pretty',
      'phantom preview:manifest --stdout',
      'phantom preview:manifest --stdout --pretty',
      'phantom preview:manifest --file=docs/preview.manifest.json',
      'phantom preview:manifest --json --pretty --file=docs/preview.manifest.json',
      'phantom preview:manifest --json --pretty --file=docs/preview.manifest.json --stdout',
      'phantom help preview:manifest'
    ]
  };
}

function createPreviewHelp() {
  return {
    usage: 'phantom preview <build|html|serve|open|watch>',
    options: [
      '--json',
      '--pretty',
      '--host=127.0.0.1',
      '--port=4173',
      '--open',
      '--out=preview',
      '--file=preview.json'
    ],
    examples: [
      'phantom preview --json',
      'phantom preview --pretty',
      'phantom preview --json --file=preview.json',
      'phantom preview --json --pretty --file=preview.json',
      'phantom preview serve --host=0.0.0.0 --port=4173',
      'phantom preview serve --open',
      'phantom preview open',
      'phantom preview watch --out=preview',
      'phantom preview watch --open',
      'phantom preview watch --json',
      'phantom preview:manifest --pretty'
    ]
  };
}

export function help(topic = '') {
  if (topic === 'preview') {
    return {
      ok: true,
      topic: 'preview',
      ...createPreviewHelp()
    };
  }

  if (topic === 'preview:manifest') {
    return {
      ok: true,
      topic: 'preview:manifest',
      ...createPreviewManifestHelp()
    };
  }

  return {
    ok: true,
    commands: [
      'phantom init',
      'phantom make:theme',
      'phantom make:tokens',
      'phantom make:palette',
      'phantom make:utility',
      'phantom make:utilities',
      'phantom make:component',
      'phantom make:recipe',
      'phantom make:kit',
      'phantom make:adapter',
      'phantom export:theme',
      'phantom import:theme',
      'phantom theme:list',
      'phantom theme:switch',
      'phantom preview:manifest',
      'phantom preview',
      'phantom preview open',
      'phantom preview serve',
      'phantom preview watch'
    ],
    preview: {
      ...createPreviewHelp()
    },
    manifest: {
      ...createPreviewManifestHelp()
    }
  };
}

export default help;
