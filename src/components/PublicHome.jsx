import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, LogIn } from 'lucide-react';
import ImageCard from './ImageCard';
import ReportModal from './ReportModal';
import { useAuth } from '../contexts/AuthContext';

const PublicHome = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedDefaulter, setSelectedDefaulter] = useState(null);
  const { isAdmin, defaulters } = useAuth();

  const handleReportSubmit = (formData) => {
    console.log('Report submitted:', { ...formData, defaulter: selectedDefaulter });
    setIsReportModalOpen(false);
    setSelectedDefaulter(null);
  };

  // Filter out disabled defaulters for public view
  const activeDefaulters = defaulters.filter(d => d.enabled);

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-secondary">
        <div className="border-b border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-6 h-6 text-danger" />
                <h1 className="text-2xl font-bold text-white">BLACKLIST</h1>
              </div>
              {isAdmin ? (
                <Link to="/admin" className="btn-secondary flex items-center space-x-2">
                  <LogIn className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link to="/login" className="btn-secondary flex items-center space-x-2">
                  <LogIn className="w-5 h-5" />
                  <span>Admin Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="py-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Repay your loans </span>
            <span className="text-danger">or be exposed</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Blacklist adds social pressure to loan repayments. Defaulters' photos remain
            blurred until the countdown ends. Repay on time or risk being revealed.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-white mb-8">Active Defaulters</h2>
        {activeDefaulters.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No active defaulters at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeDefaulters.map(defaulter => (
              <ImageCard
                key={defaulter.id}
                image={defaulter.image}
                itemName={defaulter.item_name || defaulter.itemName}
                endTime={defaulter.end_time || defaulter.endTime}
                amount={defaulter.amount}
                currency={defaulter.currency}
                isExpired={defaulter.is_expired || defaulter.isExpired}
                onReport={() => {
                  setSelectedDefaulter(defaulter);
                  setIsReportModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2025 Blacklist — High-stakes accountability platform
          </p>
        </div>
      </footer>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setSelectedDefaulter(null);
        }}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default PublicHome; 