/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * The simplest way to communicate with the target tab (in an extension) via
 * the DevTools page is by sending over strings of code with `inspectedWindow.eval`.
 * Note that all functions in this file that start with an underscore _cannot_
 * reference any variables in the scope of this module outside of their own function scope.
 * This is because `_fn.toString()` is called, and the code is passed to a different
 * execution context.
 *
 * If you need to write an introspection function that accepts parameters, see
 * `inspectModuleFactory` in this module as an example
 */

import {
    RequireGlobal,
    ModuleDescriptor,
    RequireConfig,
} from './types/require';

function _getLoadedModulesDetails(): ModuleDescriptor[] {
    const require: RequireGlobal = (window as any).require;
    const { baseUrl } = require.s.contexts._.config;

    return Object.keys(require.s.contexts._.defined).map(identifier => {
        const identParts = identifier.split('!');
        const moduleIdent = identParts[identParts.length - 1];
        const plugins = identParts.slice(0, identParts.length - 1);
        const moduleURL = require.s.contexts._.nameToUrl(moduleIdent);

        return {
            rawIdentifier: identifier,
            moduleIdent,
            plugins,
            moduleURL,
            shortURL: moduleURL.replace(baseUrl, ''),
        };
    });
}
export const getLoadedModulesDetails = () =>
    evalInPage<ModuleDescriptor[]>(_getLoadedModulesDetails.toString());

function _getLoadedModules() {
    const require: RequireGlobal = (window as any).require;
    return Object.keys(require.s.contexts._.defined);
}
export const getLoadedModules = () =>
    evalInPage<string[]>(_getLoadedModules.toString());

function _getRequireConfig(): RequireConfig {
    const require: RequireGlobal = (window as any).require;
    return require.s.contexts._.config;
}
export const getRequireConfig = () =>
    evalInPage<RequireConfig>(_getRequireConfig.toString());

function inspectModuleFactory(identifier: string) {
    const inspectModule = () => {
        const require: RequireGlobal = (window as any).require;
        const mod = require.s.contexts._.defined['IDENT'];
        if (typeof mod === 'undefined') {
            console.warn('Module "IDENT" did not export any value');
            return;
        }
        if (typeof mod === 'function') {
            // @ts-ignore https://developers.google.com/web/tools/chrome-devtools/console/command-line-reference#inspect
            inspect(mod);
            return;
        }

        console.info(mod);
    };

    return inspectModule.toString().replace(/IDENT/g, identifier);
}
export const inspectModule = (identifier: string) =>
    evalInPage<undefined>(inspectModuleFactory(identifier));

// This function makes me laugh every time I see it.
// TODO: Find something more reliable?
function _getPageConfigType(): string | undefined {
    return Array.from(document.body.classList)
        .filter(c => c.split('-').length === 3)
        .filter(c => !c.startsWith('page-'))
        .filter(c => c.endsWith('-view') || c.endsWith('-index'))[0];
}
export const getPageConfigType = () =>
    evalInPage<string | undefined>(_getPageConfigType.toString());

function _getURL(): string {
    return window.location.href;
}
export const getURL = () => evalInPage<string>(_getURL.toString());

export async function getBundlingData() {
    const [modules, config, pageConfigType, url] = await Promise.all([
        getLoadedModules(),
        getRequireConfig(),
        getPageConfigType(),
        getURL(),
    ]);
    return { modules, config, pageConfigType, url };
}

function evalInPage<T>(code: string): Promise<T> {
    return new Promise((res, rej) => {
        const wrappedCode = `(${code})()`;
        chrome.devtools.inspectedWindow.eval<T>(wrappedCode, (result, err) => {
            err ? rej(err) : res(result);
        });
    });
}
