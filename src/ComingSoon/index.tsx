/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as React from 'react';
import styles from './ComingSoon.css';

export default class StoreInfo extends React.Component {
    render() {
        return (
            <div className={styles.wrapper}>
                <div className={styles.title}>Coming Soon</div>
            </div>
        );
    }
}
