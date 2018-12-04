/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as React from 'react';
import LeftPanel from '../LeftPanel';
import RightPanel from '../RightPanel';
import styles from './App.css';
import Home from '../Home';
import ComingSoon from '../ComingSoon';
import RequireJS from '../RequireJS';
import { Panel } from '../types/panels';

const panels: Panel[] = [
    {
        title: 'Home',
        component: Home,
    },
    {
        title: 'Store Info',
        component: ComingSoon,
    },
    {
        title: 'RequireJS',
        component: RequireJS,
    },
    {
        title: 'uiComponents',
        component: ComingSoon,
    },
];

type State = {
    selectedPanel: Panel;
};

export default class App extends React.Component<{}, State> {
    changePanel = (selectedPanel: State['selectedPanel']) =>
        this.setState({ selectedPanel });

    state = {
        selectedPanel: panels[0],
    };

    render() {
        const { selectedPanel } = this.state;

        return (
            <section className={styles.wrapper}>
                <LeftPanel
                    panels={panels}
                    selectedPanel={selectedPanel}
                    changePanel={this.changePanel}
                />
                <RightPanel>
                    {panels.map(panel => (
                        // Note: All panels are *rendered* here, but only
                        // the selected one is visible in the UI. This allows
                        // each tab to persist its state without having to hoist
                        // state to the root of the tree
                        <div
                            key={panel.title}
                            className={styles.rightPanelItemWrapper}
                            data-selected={panel === selectedPanel}
                        >
                            <panel.component
                                visible={panel === selectedPanel}
                            />
                        </div>
                    ))}
                </RightPanel>
            </section>
        );
    }
}
