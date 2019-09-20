<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\BundleConfig\ViewModel;

use Magento\Framework\App\State as AppState;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Filesystem\DirectoryList;
use Magento\Framework\View\Asset\File;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Framework\View\Asset\Repository;

/**
 * View model responsible for getting shared bundle js for layout.
 */
class SharedBundle implements ArgumentInterface
{
    /**
     * @var Repository
     */
    private $assetRepo;

    /**
     * @var $filePath
     */
    private $filePath;

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
     * @param DirectoryList $dir
     * @param AppState $appState
     * @param string $filePath
     */
    public function __construct(
        Repository $assetRepo,
        DirectoryList $dir,
        AppState $appState,
        string $filePath = ''
    ) {
        $this->assetRepo = $assetRepo;
        $this->dir = $dir;
        $this->appState = $appState;
        $this->filePath = $filePath;
    }

    /**
     * Return shared bundle asset url.
     *
     * @return string
     * @throws LocalizedException
     */
    public function getSharedBundleUrl()
    {
        $this->asset = $this->asset ?? $this->getAsset();

        return $this->asset->getUrl();
    }

    /**
     * Check if shared bundle asset exists.
     *
     * @return bool
     * @throws LocalizedException
     * @throws \Magento\Framework\Exception\FileSystemException
     */
    public function fileExists()
    {
        $this->asset = $this->asset ?? $this->getAsset();

        $staticDir = $this->dir->getPath('static');

        $sharedBundleRelPath = $this->asset->getPath();
        $sharedBundleAbsPath = $staticDir . "/" . $sharedBundleRelPath;

        return file_exists($sharedBundleAbsPath);
    }

    /**
     * Get shared bundle asset.
     *
     * @return File
     * @throws LocalizedException
     */
    private function getAsset()
    {
        return $this->assetRepo->createAsset($this->filePath);
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
