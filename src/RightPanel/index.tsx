/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as React from 'react';
import styles from './RightPanel.css';

type Props = {
    children: any;
};

export default class RightPanel extends React.Component<Props> {
    render() {
        return <div className={styles.wrapper}>{this.props.children}</div>;
    }
}
