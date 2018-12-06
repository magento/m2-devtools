/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as React from 'react';
import { RequireConfig, PageModule } from '../../types/require';
import generate from './generate';
import JavaScriptHighlighter from '../../JavaScriptHighlighter';
import styles from './ConfigGen.css';

type Props = {
    pageModules: PageModule[];
    requireConfig: RequireConfig;
};

export default class ConfigGen extends React.PureComponent<Props> {
    generateJS() {
        const { pageModules, requireConfig } = this.props;
        const config = generate(pageModules, requireConfig);
        const code = JSON.stringify(config, null, 4);
        return transforms.reduce((code: string, transform) => {
            return transform(code);
        }, code);
    }

    render() {
        const code = this.generateJS();
        return (
            <JavaScriptHighlighter code={code} className={styles.codeView} />
        );
    }
}

const transforms = [
    parenWrap,
    addConfigReference,
    sharedBundleComment,
    uglifyComment,
];

function parenWrap(code: string) {
    return `(${code})`;
}

function addConfigReference(code: string) {
    return `// Full config reference:
// https://github.com/requirejs/r.js/blob/b8a6982/build/example.build.js

${code}`;
}

function sharedBundleComment(code: string) {
    const byLine = code.split('\n');
    const sharedBundleIndex = byLine.findIndex(c =>
        c.includes('"name": "bundles/shared",'),
    );
    const [whitespace] = byLine[sharedBundleIndex].match(/(\s+)/) || [''];
    byLine.splice(
        sharedBundleIndex,
        0,
        `${whitespace}// Modules used on > 1 page(s) of the store`,
    );
    return byLine.join('\n');
}

function uglifyComment(code: string) {
    const byLine = code.split('\n');
    const uglifyIndex = byLine.findIndex(c =>
        c.includes('"optimize": "uglify2",'),
    );
    const [whitespace] = byLine[uglifyIndex].match(/(\s+)/) || [''];
    byLine.splice(
        uglifyIndex,
        0,
        `${whitespace}// Disable to speed up bundling while debugging`,
    );
    return byLine.join('\n');
}
