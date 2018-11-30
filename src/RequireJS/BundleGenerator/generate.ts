/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {
    ModulesByPageType,
    ShimConfig,
    RequireConfig,
} from '../../types/require';
import intersection from 'lodash.intersection';
import difference from 'lodash.difference';

export type RequireModule = {
    name: string;
    include: string[];
    exclude: string[];
    create: boolean;
};

type BundleConfig = {
    optimize: 'none';
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
    modulesByPageType: ModulesByPageType,
    requireConfig: RequireConfig,
): BundleConfig {
    // Cheap clone so we can feel free to mutate
    const modules = JSON.parse(
        JSON.stringify(modulesByPageType),
    ) as ModulesByPageType;

    const commons: string[] = [];
    modules.forEach(mod => {
        // Flatten all other page's modules into
        // a flat list
        const otherPages = modules
            .map(m => m.modules)
            .filter(m => m !== mod.modules)
            .flat();
        // Find all the module's common between this page and at
        // least 1 other page
        const modCommons = intersection(mod.modules, otherPages);
        commons.push(...modCommons);
        // Find all modules only used on this page
        mod.modules = difference(mod.modules, commons);
    });

    // Set any URL in `paths` and `map` to `empty:` to prevent r.js from blowing up.
    // `requirejs-config.js` in m2 at runtime will set the correct path
    const config = JSON.parse(JSON.stringify(requireConfig)) as RequireConfig;
    Object.entries(config.paths).forEach(([path, location]) => {
        if (/^https?:\//.test(location)) {
            config.paths[path] = 'empty:';
        }
    });
    const mapStar = config.map['*'];
    Object.entries(mapStar).forEach(([path, location]) => {
        if (/^https?:\//.test(location)) {
            mapStar[path] = 'empty:';
        }
    });

    // The RequireJS config scraped from the storefront has an
    // unnecessary key 'exportsFn' for some modules, and 'exportsFn'
    // will cause `r.js` to blow up. Removing the key
    Object.entries(config.shim).forEach(([key, conf]) => {
        if (!conf.hasOwnProperty('exportsFn')) return;
        // @ts-ignore: Type narrowing isn't working well here, and type guards
        // are bulky
        config.shim[key] = { exports: conf.exports };
    });

    const sharedModules = {
        name: 'bundles/shared',
        // Cast to/from Set to kill duplicates
        include: Array.from(new Set(commons)).filter(m => {
            // `r.js` gets mad if these are included
            // Haven't looked into _why_ quite yet
            // TODO: debug
            return m !== 'mixins' && m !== 'text';
        }),
        exclude: [],
        create: true,
    };

    const finalModules = modules
        // Don't generate a bundle for pages
        // that have no unique modules
        .filter(mod => mod.modules.length)
        .map(mod => ({
            name: `bundles/${mod.pageConfigType}`,
            include: mod.modules,
            // Exclude any modules that are already
            // found in the shared bundle
            exclude: ['bundles/shared'],
            create: true,
        }))
        .concat([sharedModules])
        // Shared module needs to be first. If they are not,
        // the `exclude` for `bundles/shared` won't work
        .reverse();

    return {
        optimize: 'none',
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
            // Config scraped from the page will have the
            // `text` plugin pointed at the custom m2 runtime one.
            // For bundling we need to use the one baked-in to RequireJS
            text: 'requirejs/text',
        },
        map: config.map,
    };
}
