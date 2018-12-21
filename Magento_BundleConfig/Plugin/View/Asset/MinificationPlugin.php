<?php
namespace Magento\BundleConfig\Plugin\View\Asset;

/**
 * Class MinificationPlugin
 * @package Magento\BundleConfig\Plugin\View\Asset
 */
class MinificationPlugin
{
    /**
     * Minfication should be disabled whenever BundleConfig module is active
     *
     * @param \Magento\Framework\View\Asset\Minification $subject
     * @param \Closure $proceed
     * @param string $contentType
     * @return bool
     */
    public function aroundIsEnabled(
        \Magento\Framework\View\Asset\Minification $subject,
        \Closure $proceed,
        $contentType) {
        // always disable minification for JS
        if ($contentType === 'js') {
            return false;
        }
        // proceed with normal processing for other assets
        return $proceed($contentType);
    }
}