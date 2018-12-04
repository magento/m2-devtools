/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as React from 'react';
import { RequireConfig, PageModule } from '../../types/require';
import generate from './generate';

type Props = {
    pageModules: PageModule[];
    requireConfig: RequireConfig;
};

export default class ConfigGen extends React.Component<Props> {
    render() {
        const { pageModules, requireConfig } = this.props;
        const config = generate(pageModules, requireConfig);

        return <pre>{JSON.stringify(config, null, 2)}</pre>;
    }
}
