<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\BundleConfig\Model;

use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\App\State as AppState;
use Magento\Framework\RequireJs\Config;

class FileManager
{
    /**
     * @var \Magento\Framework\View\Asset\Repository
     */
    private $assetRepo;

    /**
     * @param \Magento\Framework\View\Asset\Repository $assetRepo
     */
    public function __construct(
        \Magento\Framework\View\Asset\Repository $assetRepo
    ) {
        $this->assetRepo = $assetRepo;
        $this->staticContext = $assetRepo->getStaticViewFileContext();
    }

    /**
     * Create a view asset representing the JS bundle for the page
     *
     * @return \Magento\Framework\View\Asset\File
     */
    public function createJsBundleAsset($fullActionName)
    {
        // TODO: Just generate paths with underscores in the Chrome extension
        $formattedActionName = str_replace("_", "-", $fullActionName);
        $relPath = $this->staticContext->getConfigPath() . '/bundles/' . $formattedActionName . '.js';
        // TODO: Find a way to silently bail when file does not exist. Not all action's
        // handles will have an associated JS bundle
        return $this->assetRepo->createArbitrary($relPath, '');
    }

    public function createSharedJsBundleAsset()
    {
        $relPath = $this->staticContext->getConfigPath() . '/bundles/shared.js';
        return $this->assetRepo->createArbitrary($relPath, '');
    }
}
