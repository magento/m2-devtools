<?php declare(strict_types=1);
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\BundleConfig\Block\Html\Head;

use Magento\Framework\RequireJs\Config as RequireJsConfig;
use Magento\Framework\App\State as AppState;
use Magento\Framework\View\Asset\Minification;

class Config extends \Magento\Framework\View\Element\AbstractBlock
{
    /**
     * @var RequireJsConfig
     */
    private $config;

    /**
     * @var \Magento\RequireJs\Model\FileManager
     */
    private $fileManager;

    /**
     * @var \Magento\Framework\View\Page\Config
     */
    protected $pageConfig;

    /**
     * @var \Magento\Framework\View\Asset\ConfigInterface
     */
    private $bundleConfig;

    /**
     * @param \Magento\Framework\View\Element\Context $context
     * @param RequireJsConfig $config
     * @param AppState $appState
     * @param \Magento\BundleConfig\Model\FileManager $fileManager
     * @param \Magento\Framework\View\Page\Config $pageConfig
     * @param \Magento\Framework\View\Asset\ConfigInterface $bundleConfig
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Context $context,
        RequireJsConfig $config,
        AppState $appState,
        \Magento\BundleConfig\Model\FileManager $fileManager,
        \Magento\Framework\View\Page\Config $pageConfig,
        \Magento\Framework\View\Asset\ConfigInterface $bundleConfig,
        \Magento\Framework\Filesystem\DirectoryList $dir,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->fileManager = $fileManager;
        $this->pageConfig = $pageConfig;
        $this->appState = $appState;
        $this->dir = $dir;
    }

    /**
     * Include specified AMD bundle as an asset on the page
     *
     * @return $this
     */
    protected function _prepareLayout()
    {
        if ($this->appState->getMode() == AppState::MODE_DEVELOPER) {
            return parent::_prepareLayout();
        }

        $staticDir = $this->dir->getPath('static');
        $fullActionName = $this->getRequest()->getFullActionName();

        $assetCollection = $this->pageConfig->getAssetCollection();

        $shared = $this->fileManager->createSharedJsBundleAsset();
        $sharedBundleRelPath = $shared->getFilePath();
        $sharedBundleAbsPath = $staticDir . "/" . $sharedBundleRelPath;

        if (file_exists($sharedBundleAbsPath)) {
            $assetCollection->insert(
                $sharedBundleRelPath,
                $shared,
                RequireJsConfig::REQUIRE_JS_FILE_NAME
            );
        }

        $bundleConfig = $this->fileManager->createJsBundleAsset($fullActionName);
        $pageSpecificBundleRelPath = $bundleConfig->getFilePath();
        $pageSpecificBundleAbsPath = $staticDir . "/" . $pageSpecificBundleRelPath;

        if (file_exists($pageSpecificBundleAbsPath)) {
            $assetCollection->insert(
                $pageSpecificBundleRelPath,
                $bundleConfig,
                $sharedBundleRelPath
            );
        }

        return parent::_prepareLayout();
    }
}
