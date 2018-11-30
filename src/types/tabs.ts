/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export type Tab = {
    name: string;
    displayName: string;
    component: React.ComponentClass<any> | React.FunctionComponent<any>;
};
