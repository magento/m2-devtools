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
        //
    });
}

// Stringified and run in the context of the inspected page.
// Cannot reference outer scope vars
function isMagento2Store() {
    const magentoClasses = [
        '.page-layout-1column',
        '.page-layout-2columns-left',
        '.page-layout-checkout'
    ];
    // TODO: Find a more foolproof way to determine if a page is an m2 store
    return magentoClasses.some(document.querySelector.bind(document));
}

chrome.devtools.network.onNavigated.addListener(function() {
    pollForMagento();
});

function pollForMagento() {
    if (interval) clearInterval(interval);
    interval = setInterval(createPanelIfMagento2, 500);
}

pollForMagento();
