'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

export default function PremiumWaitlist() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      title: 'Early Access',
      description: 'Be the first to experience premium AI agent features before anyone else.',
      icon: '🚀',
    },
    {
      title: 'Exclusive Discounts',
      description: 'Get lifetime discounts on premium subscriptions and agent marketplace fees.',
      icon: '💎',
    },
    {
      title: 'Priority Support',
      description: 'Receive dedicated support with faster response times and personalized assistance.',
      icon: '⭐',
    },
    {
      title: 'Beta Features',
      description: 'Access cutting-edge features and participate in shaping the future of AI agents.',
      icon: '🔮',
    },
    {
      title: 'Community Access',
      description: 'Join an exclusive community of premium users and AI agent creators.',
      icon: '🌟',
    },
    {
      title: 'Enhanced Analytics',
      description: 'Get advanced insights and analytics for your AI agent performance.',
      icon: '📊',
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 nebula-bg">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">✨</div>
            <h1 className="text-4xl font-bold mb-4 glow-text">You're on the list!</h1>
            <p className="text-xl text-cosmic-cyan mb-8">
              Thank you for joining the premium waitlist. We'll be in touch soon with exclusive updates.
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-cosmic-purple">
              Check your email for a confirmation message.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="mx-auto"
            >
              Add Another Email
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen nebula-bg">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-cosmic-purple/20 rounded-full border border-cosmic-purple/30 mb-6">
              <span className="text-cosmic-nebula text-sm font-semibold">LIMITED SPOTS AVAILABLE</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 glow-text">
            Unlock the Future of
            <span className="block text-cosmic-nebula">AI Agents</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-cosmic-cyan mb-8 max-w-3xl mx-auto">
            Join the exclusive premium waitlist and be among the first to experience the next generation of AI agent creation and interaction.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <div className="flex items-center gap-2 text-cosmic-purple">
              <span className="text-2xl">👥</span>
              <span className="font-semibold">2,847+ waiting</span>
            </div>
            <div className="flex items-center gap-2 text-cosmic-purple">
              <span className="text-2xl">⏱️</span>
              <span className="font-semibold">Early access coming soon</span>
            </div>
          </div>
        </div>

        {/* Email Signup Form */}
        <div className="max-w-md mx-auto mb-16">
          <Card className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-cosmic-nebula">Reserve Your Spot</h2>
            <p className="text-cosmic-cyan mb-6">
              Enter your email to join the premium waitlist and get exclusive early access.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-3 bg-cosmic-dark/50 border border-cosmic-purple/30 rounded-lg text-white placeholder-cosmic-purple/50 focus:outline-none focus:border-cosmic-purple focus:ring-2 focus:ring-cosmic-purple/20 transition-smooth"
              />
              
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Joining...' : 'Join Premium Waitlist'}
              </Button>
            </form>
            
            <p className="text-xs text-cosmic-purple/60 mt-4">
              No spam, ever. Unsubscribe at any time.
            </p>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 glow-text">
            Premium Benefits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center group hover:scale-105 transition-smooth">
                <div className="text-4xl mb-4 group-hover:animate-pulse-slow">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-cosmic-nebula">
                  {benefit.title}
                </h3>
                <p className="text-cosmic-cyan">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-block p-8 bg-gradient-to-r from-cosmic-purple/20 to-cosmic-blue/20 rounded-2xl border border-cosmic-purple/30">
            <h2 className="text-2xl font-bold mb-4 text-cosmic-nebula">
              Ready to Transform Your AI Experience?
            </h2>
            <p className="text-cosmic-cyan mb-6">
              Don't miss your chance to be at the forefront of AI agent innovation.
            </p>
            <Button size="lg" onClick={() => document.getElementById('email-form')?.scrollIntoView({ behavior: 'smooth' })}>
              Join the Waitlist Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
