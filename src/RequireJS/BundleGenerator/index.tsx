/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as React from 'react';
import Toolbar from './Toolbar';
import ConfigGen from './ConfigGen';
import styles from './BundleGenerator.css';
import c from '../../classjoin';
import {
    getLoadedModules,
    getRequireConfig,
    getPageConfigType,
    getURL,
} from '../../interop';
import { ModulesByPageType, RequireConfig } from '../../types/require';
import RecordingProgress from './RecordingProgress';

type States = 'RECORDING' | 'RESULTS' | 'WELCOME';
type State = {
    currentState: States;
    modulesByPageType: ModulesByPageType;
    requireConfig: RequireConfig | null;
};

// TODO:
// - Merge modules from multiple URLs with same layout handle, instead of taking the latest
//      - Track URLs, leave comments in `r.js` generated config
// - Allow purging records for a visited URL. IOW, if you've visited 4 product pages, but
//   want to purge the results from 1 of them
// - Support a user provided list of URLs to drive the browser too, instead of manual nav
//   for frequent users
export default class BundleGenerator extends React.Component<{}, State> {
    state: State = {
        modulesByPageType: [],
        currentState: 'WELCOME',
        requireConfig: null,
    };
    timerID: number | null = null;

    onRecord = () => {
        this.setState(({ currentState }) => {
            const isStop = currentState === 'RECORDING';
            isStop ? this.stopPolling() : this.pollForModules();
            return {
                currentState: isStop ? 'RESULTS' : 'RECORDING',
            };
        });
    };

    onClear = () => {
        this.setState({
            currentState: 'WELCOME',
            modulesByPageType: [],
            requireConfig: null,
        });
    };

    stopPolling() {
        this.timerID && window.clearTimeout(this.timerID);
    }

    // TODO: Abstract the body of this method outside of the component
    // and test it. Also clean it up because it's a mess
    pollForModules() {
        this.timerID = window.setTimeout(async () => {
            try {
                const [
                    modules,
                    requireConfig,
                    pageConfigType,
                    url,
                ] = await Promise.all([
                    getLoadedModules(),
                    getRequireConfig(),
                    getPageConfigType(),
                    getURL(),
                ]);

                // TODO: Actually handle this case, since it will point to a bug
                // in the shaky logic of `_getPageConfigType` in `interop.ts`
                if (!pageConfigType) throw new Error('No pageConfigType found');

                this.setState(({ modulesByPageType }) => {
                    const [current] = modulesByPageType.filter(
                        m => m.pageConfigType === pageConfigType,
                    );
                    const mod = {
                        url,
                        pageConfigType,
                        // TODO: Address this hack better. m2 has a bug where
                        // a superfluous mixin is added to the Require registry for any
                        // require() with a relative URL (./).
                        modules: modules.filter(m => !m.startsWith('mixins!')),
                    };
                    current
                        ? modulesByPageType.splice(
                              modulesByPageType.indexOf(current),
                              1,
                              mod,
                          )
                        : modulesByPageType.push(mod);

                    return {
                        requireConfig,
                        modulesByPageType,
                    };
                });
            } catch (err) {
                console.error('Failure in pollForModules()', err);
            }

            this.pollForModules();
        }, 200);
    }

    componentWillUnmount() {
        this.stopPolling();
    }

    render() {
        const { currentState, modulesByPageType, requireConfig } = this.state;

        return (
            <>
                <Toolbar
                    onRecord={this.onRecord}
                    onClear={this.onClear}
                    isRecording={currentState === 'RECORDING'}
                />
                {currentState === 'WELCOME' && welcomeContent}
                {currentState === 'RECORDING' && (
                    <RecordingProgress modulesByPageType={modulesByPageType} />
                )}
                {currentState === 'RESULTS' && requireConfig && (
                    <ConfigGen
                        modulesByPageType={modulesByPageType}
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
