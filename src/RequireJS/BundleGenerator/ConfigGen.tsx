/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as React from 'react';
import { RequireConfig, ModulesByPageType } from '../../types/require';
import generate from './generate';

type Props = {
    modulesByPageType: ModulesByPageType;
    requireConfig: RequireConfig;
};

export default class ConfigGen extends React.Component<Props> {
    render() {
        const { modulesByPageType, requireConfig } = this.props;
        const config = generate(modulesByPageType, requireConfig);

        return <pre>{JSON.stringify(config, null, 2)}</pre>;
    }
}
