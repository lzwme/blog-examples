import glob from 'fast-glob';
import { promises } from 'fs';
import yargs from 'yargs-parser';
import { getLogger } from '@lzwme/fe-utils';

const logger = getLogger();

export async function fileContentReplace({
  rootDir = process.cwd(),
  globRules = ['*/*'],
  replaces = [] as Array<[string | RegExp, string]> | ((content: string, filepath: string) => string | undefined),
}) {
  const files = await glob(globRules, { cwd: rootDir, absolute: true });
  const result = {
    files,
    modified: [] as string[],
  };

  if (!replaces?.length) return result;

  for (const filepath of files) {
    const content = await promises.readFile(filepath, 'utf8');
    let newcontent = content as string | undefined;

    if (typeof replaces === 'function') {
      newcontent = replaces(content, filepath);
    } else {
      for (let [from, to] of replaces) {
        if (typeof from === 'string') from = new RegExp(from);
        newcontent = content.replaceAll(from, to);
      }
    }

    if (typeof newcontent === 'string' && content !== newcontent) {
      logger.log('Modified:', filepath);
      promises.writeFile(filepath, newcontent, 'utf8');
    }
  }

  return result;
}

if (import.meta.url.endsWith('file-replace.ts') || import.meta.url.endsWith('file-replace.js')) {
  const argv = yargs(process.argv.slice(2));
  logger.log(argv);
  fileContentReplace({
    rootDir: argv.r || argv.root || process.cwd(),
    globRules: Array.isArray(argv.rule) ? argv.rule : typeof argv.rule === 'string' ? [argv.rule] : ['*/*'],
    replaces: argv.from && argv.to ? [[argv.from, argv.to]] : [],
  });
}

// for test
fileContentReplace({
  rootDir: 'D:\\coding\\lzwme\\lzw.me\\root\\x\\games',
  globRules: ['**/*.html*'],
  replaces: (content, filepath) => {
    if (!content.includes('h5-common.js')) {
      logger.log('Find File:', filepath);
      if (content.includes('</body>')) {
        return content.replace(`</body>`, `</body><script src="https://lzw.me/x/lib/utils/h5-common.js"></script>`);
      } else {
        logger.log('Warning: 未发现 </body> 字符串', filepath);
      }
    }
  },
}).then(d => {
  logger.log(d);
  logger.log('Total:', d.files.length, 'Modified:', d.modified.length);
});
