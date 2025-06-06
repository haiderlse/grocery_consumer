
import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold text-panda-text mb-4">Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-panda-text-light">User-specific application settings like notification preferences, language, etc., will appear here.</p>
        <p className="mt-4 text-sm">Content coming soon...</p>
      </div>
    </div>
  );
};

export default SettingsPage;