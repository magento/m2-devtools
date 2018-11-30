/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as React from 'react';
import styles from './Home.css';

export default class Home extends React.Component {
    render() {
        return (
            <div className={styles.wrapper}>
                <div className={styles.title}>
                    Welcome to the Magento 2 DevTools
                </div>
            </div>
        );
    }
}
