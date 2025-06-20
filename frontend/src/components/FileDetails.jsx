import React from 'react';
import { FileText, Calendar, Database, BarChart3 } from 'lucide-react';

export function FileDetails({ fileInfo }) {
  if (!fileInfo) return null;

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-full">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-blue-400" />
        File Details
      </h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Database className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-gray-400">Rows</p>
              <p className="font-semibold text-white">{fileInfo.rows?.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <BarChart3 className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-gray-400">Columns</p>
              <p className="font-semibold text-white">{fileInfo.columns}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-gray-400">Uploaded</p>
              <p className="font-semibold text-white">{fileInfo.uploadedAt}</p>
            </div>
          </div>
        </div>
      </div>
      
      {fileInfo.columnNames && fileInfo.columnNames.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Column Names</p>
          <div className="flex flex-wrap gap-2">
            {fileInfo.columnNames.slice(0, 10).map((column, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full font-mono"
              >
                {column}
              </span>
            ))}
            {fileInfo.columnNames.length > 10 && (
              <span className="px-2 py-1 bg-gray-600 text-gray-400 text-xs rounded-full">
                +{fileInfo.columnNames.length - 10} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}