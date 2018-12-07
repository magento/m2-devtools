/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as React from 'react';
import highlightJavaScript from 'highlight-javascript-syntax';
import styles from './JavaScriptHighlighter.css';
import c from '../classjoin';
import copyToClipboard from '../copyToClipboard';

type Props = {
    code: string;
    className?: string;
};

export default class JavaScriptHighlighter extends React.PureComponent<
    Props,
    {}
> {
    getHTML() {
        const markup = highlightJavaScript(this.props.code)
            // Hack to wrap single-line comments in their own span tags
            .replace(/(\/\/.+)/g, '<span class="comment">$1</span>')
            // Hack to differentiate boolean literals
            .replace(
                /<span class="literal">(true|false)<\/span>/g,
                '<span class="literal boolean">$1</span>',
            );
        return {
            __html: markup,
        };
    }

    onCopy = () => {
        copyToClipboard(this.props.code);
    };

    render() {
        const { className } = this.props;
        return (
            <div className={c(className, styles.wrapper)}>
                <button className={styles.copyBtn} onClick={this.onCopy}>
                    Copy to Clipboard
                </button>
                <pre className="js-highlight">
                    <div dangerouslySetInnerHTML={this.getHTML()} />
                </pre>
            </div>
        );
    }
}
