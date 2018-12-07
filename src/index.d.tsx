/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}

declare module 'highlight-javascript-syntax' {
    const fn: (code: string) => string;
    export = fn;
}

declare module '*.md' {
    const content: string;
    export default content;
}
