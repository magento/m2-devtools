/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as React from 'react';
import styles from './ModuleList.css';
import { inspectModule } from '../../interop';
import { ModuleDescriptor } from '../../types/require';

type Props = {
    modules: ModuleDescriptor[];
};

export default class ModuleList extends React.Component<Props> {
    render() {
        const { modules } = this.props;
        return (
            <table className={styles.wrapper}>
                <thead>
                    <tr className={styles.headerRow}>
                        <th>Module Identifier</th>
                        <th>Plugins</th>
                    </tr>
                </thead>
                <tbody>
                    {modules.map(mod => (
                        <tr key={mod.rawIdentifier} className={styles.row}>
                            <td className={styles.td}>
                                <button
                                    onClick={() =>
                                        // @ts-ignore: incorrect type signature in lib def.
                                        // Last 2 args should be marked as optional
                                        chrome.devtools.panels.openResource(
                                            mod.moduleURL,
                                        )
                                    }
                                    className={styles.moduleLink}
                                >
                                    {mod.moduleIdent}
                                </button>
                                <button
                                    className={styles.inspectBtn}
                                    title={mod.moduleIdent}
                                    onClick={() =>
                                        inspectModule(mod.moduleIdent)
                                    }
                                >
                                    Inspect
                                </button>
                            </td>
                            <td className={styles.td}>
                                {mod.plugins.join(', ')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}
