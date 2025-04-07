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
      <Router>
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
          
          <Header onAddClick={() => setIsModalOpen(true)} />
        </div>
      </Router>

      {isModalOpen && (
        <ImageUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddItem}
        />
      )}

      {isReportModalOpen && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => {
            setIsReportModalOpen(false);
            setSelectedDefaulter(null);
          }}
          onSubmit={handleReportSubmit}
        />
      )}
    </AuthProvider>
  );
}

export default App; 