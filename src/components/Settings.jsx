import React, { useState } from 'react';

const Settings = () => {
  const [theme, setTheme] = useState('light');
  const [alert, setAlert] = useState(null);
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [password, setPassword] = useState({ current: '', new: '' });

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    setAlert({ type: 'success', message: `Theme switched to ${newTheme}` });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Profile update failed');
      setAlert({ type: 'success', message: 'Profile updated successfully' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(password),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Password update failed');
      setAlert({ type: 'success', message: 'Password changed successfully' });
      setPassword({ current: '', new: '' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      {alert && (
        <div className={`p-3 mb-4 text-center rounded ${alert.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {alert.message}
        </div>
      )}

      {/* Profile Update Form */}
      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">Profile Settings</h2>
        <input type="text" name="name" placeholder="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full border px-3 py-2 rounded" required />
        <input type="email" name="email" placeholder="Email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full border px-3 py-2 rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Save Profile</button>
      </form>

      {/* Password Change Form */}
      <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">Change Password</h2>
        <input type="password" name="current" placeholder="Current Password" value={password.current} onChange={(e) => setPassword({ ...password, current: e.target.value })} className="w-full border px-3 py-2 rounded" required />
        <input type="password" name="new" placeholder="New Password" value={password.new} onChange={(e) => setPassword({ ...password, new: e.target.value })} className="w-full border px-3 py-2 rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Change Password</button>
      </form>

      {/* Theme Toggle */}
      <div className="mt-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Appearance</h2>
        <button onClick={handleThemeToggle} className="bg-gray-600 text-white px-4 py-2 rounded">
          Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>
    </div>
  );
};

export default Settings;
