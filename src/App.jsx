import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import PublicHome from './components/PublicHome';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploadModal from './components/ImageUploadModal';
import ImageCard from './components/ImageCard';
import ReportModal from './components/ReportModal';

const PrivateRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/login" />;
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedDefaulter, setSelectedDefaulter] = useState(null);
  const [items, setItems] = useState([]);

  // Clear localStorage on component mount
  useEffect(() => {
    localStorage.removeItem('defaulters');
  }, []);

  const handleAddItem = (formData) => {
    if (!formData.image) {
      console.error('No image selected');
      return;
    }

    const durationInMs = formData.duration * (
      formData.durationUnit === 'minutes' ? 60 * 1000 :
      formData.durationUnit === 'hours' ? 60 * 60 * 1000 :
      24 * 60 * 60 * 1000
    );
    
    const newItem = {
      id: Date.now(),
      image: formData.imageUrl,
      itemName: formData.itemName,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      endTime: new Date(Date.now() + durationInMs).toISOString()
    };

    setItems(prevItems => [...prevItems, newItem]);
  };

  // Clean up expired items
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = new Date();
      setItems(prevItems => 
        prevItems.map(item => ({
          ...item,
          isExpired: new Date(item.endTime) <= now
        }))
      );
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  const handleReportSubmit = (formData) => {
    // Here you would typically send this data to your backend along with the defaulter info
    console.log('Report submitted:', { ...formData, defaulter: selectedDefaulter });
    alert('Thank you for your report. We will review it shortly.');
    setSelectedDefaulter(null);
  };

  const handleReportClick = (defaulter) => {
    setSelectedDefaulter(defaulter);
    setIsReportModalOpen(true);
  };

  return (
    <AuthProvider>
      <Router basename="/lendlens">
        <div className="min-h-screen bg-secondary">
          <Routes>
            <Route path="/" element={<PublicHome />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>

      <div className="min-h-screen bg-secondary">
        <Header onAddClick={() => setIsModalOpen(true)} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-white mb-8">Active Defaulters</h2>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No active defaulters at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map(item => (
                <ImageCard
                  key={item.id}
                  image={item.image}
                  itemName={item.itemName}
                  endTime={item.endTime}
                  amount={item.amount}
                  currency={item.currency}
                  isExpired={item.isExpired}
                  onReport={() => handleReportClick(item)}
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

        <ImageUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddItem}
        />

        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => {
            setIsReportModalOpen(false);
            setSelectedDefaulter(null);
          }}
          onSubmit={handleReportSubmit}
        />
      </div>
    </AuthProvider>
  );
}

export default App; 