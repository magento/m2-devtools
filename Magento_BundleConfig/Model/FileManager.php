<?php declare(strict_types=1);
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\BundleConfig\Model;

use Magento\Framework\View\Asset\File\FallbackContext as FileFallbackContext;
use Magento\Framework\View\Asset\Repository as AssetRepository;

class FileManager
{
    /**
     * @var AssetRepository
     */
    private $assetRepo;

    /**
     * @var FileFallbackContext 
     */
    private $staticContext;

    /**
     * @param AssetRepository $assetRepo
     */
    public function __construct(AssetRepository $assetRepo)
    {
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
        return $this->assetRepo->createArbitrary($relPath, '');
    }

    public function createSharedJsBundleAsset()
    {
        $relPath = $this->staticContext->getConfigPath() . '/bundles/shared.js';
        return $this->assetRepo->createArbitrary($relPath, '');
    }
}
