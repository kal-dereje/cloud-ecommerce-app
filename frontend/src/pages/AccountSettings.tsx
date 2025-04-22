import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import API from '../api';
import { userAtom } from '../atoms/userAtoms';
import { User } from '../types/types';

const AccountSettings: React.FC = () => {
  const [user, setUser] = useAtom(userAtom);
  const [form, setForm] = useState({
    email: user?.email || '',
    fullName: user?.fullName || '',
    language: user?.preferences?.language || 'en',
    preferredCategory: user?.preferences?.preferredCategory || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        email: user.email,
        fullName: user.fullName,
        language: user.preferences.language,
        preferredCategory: user.preferences.preferredCategory,
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      setError('No user logged in.');
      return;
    }
    if (!form.email || !form.fullName) {
      setError('Email and full name are required.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await API.put<User>(`/users/${user.userId}`, {
        email: form.email,
        fullName: form.fullName,
        preferences: {
          language: form.language,
          preferredCategory: form.preferredCategory,
        },
      });
      setUser(updated.data);
      setSuccess('Settings updated successfully.');
    } catch (e) {
      console.error('Failed to update settings:', e);
      setError('Failed to update settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-xl animate-fade-in max-w-lg mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Account Settings</h2>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded animate-pulse">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded animate-pulse">
          {success}
        </div>
      )}
      <div className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-all duration-200"
            placeholder="Enter your full name"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-all duration-200"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            id="language"
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-all duration-200"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            {/* Add more languages as needed */}
          </select>
        </div>
        <div>
          <label htmlFor="preferredCategory" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Category
          </label>
          <input
            id="preferredCategory"
            type="text"
            value={form.preferredCategory}
            onChange={(e) => setForm({ ...form, preferredCategory: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-all duration-200"
            placeholder="e.g., Electronics, Clothing"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={loading || !form.email || !form.fullName}
          className="w-full py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          aria-label="Save account settings"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;