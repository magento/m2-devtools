/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as React from 'react';
import Toolbar from './Toolbar';
import ConfigGen from './ConfigGen';
import styles from './BundleGenerator.css';
import c from '../../classjoin';
import { RequireConfig, PageModule } from '../../types/require';
import RecordingProgress from './RecordingProgress';
import PageCollector from './PageCollector';

type States = 'RECORDING' | 'RESULTS' | 'WELCOME';
type State = {
    currentState: States;
    modulesByURL: { [key: string]: PageModule };
    requireConfig: RequireConfig | null;
};

export default class BundleGenerator extends React.Component<{}, State> {
    state: State = {
        modulesByURL: {},
        currentState: 'WELCOME',
        requireConfig: null,
    };
    collector: PageCollector = new PageCollector();

    onRecord = () => {
        this.setState(({ currentState }) => {
            const shouldStopRecording = currentState === 'RECORDING';
            shouldStopRecording ? this.stopPolling() : this.pollForModules();
            return {
                currentState: shouldStopRecording ? 'RESULTS' : 'RECORDING',
            };
        });
    };

    onClear = () => {
        this.setState({
            currentState: 'WELCOME',
            modulesByURL: {},
            requireConfig: null,
        });
    };

    stopPolling() {
        this.collector.unsubscribe(this.collectorCallback);
    }

    collectorCallback = (data: { page: PageModule; config: RequireConfig }) => {
        const { page, config } = data;
        this.setState(prevState => ({
            modulesByURL: {
                ...prevState.modulesByURL,
                [page.url]: page,
            },
            requireConfig: config,
        }));
    };

    pollForModules() {
        this.collector.subscribe(this.collectorCallback);
    }

    componentWillUnmount() {
        this.stopPolling();
    }

    render() {
        const { currentState, modulesByURL, requireConfig } = this.state;

        return (
            <>
                <Toolbar
                    onRecord={this.onRecord}
                    onClear={this.onClear}
                    isRecording={currentState === 'RECORDING'}
                />
                {currentState === 'WELCOME' && welcomeContent}
                {currentState === 'RECORDING' && (
                    <RecordingProgress modulesByURL={modulesByURL} />
                )}
                {currentState === 'RESULTS' && requireConfig && (
                    <ConfigGen
                        pageModules={Object.values(modulesByURL)}
                        requireConfig={requireConfig}
                    />
                )}
            </>
        );
    }
}

const welcomeContent = (
    <div className={styles.centeredCopy}>
        <p>
            Click the record button{' '}
            <button title="Record" className={styles.recordBtn}>
                ●
            </button>
            , then begin navigating to critical pages of your store (Home,
            Product, Catalog, Checkout, etc).
        </p>
        <p>
            When you are done, click the record button{' '}
            <button
                title="Record"
                className={c(styles.recordBtn, styles.recording)} // TODO: Different handling of recording styling here than in Toolbar.js
            >
                ●
            </button>{' '}
            again to stop, and a configuration will be generated for the
            RequireJS Optimizer.
        </p>
        <p>
            Click{' '}
            <button title="Clear" className={styles.clearBtn}>
                ⃠
            </button>{' '}
            to clear results and start over.
        </p>
    </div>
);
