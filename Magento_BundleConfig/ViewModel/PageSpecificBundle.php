<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\BundleConfig\ViewModel;

use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\App\State as AppState;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Filesystem\DirectoryList;
use Magento\Framework\View\Asset\File;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Framework\View\Asset\Repository;

/**
 * View model responsible for getting page specific bundle js for layout.
 */
class PageSpecificBundle implements ArgumentInterface
{
    /**
     * @var Repository
     */
    private $assetRepo;

    /**
     * @var HttpRequest
     */
    private $httpRequest;

    /**
     * @var DirectoryList
     */
    private $dir;

    /**
     * @var AppState
     */
    private $appState;

    /**
     * @var File
     */
    private $asset;

    /**
     * @param Repository $assetRepo
     * @param HttpRequest $httpRequest
     * @param DirectoryList $dir
     * @param AppState $appState
     */
    public function __construct(
        Repository $assetRepo,
        HttpRequest $httpRequest,
        DirectoryList $dir,
        AppState $appState
    ) {
        $this->assetRepo = $assetRepo;
        $this->httpRequest = $httpRequest;
        $this->dir = $dir;
        $this->appState = $appState;
    }

    /**
     * Return page specific bundle asset url.
     *
     * @return string
     * @throws LocalizedException
     */
    public function getPageSpecificBundleUrl()
    {
        $this->asset = $this->asset ?? $this->getAsset();

        return $this->asset->getUrl();
    }

    /**
     * Check if page specific bundle asset exists.
     *
     * @return bool
     * @throws LocalizedException
     * @throws \Magento\Framework\Exception\FileSystemException
     */
    public function fileExists()
    {
        $this->asset = $this->asset ?? $this->getAsset();

        $staticDir = $this->dir->getPath('static');

        $pageSpecificBundleRelPath = $this->asset->getPath();
        $pageSpecificBundleAbsPath = $staticDir . "/" . $pageSpecificBundleRelPath;

        return file_exists($pageSpecificBundleAbsPath);
    }

    /**
     * Get page specific bundle asset.
     *
     * @return File
     * @throws LocalizedException
     */
    private function getAsset()
    {
        $fullActionName = $this->httpRequest->getFullActionName();

        $formattedActionName = str_replace("_", "-", $fullActionName);
        $filePath = 'bundles/' . $formattedActionName . '.js';

        return $this->assetRepo->createAsset($filePath);
    }

    /**
     * Check if developer mode is enabled.
     *
     * @return bool
     */
    public function isDeveloperModeEnabled()
    {
        return $this->appState->getMode() === AppState::MODE_DEVELOPER;
    }
}
