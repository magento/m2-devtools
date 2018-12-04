/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export type RequireGlobal = {
    s: {
        contexts: {
            _: {
                nameToUrl: (name: string) => string;
                defined: { [key: string]: any };
                config: RequireConfig;
            };
        };
    };
};

export type ModuleDescriptor = {
    rawIdentifier: string;
    moduleIdent: string;
    plugins: string[];
    moduleURL: string;
    shortURL: string;
};

export type PageModule = {
    url: string;
    pageConfigType: string;
    modules: string[];
};

export type ModulesByURL = {
    [key: string]: PageModule;
};

export type ShimConfig = {
    [key: string]:
        | string[]
        | { exports: string; exportsFn?: any }
        | { deps: string[] };
};

export type RequireConfig = {
    baseUrl: string;
    config?: {
        mixins?: {
            [key: string]: {
                [key: string]: boolean;
            };
        };
    };
    map: {
        '*': {
            [key: string]: string;
        };
    };
    paths: {
        [key: string]: string;
    };
    shim: ShimConfig;
};
