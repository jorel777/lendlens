import { X, Upload, Clock, DollarSign } from 'lucide-react';
import { useState } from 'react';

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'GHS', symbol: '₵' },
  { code: 'JPY', symbol: '¥' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'CAD', symbol: 'C$' },
];

const ImageUploadModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    image: null,
    imageUrl: '',
    itemName: '',
    duration: 60,
    durationUnit: 'minutes',
    amount: '',
    currency: 'GHS'
  });

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setFormData(prev => ({
          ...prev,
          image: file,
          imageUrl: base64
        }));
      } catch (error) {
        console.error('Error converting image:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.imageUrl) {
      alert('Please select an image');
      return;
    }

    if (!formData.itemName.trim()) {
      alert('Please enter a defaulter name');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const submissionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      duration: parseInt(formData.duration)
    };

    console.log('Submitting defaulter:', submissionData);
    
    try {
      await onSubmit(submissionData);
      // Reset form
      setFormData({
        image: null,
        imageUrl: '',
        itemName: '',
        duration: 60,
        durationUnit: 'minutes',
        amount: '',
        currency: 'GHS'
      });
      onClose();
    } catch (error) {
      console.error('Error submitting defaulter:', error);
      alert('Error adding defaulter. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 backdrop-blur-sm z-50">
      <div className="bg-secondary-light rounded-lg max-w-md w-full p-6 border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Add New Defaulter</h2>
            <p className="text-sm text-gray-400 mt-1">Their identity will be revealed when time expires</p>
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
              Defaulter's Photo
            </label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="photo-upload"
                required
              />
              <label 
                htmlFor="photo-upload" 
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                {formData.imageUrl ? (
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-lg mb-2"
                  />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-400">Click to upload or drag and drop</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Defaulter's Name
            </label>
            <input
              type="text"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              className="input-field"
              placeholder="Enter defaulter's name"
              required
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Amount to Repay
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="input-field flex-1"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="input-field w-24"
                >
                  {CURRENCIES.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Exposure Timer
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="input-field"
                min="1"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Unit
              </label>
              <select
                value={formData.durationUnit}
                onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
                className="input-field"
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center">
            <Upload className="w-5 h-5 mr-2" />
            Add Defaulter
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImageUploadModal; 