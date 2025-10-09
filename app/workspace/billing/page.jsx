"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, CreditCard, Download, Calendar } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'Always free',
    description: 'Perfect for getting started',
    features: [
      '1 Course Generation',
      'Email Support',
      'Basic Analytics',
    ],
    limitations: [
      'Limited to 1 course',
      'No video content',
    ],
    current: true,
    tag: 'Upcoming',
  },
  {
    name: 'Starter',
    price: '$7.99',
    period: '/month',
    description: 'Create AI Course and learn',
    features: [
      'AI Course Generation',
      'Course Banner Images',
      'Email Support',
      'Advanced Analytics',
    ],
    current: false,
    tag: 'Active',
    popular: true,
  },
  {
    name: 'Premium',
    price: '$12.99',
    period: '/month',
    description: 'For power users and educators',
    features: [
      'Unlimited AI Course Generation',
      'Course Banner Images',
      'Priority Support',
      'Advanced Analytics',
      'Video Content Generation',
      'Custom Branding',
    ],
    current: false,
  },
];

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState('Free');
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
      </div>

      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Free Plan</h3>
                <p className="text-sm text-gray-600">$0/month</p>
                <p className="text-xs text-gray-500">Starts Jun 13</p>
              </div>
              <Badge variant="secondary">Upcoming</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
              <div>
                <h3 className="font-semibold">Starter Plan</h3>
                <p className="text-sm text-gray-600">$7.99/month</p>
                <p className="text-xs text-gray-500">Canceled - Ends Jun 13</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            
            <Button variant="outline" className="w-full">
              Switch Plans
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span>Visa - 4242 Default</span>
              </div>
              <Button variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              + Add new payment method
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Starter Plan - Monthly</p>
                <p className="text-sm text-gray-600">Jun 13, 2024</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium">$7.99</span>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Starter Plan - Monthly</p>
                <p className="text-sm text-gray-600">May 13, 2024</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium">$7.99</span>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  {plan.tag && (
                    <Badge variant={plan.current ? 'default' : 'secondary'}>
                      {plan.tag}
                    </Badge>
                  )}
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations?.map((limitation, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <X className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      plan.current 
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    }`}
                    disabled={plan.current}
                  >
                    {plan.current ? 'Current Plan' : `Switch to ${plan.name}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
