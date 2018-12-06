/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export default function copyToClipboard(text: string) {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'absolute';
    el.style.left = '-9999px';

    document.body.appendChild(el);
    el.select();

    let success;

    try {
        success = document.execCommand('copy');
    } catch (err) {
        success = false;
        console.error(err);
    }

    document.body.removeChild(el);
    return success;
}
