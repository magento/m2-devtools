/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import splitter from '../splitter';

test('Empties all named splittables when all entries are common', () => {
    const splittable = {
        foo: ['a', 'b', 'c', 'd', 'e', 'f'],
        bar: ['b', 'd', 'f'],
        bizz: ['a', 'c', 'e'],
    };

    const [splits, commons] = splitter(splittable);
    expect(splits).toEqual({
        foo: [],
        bar: [],
        bizz: [],
    });
    expect(commons).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
});

test('Properly differentiates between commons and uniques', () => {
    const splittable = {
        foo: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
        bar: ['b', 'd', 'f', 'i', 'j'],
        bizz: ['k', 'l', 'a', 'c', 'e'],
    };

    const [splits, commons] = splitter(splittable);
    expect(splits).toEqual({
        foo: ['g', 'h'],
        bar: ['i', 'j'],
        bizz: ['k', 'l'],
    });
    expect(commons).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
});
