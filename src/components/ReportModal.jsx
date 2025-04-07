import { X, Send } from 'lucide-react';
import { useState } from 'react';

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    contactNumber: '',
    information: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      contactNumber: '',
      information: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 backdrop-blur-sm z-50">
      <div className="bg-secondary-light rounded-lg max-w-md w-full p-6 border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Report a defaulter</h2>
            <p className="text-sm text-gray-400 mt-1">Help us locate defaulters by providing information</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your contact number
            </label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              className="input-field"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Information about defaulter
            </label>
            <textarea
              value={formData.information}
              onChange={(e) => setFormData({ ...formData, information: e.target.value })}
              className="input-field min-h-[120px]"
              placeholder="Provide any information that can help locate the defaulter (e.g., last known location, workplace, etc.)"
              required
            />
          </div>

          <div className="text-sm text-gray-400">
            <p>Your information will be kept confidential and will only be used to locate defaulters.</p>
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center">
            <Send className="w-5 h-5 mr-2" />
            Submit report
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportModal; 