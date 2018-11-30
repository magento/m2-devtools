/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export default function classjoin(...args: any[]) {
    return args.filter(Boolean).join(' ');
}
