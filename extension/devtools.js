/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

// Heavily, *heavily* inspired by
// https://github.com/facebook/react-devtools/blob/e0b854e4c0fc2d067e45779f525d67702383ee6d/shells/webextension/src/main.js

let panelCreated = false;
let interval;

function createPanelIfMagento2() {
    if (panelCreated) return;

    const evalCode = `
        (${isMagento2Store.toString()})();
    `;
    chrome.devtools.inspectedWindow.eval(evalCode, isMagento => {
        if (!isMagento) return;
        panelCreated = true;
        clearInterval(interval);
        chrome.devtools.panels.create(
            'Magento 2',
            undefined,
            'panel.html',
            onPanelShown,
        );
    });
}

function onPanelShown(panel) {
    panel.onShown.addListener(window => {
        // If this listener isn't attached, Chrome won't create tha tab
    });
}

/**
 * Needs to handle
 *  - Stores with signing of static files disabled
 *  - Stores with the RequireJS head block moved to the body
 *  - Stores with Magento's built-in minification enabled
 */
function isMagento2Store() {
    const reRequireScript = /\/static(?:\/version\d+)?\/frontend\/.+\/.+\/requirejs\/require(?:\.min)?\.js/;
    const scripts = Array.from(document.querySelectorAll('script[src]') || []);
    return scripts.some(s => reRequireScript.test(s.src));
}

chrome.devtools.network.onNavigated.addListener(function() {
    pollForMagento();
});

function pollForMagento() {
    if (interval) clearInterval(interval);
    interval = setInterval(createPanelIfMagento2, 500);
}

pollForMagento();
