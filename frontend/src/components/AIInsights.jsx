import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target } from 'lucide-react';

export function AIInsights({ insights, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-600" />
          AI Insights
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getInsightIcon = (type) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'opportunity':
        return <Target className="w-4 h-4 text-blue-600" />;
      default:
        return <Lightbulb className="w-4 h-4 text-purple-600" />;
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'trend':
        return 'border-l-green-500 bg-green-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'opportunity':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-purple-500 bg-purple-50';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Brain className="w-5 h-5 mr-2 text-purple-600" />
        AI Insights
      </h3>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`border-l-4 p-4 rounded-r-lg ${getInsightColor(insight.type)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                <p className="text-sm text-gray-700">{insight.description}</p>
                {insight.recommendation && (
                  <p className="text-sm text-gray-600 mt-2 italic">
                    💡 {insight.recommendation}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}