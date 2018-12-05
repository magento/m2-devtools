/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import { PageModule, RequireConfig } from '../../types/require';
import { getBundlingData } from '../../interop';

type CollectVal = {
    config: RequireConfig;
    page: PageModule;
};
type Callback = (data: CollectVal) => void;

export default class PageCollector {
    timerID: number | null = null;
    private listeners: Set<Callback> = new Set();

    private pollForModules() {
        this.timerID = window.setTimeout(async () => {
            try {
                const {
                    modules,
                    config,
                    pageConfigType,
                    url,
                } = await getBundlingData();

                // TODO: Actually handle this case, since it will point to a bug
                // in the shaky logic of `_getPageConfigType` in `interop.ts`
                if (!pageConfigType) throw new Error('No pageConfigType found');

                const page = {
                    url,
                    pageConfigType,
                    // TODO: Address this hack better. m2 has a bug where
                    // a superfluous mixin is added to the Require registry for any
                    // require() with a relative URL (./).
                    modules: modules.filter(m => !m.startsWith('mixins!')),
                };

                this.notifyListeners({ page, config });
            } catch (err) {
                // TODO: Handle errors. Most common error is us attempting
                // to eval code in the currently-inspected page when it's
                // between pages, which can be safely ignored
                console.error(err);
            }

            this.pollForModules();
        }, 200);
    }

    private notifyListeners(val: CollectVal) {
        this.listeners.forEach(f => f(val));
    }

    private stopPolling() {
        if (this.timerID) window.clearTimeout(this.timerID);
    }

    unsubscribe(cb: Callback) {
        this.listeners.delete(cb);
        if (!this.listeners.size) this.stopPolling();
    }

    subscribe(cb: Callback) {
        this.listeners.add(cb);
        if (this.listeners.size === 1) this.pollForModules();
    }
}
