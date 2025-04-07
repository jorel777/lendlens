import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';

const AuthContext = createContext(null);

// Mock admin credentials (in a real app, this would be handled by a backend)
const ADMIN_CREDENTIALS = {
  email: 'admin@lendlens.com',
  password: 'admin123'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [defaulters, setDefaulters] = useState([]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser({
          uid: user.uid,
          email: user.email,
          role: 'admin' // In a real app, you'd store roles in Firestore
        });
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen for defaulters changes
  useEffect(() => {
    if (!user) return;

    const defaultersRef = collection(db, 'defaulters');
    const q = query(defaultersRef);
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const defaultersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched defaulters from Firestore:', defaultersData);
      setDefaulters(defaultersData);
    });

    return () => unsubscribe();
  }, [user]);

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
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addDefaulter = async (formData) => {
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
    
    try {
      // Upload image to Firebase Storage
      const imageFile = formData.image;
      const storageRef = ref(storage, `defaulters/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);
      
      const newDefaulter = {
        image: imageUrl,
        itemName: formData.itemName,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        endTime: new Date(Date.now() + durationInMs).toISOString(),
        enabled: true,
        isExpired: false,
        createdAt: new Date().toISOString()
      };

      console.log('Creating new defaulter:', newDefaulter);
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, 'defaulters'), newDefaulter);
      console.log('Defaulter added with ID:', docRef.id);
      
      return true;
    } catch (error) {
      console.error('Error adding defaulter:', error);
      throw error;
    }
  };

  const toggleDefaulterStatus = async (id) => {
    try {
      const defaulterRef = doc(db, 'defaulters', id);
      const defaulter = defaulters.find(d => d.id === id);
      
      if (defaulter) {
        await updateDoc(defaulterRef, {
          enabled: !defaulter.enabled
        });
        console.log('Toggled defaulter status:', id);
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