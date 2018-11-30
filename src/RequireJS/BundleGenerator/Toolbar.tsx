/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as React from 'react';
import styles from './Toolbar.css';

type Props = {
    onRecord: () => void;
    onClear: () => void;
    isRecording: boolean;
};

export default class Toolbar extends React.Component<Props> {
    render() {
        const { onRecord, onClear, isRecording } = this.props;

        return (
            <div className={styles.wrapper}>
                <button
                    title="Record"
                    data-recording={isRecording}
                    className={styles.recordBtn}
                    onClick={onRecord}
                >
                    ●
                </button>
                <button
                    title="Clear"
                    className={styles.clearBtn}
                    onClick={onClear}
                >
                    ⃠
                </button>
            </div>
        );
    }
}
