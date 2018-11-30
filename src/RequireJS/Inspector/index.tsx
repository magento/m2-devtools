/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as React from 'react';
import ModuleList from './ModuleList';
import { getLoadedModulesDetails } from '../../interop';
import { ModuleDescriptor } from '../../types/require';
type State = {
    modules: ModuleDescriptor[] | null;
};

export default class Inspector extends React.Component<{}, State> {
    state = {
        modules: null,
    };

    async componentDidMount() {
        const modules = await getLoadedModulesDetails();
        // TODO: This `setState` is going to blow up if this component
        // quickly mounts/unmounts. Need to hoist the fetching higher in the tree
        this.setState({ modules });
    }

    render() {
        const { modules } = this.state;
        return modules ? (
            <ModuleList modules={modules} />
        ) : (
            <div>Loading...</div>
        );
    }
}
