/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as React from 'react';
import styles from './LeftPanel.css';
import c from '../classjoin';
import { Panel } from '../types/panels';

type Props = {
    panels: Panel[];
    selectedPanel: Panel;
    changePanel: (panel: Panel) => void;
};

export default class LeftPanel extends React.Component<Props> {
    render() {
        const { panels, selectedPanel, changePanel } = this.props;

        return (
            <div className={styles.wrapper}>
                <header>
                    <h2 className={styles.title}>Navigation</h2>
                    <nav>
                        <ul className={styles.navItems}>
                            {panels.map(panel => (
                                <li
                                    className={styles.navItemWrapper}
                                    key={panel.title}
                                >
                                    <button
                                        className={c(
                                            styles.navItem,
                                            panel === selectedPanel &&
                                                styles.navItemSelected,
                                        )}
                                        onClick={() => changePanel(panel)}
                                    >
                                        {panel.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </header>
            </div>
        );
    }
}
