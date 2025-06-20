import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

export function FileUpload({ onUploadSuccess, isProcessing }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setError(null);
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (
      validTypes.includes(file.type) ||
      file.name.endsWith('.csv') ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls')
    ) {
      setUploadedFile(file);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await fetch('http://localhost:5000/files/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData
        });
        const data = await response.json();
        if (response.ok) {
          onUploadSuccess(data); 
          setUploadedFile(null); // Reset after successful upload
        } else {
          setError(data.error || 'File upload failed');
          setUploadedFile(null);
        }
      } catch (error) {
        setError('Network error. Please try again.');
        setUploadedFile(null);
      }
    } else {
      setError('Please upload a CSV or Excel file');
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {!uploadedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            dragActive 
              ? 'border-blue-500 bg-gray-700/50' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-white">
                Drop your file here, or <span className="text-blue-400">browse</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Supports CSV & Excel files
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-gray-600 rounded-lg p-4 bg-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-gray-300" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-white truncate">{uploadedFile.name}</p>
                <p className="text-sm text-gray-400">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0 pl-2">
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                  <span className="text-sm text-blue-400">Processing...</span>
                </div>
              ) : (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
              <button
                onClick={removeFile}
                className="p-1 hover:bg-gray-600 rounded-full transition-colors"
                aria-label="Remove file"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}
      {error && (
         <div className="mt-3 flex items-center space-x-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
        </div>
      )}
    </div>
  );
}