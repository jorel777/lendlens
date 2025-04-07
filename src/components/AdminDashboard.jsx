import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Users, MessageSquare, Plus } from 'lucide-react';
import ImageUploadModal from './ImageUploadModal';

const AdminDashboard = () => {
  const { logout, user, addDefaulter, defaulters, toggleDefaulterStatus } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('defaulters');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddDefaulter = async (formData) => {
    try {
      console.log('AdminDashboard: Attempting to add defaulter:', formData);
      const success = await addDefaulter(formData);
      if (success) {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('AdminDashboard: Error adding defaulter:', error);
      alert('Failed to add defaulter. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      <div className="bg-secondary-light border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <div className="text-sm text-gray-400">{user.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('defaulters')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                activeTab === 'defaulters'
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Defaulters</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                activeTab === 'reports'
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Reports</span>
            </button>
          </div>
          {activeTab === 'defaulters' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Defaulter</span>
            </button>
          )}
        </div>

        {activeTab === 'defaulters' ? (
          <DefaultersTable 
            defaulters={defaulters} 
            onToggleStatus={toggleDefaulterStatus} 
          />
        ) : (
          <ReportsTable />
        )}
      </div>

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddDefaulter}
      />
    </div>
  );
};

const DefaultersTable = ({ defaulters, onToggleStatus }) => {
  return (
    <div className="bg-secondary-light rounded-lg border border-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {defaulters.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                  No defaulters found
                </td>
              </tr>
            ) : (
              defaulters.map((defaulter) => (
                <tr key={defaulter.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {defaulter.itemName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      defaulter.enabled
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-red-900/50 text-red-400'
                    }`}>
                      {defaulter.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {defaulter.amount} {defaulter.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <button 
                      onClick={() => onToggleStatus(defaulter.id)}
                      className="hover:text-white"
                    >
                      {defaulter.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReportsTable = () => {
  // Mock data - replace with actual data management
  const reports = [];

  return (
    <div className="bg-secondary-light rounded-lg border border-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Message
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {reports.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-400">
                  No reports found
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                    {new Date(report.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {report.contact}
                  </td>
                  <td className="px-6 py-4 text-white">
                    {report.message}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard; 