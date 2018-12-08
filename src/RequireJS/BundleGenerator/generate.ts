/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import { ShimConfig, RequireConfig, PageModule } from '../../types/require';
import splitter from '../../splitter';

export type RequireModule = {
    name: string;
    include: string[];
    exclude: string[];
    create: boolean;
};

type BundleConfig = {
    optimize: 'none' | 'uglify2';
    generateSourceMaps: boolean;
    wrapShim: boolean;
    modules: RequireModule[];
    inlineText: boolean;
    shim: ShimConfig;
    paths: {
        [key: string]: string;
    };
    map: {
        '*': {
            [key: string]: string;
        };
    };
};

export default function generate(
    pageModules: PageModule[],
    requireConfig: RequireConfig,
): BundleConfig {
    const splitByPageType = pageModules.reduce(
        (acc, mod) => {
            const prior = acc[mod.pageConfigType] || [];
            acc[mod.pageConfigType] = Array.from(
                new Set([...prior, ...mod.modules]),
            );
            return acc;
        },
        {} as { [key: string]: string[] },
    );
    const [finalSplits, commons] = splitter(splitByPageType);
    const config = cleanShims(cleanURLs(requireConfig));

    const sharedModules = {
        name: 'bundles/shared',
        include: commons.filter(m => {
            // `r.js` gets mad if these are included
            // Haven't looked into _why_ quite yet
            // TODO: debug
            return m !== 'mixins' && m !== 'text';
        }),
        exclude: [],
        create: true,
    };

    const finalModules = Object.entries(finalSplits)
        .filter(([_, modules]) => modules.length)
        .map(([pageConfigType, modules]) => ({
            name: `bundles/${pageConfigType}`,
            create: true,
            include: modules,
            exclude: ['bundles/shared'],
        }))
        .concat([sharedModules])
        .reverse();

    return {
        optimize: 'uglify2',
        generateSourceMaps: true,
        wrapShim: true,
        inlineText: true,
        modules: finalModules,
        shim: {
            ...config.shim,
            // Fix for configuration missing in core.
            // TODO: Update luma (or is it blank?)
            'magnifier/magnifier': ['jquery'],
            'fotorama/fotorama': ['jquery'],
        },
        paths: {
            ...config.paths,
            text: 'requirejs/text',
        },
        map: config.map,
    };
}

/**
 * Set any URL in `paths` and `map` to `empty:` to prevent r.js from blowing up.
 * `requirejs-config.js` in m2 at runtime will set the correct path
 */
function cleanURLs(config: Readonly<RequireConfig>): RequireConfig {
    const reHTTP = /^https?:\//;

    const clean = (obj: { [key: string]: string }) =>
        Object.entries(obj).reduce(
            (acc, [path, location]) => {
                const isHTTP = reHTTP.test(location);
                acc[path] = isHTTP ? 'empty:' : location;
                return acc;
            },
            {} as { [key: string]: string },
        );

    return {
        ...config,
        paths: clean(config.paths),
        map: {
            '*': clean(config.map['*']),
        },
    };
}

/**
 * The RequireJS config scraped from the storefront has an
 * unnecessary key 'exportsFn' for some modules, and 'exportsFn'
 * will cause `r.js` to blow up. Removing the key
 */
function cleanShims(config: Readonly<RequireConfig>): RequireConfig {
    return {
        ...config,
        shim: Object.entries(config.shim).reduce(
            (acc, [shim, val]) => {
                acc[shim] = val.hasOwnProperty('exportsFn')
                    ? {
                          // @ts-ignore: Type narrowing isn't working well here, and type guards are bulky
                          exports: val.exports,
                      }
                    : val;
                return acc;
            },
            {} as RequireConfig['shim'],
        ),
    };
}
