/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import intersection from 'lodash.intersection';
import difference from 'lodash.difference';

type Splittables<T> = Readonly<{
    [key: string]: T[];
}>;

export default function splitter<T>(
    splittables: Splittables<T>,
): [Splittables<T>, T[]] {
    const namedPairs = Object.entries(splittables);
    const commons: T[] = [];
    const results = namedPairs.reduce(
        (acc, [name, values]) => {
            const { [name]: _, ...allOthers } = splittables;
            const allOtherValues = Object.values(allOthers).flat();

            const curCommons = intersection(values, allOtherValues);
            commons.push(...curCommons);
            acc.push([name, difference(values, commons)]);
            return acc;
        },
        [] as [string, T[]][],
    );
    return [fromEntries(results), Array.from(new Set(commons))];
}

// Object.fromEntries like helper
function fromEntries<T>(iterable: Iterable<[string, T]>) {
    return Array.from(iterable).reduce((obj, [key, val]) => {
        return Object.assign(obj, { [key]: val });
    }, {});
}
