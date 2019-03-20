/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

const { promisify } = require('util');
const glob = require('glob');
const { readFile } = require('fs');
const { join } = require('path');

const globPromise = promisify(glob);
const readFilePromise = promisify(readFile);

(async () => {
    const filePaths = await globPromise('**/*.{js,ts,html,php,xml}', {
        ignore: ['node_modules/**', 'extension/dist/**'],
    });

    const missingHeaders = (await Promise.all(
        filePaths.map(p => readFilePromise(join(process.cwd(), p), 'utf8')),
    ))
        .map((code, i) => {
            if (
                !code.includes('Copyright © Magento, Inc. All rights reserved.')
            ) {
                return filePaths[i];
            }
        })
        .filter(Boolean);

    if (!missingHeaders.length) return;

    console.error('The following files are missing the Magento copyright:');
    console.error(missingHeaders.join('\n'));
    process.exit(1);
})();
