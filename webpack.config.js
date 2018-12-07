/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

const { join } = require('path');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: join(__dirname, 'src/index.tsx'),
    output: {
        path: join(__dirname, 'extension/dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|tsx?)$/,
                loader: 'babel-loader',
                include: join(__dirname, 'src'),
            },
            {
                include: join(__dirname, 'src'),
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]-[local]',
                        },
                    },
                ],
            },
            {
                test: /\.md$/,
                include: join(__dirname, 'docs'),
                use: ['html-loader', 'markdown-loader'],
            },
        ],
    },
};
