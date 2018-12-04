/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as React from 'react';
import { ModulesByURL, PageModule } from '../../types/require';
import styles from './RecordingProgress.css';

type Props = {
    modulesByURL: ModulesByURL;
};

export default class RecordingProgress extends React.Component<Props> {
    render() {
        const { modulesByURL } = this.props;

        return (
            <div className={styles.wrapper}>
                <ul className={styles.pageList}>
                    {Object.values(modulesByURL).map(mod => (
                        <PageTypeTile key={mod.url} mod={mod} />
                    ))}
                </ul>
            </div>
        );
    }
}

type PageTypeTileProps = {
    mod: PageModule;
};
function PageTypeTile({ mod }: PageTypeTileProps) {
    return (
        <li className={styles.tileWrapper}>
            <div className={styles.pageType}>{mod.pageConfigType}</div>
            <div>
                <span className={styles.tileDataLabel}>Module Count:</span>{' '}
                <span className={styles.tileDataValue} data-value-type="count">
                    {mod.modules.length}
                </span>
            </div>
            <div>
                <span className={styles.tileDataLabel}>URL:</span>{' '}
                <span className={styles.tileDataValue} data-value-type="url">
                    <a target="_blank" href={mod.url} rel="noopener">
                        {urlMinusHost(mod.url)}
                    </a>
                </span>
            </div>
        </li>
    );
}

const urlMinusHost = (u: string) => {
    const { pathname, search } = new window.URL(u);
    return pathname + search;
};
