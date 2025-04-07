import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext(null);

// Mock admin credentials (in a real app, this would be handled by a backend)
const ADMIN_CREDENTIALS = {
  email: 'admin@lendlens.com',
  password: 'admin123'
};

// Mock defaulters data for development
const MOCK_DEFAULTERS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    itemName: 'iPhone 13 Pro',
    amount: 1200,
    currency: 'USD',
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    enabled: true,
    isExpired: false
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    itemName: 'MacBook Pro',
    amount: 2000,
    currency: 'USD',
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    enabled: true,
    isExpired: false
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [defaulters, setDefaulters] = useState([]);
  const [useMockData, setUseMockData] = useState(false);

  // Check if Supabase is properly configured
  useEffect(() => {
    const checkSupabase = async () => {
      try {
        // Try to make a simple query to check if Supabase is working
        const { data, error } = await supabase.from('defaulters').select('count').limit(1);
        if (error) {
          console.error('Supabase error:', error);
          setUseMockData(true);
        } else {
          console.log('Supabase connection successful');
          setUseMockData(false);
        }
      } catch (error) {
        console.error('Supabase connection error:', error);
        setUseMockData(true);
      } finally {
        setLoading(false);
      }
    };

    checkSupabase();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    if (useMockData) {
      // If using mock data, set a mock user
      setUser({
        id: 'mock-user-id',
        email: 'admin@lendlens.com',
        role: 'admin'
      });
      setLoading(false);
      return;
    }

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            role: 'admin'
          });
          console.log('User session found:', session.user.email);
        } else {
          console.log('No user session found');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUseMockData(true);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          role: 'admin'
        });
        console.log('Auth state changed: user logged in', session.user.email);
      } else {
        setUser(null);
        console.log('Auth state changed: user logged out');
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [useMockData]);

  // Listen for defaulters changes
  useEffect(() => {
    if (useMockData) {
      // If using mock data, no need to fetch from Supabase
      return;
    }

    // Fetch defaulters from Supabase regardless of user state
    const fetchDefaulters = async () => {
      try {
        const { data, error } = await supabase
          .from('defaulters')
          .select('*');
        
        if (error) {
          console.error('Error fetching defaulters:', error);
          setUseMockData(true);
          return;
        }
        
        console.log('Fetched defaulters from Supabase:', data);
        setDefaulters(data || []);
      } catch (error) {
        console.error('Error fetching defaulters:', error);
        setUseMockData(true);
      }
    };

    fetchDefaulters();

    // Set up real-time subscription
    const subscription = supabase
      .channel('defaulters_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'defaulters' }, payload => {
        console.log('Change received:', payload);
        fetchDefaulters();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [useMockData]);

  // Clean up expired items
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = new Date();
      setDefaulters(prevDefaulters => 
        prevDefaulters.map(item => ({
          ...item,
          isExpired: new Date(item.endTime) <= now
        }))
      );
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  const login = async (email, password) => {
    if (useMockData) {
      // If using mock data, check against mock credentials
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        setUser({
          id: 'mock-user-id',
          email: ADMIN_CREDENTIALS.email,
          role: 'admin'
        });
        return true;
      }
      return false;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        return false;
      }
      
      console.log('Login successful:', data.user.email);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    if (useMockData) {
      setUser(null);
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addDefaulter = async (formData) => {
    console.log('Adding defaulter with data:', formData);
    
    if (!formData.image) {
      console.error('No image provided');
      throw new Error('Image is required');
    }

    const durationInMs = formData.duration * (
      formData.durationUnit === 'minutes' ? 60 * 1000 :
      formData.durationUnit === 'hours' ? 60 * 60 * 1000 :
      24 * 60 * 60 * 1000
    );
    
    if (useMockData) {
      // If using mock data, add to mock defaulters
      const newDefaulter = {
        id: Date.now(),
        image: URL.createObjectURL(formData.image),
        itemName: formData.itemName,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        endTime: new Date(Date.now() + durationInMs).toISOString(),
        enabled: true,
        isExpired: false
      };
      
      setDefaulters(prevDefaulters => [...prevDefaulters, newDefaulter]);
      return true;
    }
    
    try {
      // Upload image to Supabase Storage
      const file = formData.image;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `defaulters/${fileName}`;
      
      console.log('Uploading image to Supabase Storage:', filePath);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('defaulters')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('defaulters')
        .getPublicUrl(filePath);
      
      console.log('Image uploaded successfully, public URL:', publicUrl);
      
      const newDefaulter = {
        image: publicUrl,
        item_name: formData.itemName,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        end_time: new Date(Date.now() + durationInMs).toISOString(),
        enabled: true,
        is_expired: false,
        created_at: new Date().toISOString()
      };

      console.log('Creating new defaulter in database:', newDefaulter);
      
      // Add to Supabase
      const { data, error } = await supabase
        .from('defaulters')
        .insert([newDefaulter]);
      
      if (error) {
        console.error('Error adding defaulter:', error);
        throw error;
      }
      
      console.log('Defaulter added successfully to database');
      return true;
    } catch (error) {
      console.error('Error adding defaulter:', error);
      throw error;
    }
  };

  const toggleDefaulterStatus = async (id) => {
    if (useMockData) {
      // If using mock data, toggle in mock defaulters
      setDefaulters(prevDefaulters => 
        prevDefaulters.map(defaulter => 
          defaulter.id === id 
            ? { ...defaulter, enabled: !defaulter.enabled } 
            : defaulter
        )
      );
      return;
    }

    try {
      const defaulter = defaulters.find(d => d.id === id);
      
      if (defaulter) {
        console.log('Toggling defaulter status:', id, 'Current status:', defaulter.enabled);
        const { error } = await supabase
          .from('defaulters')
          .update({ enabled: !defaulter.enabled })
          .eq('id', id);
        
        if (error) {
          console.error('Error toggling defaulter status:', error);
          throw error;
        }
        
        console.log('Defaulter status toggled successfully');
      }
    } catch (error) {
      console.error('Error toggling defaulter status:', error);
      throw error;
    }
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