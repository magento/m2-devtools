/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export type Panel = {
    title: string;
    component: React.ComponentClass<any> | React.FunctionComponent<any>;
};
