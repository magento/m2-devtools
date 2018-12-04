/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFiles: [
        // v8 with built-in flat (v6.9.x) won't be in node until v11.
        // Do not remove this polyfill until node 12 is LTS
        require.resolve('array.prototype.flat/auto'),
    ],
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
};
