/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as React from 'react';
import TabBar from '../TabBar';
import Inspector from './Inspector';
import BundleGenerator from './BundleGenerator';
import { Tab } from '../types/tabs';
import styles from './RequireJS.css';

const tabs: Tab[] = [
    {
        name: 'bundleGen',
        displayName: 'Bundle Generator',
        component: BundleGenerator,
    },
    {
        name: 'inspect',
        displayName: 'Module Inspector',
        component: Inspector,
    },
];

type State = {
    selectedTab: Tab;
};

export default class RequireJS extends React.Component<{}, State> {
    state = {
        selectedTab: tabs[0],
    };

    onChange = (selectedTab: Tab) => this.setState({ selectedTab });

    render() {
        const { selectedTab } = this.state;

        return (
            <>
                <TabBar
                    tabs={tabs}
                    selectedTab={selectedTab}
                    onChange={this.onChange}
                />
                {tabs.map(tab => (
                    <div
                        key={tab.name}
                        className={styles.tabWrapper}
                        data-selected={tab === selectedTab}
                    >
                        <tab.component />
                    </div>
                ))}
            </>
        );
    }
}
