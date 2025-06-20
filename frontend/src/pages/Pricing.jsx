import React, { useState } from 'react';
import { Check, X, Zap, Crown, Rocket } from 'lucide-react';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individuals and small teams',
      icon: Zap,
      price: { monthly: 29, annual: 290 },
      features: [
        'Up to 10 data uploads per month',
        'Basic AI insights',
        'Standard visualizations',
        'PDF report export',
        'Email support',
        '5GB storage',
      ],
      limitations: [
        'Advanced AI features',
        'Custom integrations',
        'Priority support',
      ],
      popular: false,
      cta: 'Start Free Trial',
    },
    {
      name: 'Professional',
      description: 'Ideal for growing businesses',
      icon: Crown,
      price: { monthly: 99, annual: 990 },
      features: [
        'Unlimited data uploads',
        'Advanced AI insights & predictions',
        'Custom dashboard creation',
        'Automated report scheduling',
        'Priority email & chat support',
        '100GB storage',
        'Team collaboration',
        'API access',
      ],
      limitations: [
        'Custom integrations',
        'Dedicated account manager',
      ],
      popular: true,
      cta: 'Get Started',
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with custom needs',
      icon: Rocket,
      price: { monthly: 299, annual: 2990 },
      features: [
        'Everything in Professional',
        'Custom AI model training',
        'White-label solutions',
        'Custom integrations',
        'Dedicated account manager',
        'Unlimited storage',
        'Advanced security & compliance',
        'On-premise deployment option',
        'SLA guarantee',
      ],
      limitations: [],
      popular: false,
      cta: 'Contact Sales',
    },
  ];

  const faq = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
    },
    {
      question: 'What data formats do you support?',
      answer: 'We support CSV, Excel (XLS/XLSX), JSON, and can work with you on custom data formats through our API.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade encryption, secure data centers, and comply with GDPR, SOC 2, and other security standards.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. Contact support if you\'re not satisfied.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Choose the perfect plan for your analytics needs. All plans include our core AI features.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <span className={`text-lg ${!isAnnual ? 'text-white' : 'text-blue-300'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="mx-4 relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-300 ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg ${isAnnual ? 'text-white' : 'text-blue-300'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                Save 20%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                        : 'bg-gray-100'
                    }`}>
                      <plan.icon className={`h-6 w-6 ${
                        plan.popular ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-gray-600">{plan.description}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <span className="text-4xl font-bold text-gray-900">
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className="text-gray-600">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  </div>

                  <button className={`w-full py-3 px-4 rounded-lg font-medium mb-8 transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}>
                    {plan.cta}
                  </button>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">What's included:</h4>
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations.length > 0 && (
                      <>
                        <h4 className="font-semibold text-gray-900 mt-6">Not included:</h4>
                        {plan.limitations.map((limitation, limitationIndex) => (
                          <div key={limitationIndex} className="flex items-start">
                            <X className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-400">{limitation}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-8">
            {faq.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {item.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Try AILYTIX free for 14 days. No credit card required.
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300">
            Start Your Free Trial
          </button>
        </div>
      </section>
    </div>
  );
};

export default Pricing;