/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PageCollector from '../PageCollector';
import { getBundlingData as unTyped_getBundlingData } from '../../../interop';

// TypeScript isn't aware of the `jest.mock` call below, so
// we do a type assertion once here
const getBundlingData = (unTyped_getBundlingData as any) as jest.MockInstance<
    typeof unTyped_getBundlingData
>;

const getMockData = () => ({
    url: 'https://www.site.com/product',
    config: {
        baseUrl: 'http://www.site.com',
        map: { '*': {} },
        paths: {},
        shim: {},
    },
    pageConfigType: 'catalog-product-view',
    modules: ['foo', 'bar'],
});

jest.mock('../../../interop');
jest.useFakeTimers();

beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
});

test('Does not start polling until a subscription exists', () => {
    getBundlingData.mockReturnValueOnce(Promise.resolve(getMockData()));

    const collector = new PageCollector();
    jest.runAllTimers();
    expect(getBundlingData).not.toHaveBeenCalled();

    const subscriber = jest.fn();
    collector.subscribe(subscriber);
    jest.runAllTimers();

    expect(getBundlingData).toHaveBeenCalled();
});

test('Stops notifying subscriber when it is unsubscribed', async () => {
    getBundlingData.mockReturnValueOnce(Promise.resolve(getMockData()));

    const collector = new PageCollector();
    const subscriber = jest.fn();
    collector.subscribe(subscriber);
    jest.runAllTimers();

    await 0;
    expect(subscriber).toHaveBeenCalledTimes(1);
    subscriber.mockReset();

    collector.unsubscribe(subscriber);
    jest.runAllTimers();

    await 0;
    expect(subscriber).not.toHaveBeenCalled();
});

test('Removes modules that are prepended with "mixins!"', async () => {
    getBundlingData.mockReturnValueOnce(
        Promise.resolve({
            ...getMockData(),
            modules: ['foo', 'bar', 'mixins!bar', 'bizz'],
        }),
    );

    const collector = new PageCollector();
    const subscriber = jest.fn();
    collector.subscribe(subscriber);

    jest.runAllTimers();

    await 0;
    expect(subscriber).toHaveBeenCalledTimes(1);
    const [[firstData]] = subscriber.mock.calls;
    expect(firstData.page.modules).toEqual(['foo', 'bar', 'bizz']);
});
