import { PlusCircle, AlertCircle, ChevronDown } from 'lucide-react';

const Header = ({ onAddClick }) => {
  return (
    <header className="bg-secondary">
      <div className="border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-6 h-6 text-danger" />
              <h1 className="text-2xl font-bold text-white">BLACKLIST</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onAddClick}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Add defaulter</span>
              </button>
              <button className="btn-secondary">Sign up</button>
            </div>
          </div>
        </div>
      </div>
      <div className="py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-white">Repay your loans </span>
          <span className="text-danger">or be exposed</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          Blacklist adds social pressure to loan repayments. Defaulters' photos remain
          blurred until the countdown ends. Repay on time or risk being revealed.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="btn-primary">Register as lender</button>
          <button className="btn-secondary">Learn more</button>
        </div>
        <div className="mt-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-danger bg-opacity-20 text-danger">
            <span className="mr-1">•</span> High stakes accountability
          </span>
        </div>
        <div className="mt-12">
          <ChevronDown className="w-6 h-6 text-danger mx-auto animate-bounce" />
        </div>
      </div>
    </header>
  );
};

export default Header; 