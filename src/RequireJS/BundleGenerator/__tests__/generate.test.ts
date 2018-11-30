/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import generate, { RequireModule } from '../generate';

const sampleRequireConfig = {
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

test('Simple usage 1', () => {
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
