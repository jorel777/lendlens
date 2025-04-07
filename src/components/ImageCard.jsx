import { useEffect, useState } from 'react';
import { Clock, AlertOctagon, Flag } from 'lucide-react';

const formatCurrency = (amount, currency) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const ImageCard = ({ image, itemName, endTime, amount, currency, isExpired, onReport }) => {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference <= 0) {
        return '00:00:00';
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (days > 0) {
        return `${days}d:${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }

      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    setTimeRemaining(calculateTimeRemaining());

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="bg-secondary-light rounded-lg overflow-hidden">
      <div className="relative aspect-square">
        <img
          src={image}
          alt={itemName}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isExpired ? 'scale-100' : 'blur-2xl scale-105'
          }`}
        />
        {!isExpired ? (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 mb-2 flex items-center justify-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>Time Remaining</span>
              </div>
              <div className="text-2xl font-mono font-bold text-white">
                {timeRemaining}
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-between p-4 bg-gradient-to-b from-black/70 via-transparent to-black/70">
            <div className="w-full flex justify-between items-start">
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-danger text-white">
                <AlertOctagon className="w-3 h-3 mr-1" />
                EXPOSED
              </span>
            </div>
            <div className="text-center">
              <div className="bg-danger/90 text-white px-4 py-2 rounded-md backdrop-blur-sm">
                <span className="text-sm font-medium uppercase tracking-wider">Defaulter</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-white">{itemName}</h3>
            <p className="text-sm text-gray-400">
              {isExpired ? 'Payment Defaulted' : 'Pending Repayment'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-danger font-medium">{formatCurrency(amount, currency)}</div>
          </div>
        </div>
        <button
          onClick={onReport}
          className="mt-2 text-xs text-gray-400 hover:text-danger flex items-center transition-colors"
        >
          <Flag className="w-3 h-3 mr-1" />
          Report this defaulter
        </button>
      </div>
    </div>
  );
};

export default ImageCard; 