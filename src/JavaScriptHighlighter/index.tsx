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
        return {
            __html: highlightJavaScript(this.props.code),
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
