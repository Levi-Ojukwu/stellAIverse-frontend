import React, { useState, useEffect } from 'react';
import { ReferralService } from './services/referralService';
import { AnalyticsService } from './services/analyticsService';
import { ReferralLink, ReferralStats, ReferralReward } from './types';
import ReferralShareModal from './components/ReferralShareModal';

interface ReferralDashboardProps {
  userId: string;
}

const ReferralDashboard: React.FC<ReferralDashboardProps> = ({ userId }) => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referralLinks, setReferralLinks] = useState<ReferralLink[]>([]);
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'links' | 'rewards'>('overview');

  useEffect(() => {
    if (userId) {
      loadReferralData();
    }
  }, [userId]);

  const loadReferralData = async () => {
    setIsLoading(true);
    try {
      const [statsData, linksData, rewardsData] = await Promise.all([
        ReferralService.getReferralStats(userId),
        ReferralService.getUserReferralLinks(userId),
        ReferralService.getReferralRewards(userId),
      ]);

      setStats(statsData);
      setReferralLinks(linksData);
      setRewards(rewardsData);
    } catch (error) {
      console.error('Failed to load referral data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimReward = async (rewardId: string) => {
    const success = await ReferralService.claimReward(rewardId);
    if (success) {
      loadReferralData(); // Refresh data
    }
  };

  const handleDeactivateLink = async (linkId: string) => {
    try {
      await ReferralService.updateReferralLink(linkId, { isActive: false });
      loadReferralData();
    } catch (error) {
      console.error('Failed to deactivate link:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Referral Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your referral performance and rewards</p>
        </div>
        <button
          onClick={() => setShowShareModal(true)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Share & Earn
        </button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClicks}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Signups</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSignups}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rewards</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRewards} XLM</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{(stats.conversionRate * 100).toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'links'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Referral Links ({referralLinks.length})
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'rewards'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Rewards ({rewards.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Links</span>
                <span className="font-medium">{stats?.activeLinks || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Rewards</span>
                <span className="font-medium">{stats?.pendingRewards || 0} XLM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Clicks per Link</span>
                <span className="font-medium">
                  {referralLinks.length > 0 
                    ? (referralLinks.reduce((sum, link) => sum + link.uses, 0) / referralLinks.length).toFixed(1)
                    : '0'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'links' && (
        <div className="space-y-4">
          {referralLinks.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">No referral links yet</p>
              <button
                onClick={() => setShowShareModal(true)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Create Your First Link
              </button>
            </div>
          ) : (
            referralLinks.map((link) => (
              <div key={link.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{link.code}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        link.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {link.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 truncate">{link.url}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{link.uses} uses</span>
                      <span>•</span>
                      <span>{link.reward} reward</span>
                      <span>•</span>
                      <span>Created {new Date(link.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {link.isActive && (
                      <button
                        onClick={() => handleDeactivateLink(link.id)}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        Deactivate
                      </button>
                    )}
                    <button
                      onClick={() => navigator.clipboard.writeText(link.url)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="space-y-4">
          {rewards.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">No rewards earned yet</p>
              <p className="text-sm text-gray-500 mt-2">Start sharing your referral links to earn rewards!</p>
            </div>
          ) : (
            rewards.map((reward) => (
              <div key={reward.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{reward.amount} {reward.asset}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        reward.status === 'claimed' 
                          ? 'bg-green-100 text-green-800'
                          : reward.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {reward.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Code: {reward.referralCode} • Earned {new Date(reward.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {reward.status === 'pending' && (
                    <button
                      onClick={() => handleClaimReward(reward.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Claim
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Share Modal */}
      <ReferralShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        userId={userId}
      />
    </div>
  );
};

export default ReferralDashboard;
