/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import generate, { RequireModule } from '../generate';
import { RequireConfig } from '../../../types/require';

const sampleRequireConfig: RequireConfig = {
    baseUrl: 'http://website.com',
    map: {
        '*': {},
    },
    paths: {},
    shim: {},
};
const modulesByName = (modules: RequireModule[]) =>
    modules.reduce<{ [key: string]: RequireModule }>((acc, cur) => {
        return (acc[cur.name] = cur), acc;
    }, {});

test('Splits common modules out, keeping uniques', () => {
    const modulesByPageType = [
        {
            url: 'http://www.site.com',
            pageConfigType: 'cms-index-index',
            modules: ['home/foo', 'home/bar', 'common/one'],
        },
        {
            url: 'http://www.site.com/some-product',
            pageConfigType: 'catalog-product-view',
            modules: ['product/foo', 'common/one', 'product/bar'],
        },
    ];

    const { modules } = generate(modulesByPageType, sampleRequireConfig);
    const byName = modulesByName(modules);

    expect(byName['bundles/shared']!.include).toEqual(['common/one']);
    expect(byName['bundles/cms-index-index']!.include).toEqual([
        'home/foo',
        'home/bar',
    ]);
    expect(byName['bundles/catalog-product-view']!.include).toEqual([
        'product/foo',
        'product/bar',
    ]);
});

test('Sets URLs in paths and map* config to empty', () => {
    const modulesByPageType = [
        {
            url: 'http://www.site.com',
            pageConfigType: 'cms-index-index',
            modules: ['home/foo', 'home/bar', 'common/one'],
        },
    ];
    const requireConfig = {
        ...sampleRequireConfig,
        paths: {
            foo: 'https://www.cdn.com/foo.js',
        },
        map: {
            '*': {
                bar: 'https://www.cdn.com/bar.js',
            },
        },
    };

    const { paths, map } = generate(modulesByPageType, requireConfig);
    expect(paths.foo).toBe('empty:');
    expect(map['*'].bar).toBe('empty:');
});

// https://github.com/requirejs/example-multipage/blob/3aae13210720e6b02e69513431bdf6a1fa516556/tools/build.js#L20-L24
test('Shared bundle is first, to ensure later excludes of it work', () => {
    const modulesByPageType = [
        {
            url: 'http://www.site.com',
            pageConfigType: 'cms-index-index',
            modules: ['home/foo', 'home/bar', 'common/one'],
        },
        {
            url: 'http://www.site.com/some-product',
            pageConfigType: 'catalog-product-view',
            modules: ['product/foo', 'common/one', 'product/bar'],
        },
    ];

    const { modules } = generate(modulesByPageType, sampleRequireConfig);
    expect(modules[0].name).toBe('bundles/shared');
});

test('Does not create bundle for handles with no unique modules', () => {
    const modulesByPageType = [
        {
            url: 'http://www.site.com',
            pageConfigType: 'cms-index-index',
            modules: ['common/one'],
        },
        {
            url: 'http://www.site.com/some-product',
            pageConfigType: 'catalog-product-view',
            modules: ['product/foo', 'common/one'],
        },
    ];

    const { modules } = generate(modulesByPageType, sampleRequireConfig);
    const byName = modulesByName(modules);
    expect(byName).not.toHaveProperty('bundles/cms-index-index');
});

test('Fixes "text" mapping in paths for r.js', () => {
    const modulesByPageType = [
        {
            url: 'http://www.site.com',
            pageConfigType: 'cms-index-index',
            modules: ['home/foo', 'home/bar', 'common/one'],
        },
    ];
    const requireConfig = {
        ...sampleRequireConfig,
        paths: {
            text: 'mage/requirejs/text',
        },
    };

    const { paths } = generate(modulesByPageType, requireConfig);
    expect(paths.text).toBe('requirejs/text');
});

test('Provided paths and map* are included in generated config', () => {
    const modulesByPageType = [
        {
            url: 'http://www.site.com',
            pageConfigType: 'cms-index-index',
            modules: ['home/foo', 'home/bar', 'common/one'],
        },
    ];
    const requireConfig = {
        ...sampleRequireConfig,
        paths: {
            testFoo: 'test/foo',
        },
        map: {
            '*': {
                testBar: 'test/bar',
            },
        },
    };

    const { paths, map } = generate(modulesByPageType, requireConfig);
    expect(paths.testFoo).toBe('test/foo');
    expect(map['*'].testBar).toBe('test/bar');
});

test('Correctly merges > 1 results for same layout handle', () => {
    const modulesByPageType = [
        {
            url: 'http://www.site.com/product1',
            pageConfigType: 'catalog-product-view',
            modules: [
                'product/common',
                'product/common2',
                'common/foo',
                'product/unique',
            ],
        },
        {
            url: 'http://www.site.com/product2',
            pageConfigType: 'catalog-product-view',
            modules: ['product/common', 'product/common2', 'common/foo'],
        },
        {
            url: 'http://www.site.com/',
            pageConfigType: 'cms-index-index',
            modules: ['common/foo'],
        },
    ];
    const { modules } = generate(modulesByPageType, sampleRequireConfig);
    const byName = modulesByName(modules);

    expect(byName['bundles/shared'].include).toEqual(['common/foo']);
    expect(byName['bundles/catalog-product-view'].include).toEqual([
        'product/common',
        'product/common2',
        'product/unique',
    ]);
});
