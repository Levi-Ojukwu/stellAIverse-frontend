import React, { useState, useEffect } from 'react';
import { ReferralService } from '../services/referralService';
import { SocialShareService } from '../services/socialShareService';
import { AnalyticsService } from '../services/analyticsService';
import { ReferralLink, SocialShareConfig } from '../types';
import SocialShareButton from './SocialShareButton';
import QRCodeGenerator from './QRCodeGenerator';

interface ReferralShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  className?: string;
}

const ReferralShareModal: React.FC<ReferralShareModalProps> = ({
  isOpen,
  onClose,
  userId,
  className = '',
}) => {
  const [referralLink, setReferralLink] = useState<ReferralLink | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      loadOrCreateReferralLink();
    }
  }, [isOpen, userId]);

  const loadOrCreateReferralLink = async () => {
    setIsLoading(true);
    try {
      // Try to get existing referral links first
      const existingLinks = await ReferralService.getUserReferralLinks(userId);
      const activeLink = existingLinks.find(link => link.isActive);
      
      if (activeLink) {
        setReferralLink(activeLink);
      } else {
        // Create new referral link
        const newLink = await ReferralService.generateReferralLink(userId);
        setReferralLink(newLink);
      }
    } catch (error) {
      console.error('Failed to load/create referral link:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!referralLink) return;

    const success = await SocialShareService.copyToClipboard(referralLink.url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Track copy event
      AnalyticsService.trackEvent({
        referralCode: referralLink.code,
        eventType: 'click',
        source: 'copy',
      });
    }
  };

  const handleSocialShare = async (platform: string) => {
    if (!referralLink) return;

    // Track social share event
    AnalyticsService.trackEvent({
      referralCode: referralLink.code,
      eventType: 'click',
      source: platform,
    });
  };

  const handleNativeShare = async () => {
    if (!referralLink) return;

    const shareConfig: SocialShareConfig = {
      platform: 'twitter', // Default, will be overridden by native share
      url: referralLink.url,
      title: 'Join me on stellAIverse!',
      description: `Discover amazing AI agents and earn ${referralLink.reward} when you sign up!`,
    };

    const success = await SocialShareService.nativeShare(shareConfig);
    if (success) {
      AnalyticsService.trackEvent({
        referralCode: referralLink.code,
        eventType: 'click',
        source: 'native',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Share & Earn</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : referralLink ? (
          <div className="space-y-6">
            {/* Referral Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Your Reward</span>
                <span className="text-lg font-bold text-green-600">{referralLink.reward}</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{referralLink.uses}</span> / {referralLink.maxUses} uses
              </div>
            </div>

            {/* Referral Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Referral Link
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={referralLink.url}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Social Sharing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Share on Social Media
              </label>
              <div className="grid grid-cols-2 gap-3">
                <SocialShareButton
                  platform="twitter"
                  config={{
                    platform: 'twitter',
                    url: referralLink.url,
                    title: 'Join me on stellAIverse!',
                    description: `Discover amazing AI agents and earn ${referralLink.reward} when you sign up!`,
                    hashtags: ['stellAIverse', 'AI', 'referral'],
                  }}
                  size="md"
                  showLabel={true}
                />
                <SocialShareButton
                  platform="facebook"
                  config={{
                    platform: 'facebook',
                    url: referralLink.url,
                    title: 'Join me on stellAIverse!',
                    description: `Discover amazing AI agents and earn ${referralLink.reward} when you sign up!`,
                  }}
                  size="md"
                  showLabel={true}
                />
                <SocialShareButton
                  platform="linkedin"
                  config={{
                    platform: 'linkedin',
                    url: referralLink.url,
                    title: 'Join me on stellAIverse!',
                    description: `Discover amazing AI agents and earn ${referralLink.reward} when you sign up!`,
                  }}
                  size="md"
                  showLabel={true}
                />
                <SocialShareButton
                  platform="whatsapp"
                  config={{
                    platform: 'whatsapp',
                    url: referralLink.url,
                    title: 'Join me on stellAIverse!',
                    description: `Discover amazing AI agents and earn ${referralLink.reward} when you sign up!`,
                  }}
                  size="md"
                  showLabel={true}
                />
              </div>
            </div>

            {/* Native Share */}
            {SocialShareService.isNativeShareSupported() && (
              <button
                onClick={handleNativeShare}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Share via System
              </button>
            )}

            {/* QR Code */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-700">
                  QR Code
                </label>
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  {showQR ? 'Hide' : 'Show'}
                </button>
              </div>
              {showQR && (
                <div className="flex justify-center">
                  <QRCodeGenerator
                    config={{
                      url: referralLink.url,
                      size: 200,
                      bgColor: '#ffffff',
                      fgColor: '#000000',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Stats Preview */}
            <div className="border-t pt-4">
              <div className="text-sm text-gray-600 text-center">
                Track your referral performance in the dashboard
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Failed to load referral link</p>
            <button
              onClick={loadOrCreateReferralLink}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralShareModal;
