/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as React from 'react';
import styles from './TabBar.css';
import { Tab } from '../types/tabs';

type Props = {
    tabs: Tab[];
    onChange: (selectedTab: Tab) => void;
    selectedTab: Tab;
};

export default class TabBar extends React.Component<Props> {
    render() {
        const { tabs, onChange, selectedTab } = this.props;
        return (
            <div className={styles.wrapper}>
                {tabs.map(tab => (
                    <button
                        key={tab.name}
                        className={styles.tab}
                        onClick={() => onChange(tab)}
                        title={tab.displayName}
                        data-selected={String(tab === selectedTab)}
                    >
                        {tab.displayName}
                    </button>
                ))}
            </div>
        );
    }
}
