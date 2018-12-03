<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\BundleConfig\Block\Html\Head;

use Magento\Framework\RequireJs\Config as RequireJsConfig;
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
     * @param \Magento\BundleConfig\Model\FileManager $fileManager
     * @param \Magento\Framework\View\Page\Config $pageConfig
     * @param \Magento\Framework\View\Asset\ConfigInterface $bundleConfig
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Context $context,
        RequireJsConfig $config,
        \Magento\BundleConfig\Model\FileManager $fileManager,
        \Magento\Framework\View\Page\Config $pageConfig,
        \Magento\Framework\View\Asset\ConfigInterface $bundleConfig,
        array $data = []
    ) {
        $this->fileManager = $fileManager;
        $this->pageConfig = $pageConfig;
        parent::__construct($context, $data);
    }

    /**
     * Include specified AMD bundle as an asset on the page
     *
     * @return $this
     */
    protected function _prepareLayout()
    {
        $fullActionName = $this->getRequest()->getFullActionName();
        $assetCollection = $this->pageConfig->getAssetCollection();
        $bundleConfig = $this->fileManager->createJsBundleAsset($fullActionName);
        $assetCollection->insert(
            $bundleConfig->getFilePath(),
            $bundleConfig,
            RequireJsConfig::REQUIRE_JS_FILE_NAME
        );

        $shared = $this->fileManager->createSharedJsBundleAsset();
        $assetCollection->insert(
            $shared->getFilePath(),
            $shared,
            $bundleConfig->getFilePath()
        );

        return parent::_prepareLayout();
    }
}
