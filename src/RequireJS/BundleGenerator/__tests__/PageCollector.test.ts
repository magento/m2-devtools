/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PageCollector from '../PageCollector';
import { getBundlingData } from '../../../interop';

jest.mock('../../../interop');
jest.useFakeTimers();

beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
});

test('Does not start polling until a subscription exists', () => {
    const collector = new PageCollector();
    jest.runAllTimers();
    expect(getBundlingData).not.toHaveBeenCalled();

    const subscriber = jest.fn();
    collector.subscribe(subscriber);
    jest.runAllTimers();

    expect(getBundlingData).toHaveBeenCalled();
});

test('Stops notifying subscriber when it is unsubscribed', () => {
    const collector = new PageCollector();
    const subscriber = jest.fn();
    collector.subscribe(subscriber);

    jest.runAllTimers();
    const callCountBeforeUnsubscribe = subscriber.mock.calls.length;
    collector.unsubscribe(subscriber);
    jest.runAllTimers();

    expect(subscriber).toHaveBeenCalledTimes(callCountBeforeUnsubscribe);
});

test('Removes modules that are prepended with "mixins!"', () => {
    const mock = (getBundlingData as unknown) as jest.MockInstance<
        typeof getBundlingData
    >;
    mock.mockReturnValue(
        Promise.resolve({
            url: 'https://www.site.com/product',
            config: {},
            pageConfigType: 'catalog-product-view',
            modules: ['foo', 'bar', 'mixins!bar', 'bizz'],
        }),
    );

    const collector = new PageCollector();
    const subscriber = jest.fn();
    collector.subscribe(subscriber);

    jest.runAllTimers();

    // Unlike tests using the `jest.mock` automock functionality,
    // we need to wait briefly here because the Promise passed to `mock.mockReturnValue`
    // above uses a microtask to unwrap
    setImmediate(() => {
        expect(subscriber).toHaveBeenCalledTimes(1);
    });
});
