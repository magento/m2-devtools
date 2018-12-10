# Setup Instructions

## Install the Magento_BundleConfig module

_Note: This module is currently not consumable via composer. [Want to help?](https://github.com/magento/m2-devtools/issues/14)_

Manually install the [`Magento_BundleConfig`](https://github.com/magento/m2-devtools/tree/master/Magento_BundleConfig) module from Github. Make sure you've run `setup:upgrade` and that the module is enabled.

## Set Store to Production Mode

Run `bin/magento deploy:mode:set production` to set the store to `production` mode.

## Backup Static Content Source

For the theme that you are bundling, move each language folder to a folder of the same name, appended with `_source`. For example, if you're bundling Luma in English, move `frontend/Magento/luma/en_US` to `frontend/Magento/luma/en_US_source`.

## Install the RequireJS Optimizer

You must have `node.js` installed locally. Run `npm install -g requirejs`

## Save the Generated Bundle Config

Click `Copy to Clipboard` in the `Bundle Generator` tab. Save the entire configuration in a file called `build.js` in the root of your store.

## Run the RequireJS Optimizer

Use the following snippet to run the RequireJS Optimizer on the command line, replacing the relevant pieces.

```sh
# Run in the root of the store on disk
r.js -o build.js baseUrl="pub/static/frontend/Magento/luma/en_US_source/" dir="pub/static/frontend/Magento/luma/en_US/"
```

## Test

If the above steps have been performed correctly, your store should now be running with optimized JavaScript bundles.
