<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\BundleConfig\Plugin\View\Asset;

use Magento\Framework\View\Asset\Minification;

/**
 * Class MinificationPlugin
 * @package Magento\BundleConfig\Plugin\View\Asset
 */
class MinificationPlugin
{
    /**
     * Minfication should be disabled whenever BundleConfig module is active
     *
     * @param Minification $subject
     * @param \Closure $proceed
     * @param string $contentType
     * @return bool
     */
    public function aroundIsEnabled(
        Minification $subject,
        \Closure $proceed,
        $contentType
    ) {
        // always disable minification for JS
        if ($contentType === 'js') {
            return false;
        }
        // proceed with normal processing for other assets
        return $proceed($contentType);
    }
}
