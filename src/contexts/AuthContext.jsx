import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock admin credentials (in a real app, this would be handled by a backend)
const ADMIN_CREDENTIALS = {
  email: 'admin@lendlens.com',
  password: 'admin123'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [defaulters, setDefaulters] = useState(() => {
    try {
      const savedDefaulters = localStorage.getItem('lendlens_defaulters');
      return savedDefaulters ? JSON.parse(savedDefaulters) : [];
    } catch (error) {
      console.error('Error loading defaulters from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('lendlens_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Save defaulters to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('lendlens_defaulters', JSON.stringify(defaulters));
      console.log('Saved defaulters to localStorage:', defaulters);
    } catch (error) {
      console.error('Error saving defaulters to localStorage:', error);
    }
  }, [defaulters]);

  // Clean up expired items
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = new Date();
      setDefaulters(prevDefaulters => {
        const updated = prevDefaulters.map(item => ({
          ...item,
          isExpired: new Date(item.endTime) <= now
        }));
        console.log('Updated defaulters with expiration:', updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  const login = (email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const userData = { email, role: 'admin' };
      setUser(userData);
      localStorage.setItem('lendlens_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lendlens_user');
  };

  const addDefaulter = (formData) => {
    console.log('Adding defaulter with data:', formData);
    
    if (!formData.imageUrl) {
      console.error('No image URL provided');
      throw new Error('Image is required');
    }

    const durationInMs = formData.duration * (
      formData.durationUnit === 'minutes' ? 60 * 1000 :
      formData.durationUnit === 'hours' ? 60 * 60 * 1000 :
      24 * 60 * 60 * 1000
    );
    
    const newDefaulter = {
      id: Date.now().toString(),
      image: formData.imageUrl,
      itemName: formData.itemName,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      endTime: new Date(Date.now() + durationInMs).toISOString(),
      enabled: true,
      isExpired: false,
      createdAt: new Date().toISOString()
    };

    console.log('Creating new defaulter:', newDefaulter);
    
    try {
      setDefaulters(prevDefaulters => {
        const updated = [...prevDefaulters, newDefaulter];
        console.log('Updated defaulters list:', updated);
        return updated;
      });
      return true;
    } catch (error) {
      console.error('Error adding defaulter:', error);
      throw error;
    }
  };

  const toggleDefaulterStatus = (id) => {
    setDefaulters(prevDefaulters => {
      const updated = prevDefaulters.map(defaulter => 
        defaulter.id === id 
          ? { ...defaulter, enabled: !defaulter.enabled }
          : defaulter
      );
      console.log('Toggled defaulter status:', updated);
      return updated;
    });
  };

  const value = {
    user,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    loading,
    defaulters,
    addDefaulter,
    toggleDefaulterStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 