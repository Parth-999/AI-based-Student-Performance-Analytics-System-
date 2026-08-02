import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import api from "../services/api";
import {
  User,
  Building,
  Moon,
  Sun,
  Bell,
  Lock,
  Globe,
  Save,
  CheckCircle2,
  Sliders
} from 'lucide-react';

export const SettingsPage = () => {
  const { currentUser, darkMode, toggleDarkMode } = useApp();
  const { addToast } = useToast();

  const [profile, setProfile] = useState({
    name: currentUser.name,
    email: currentUser.email,
    title: currentUser.title || 'Senior Associate Professor',
    department: currentUser.department || 'Computer Science'
  });

  const [institute, setInstitute] = useState({
    name: "",
    accreditation: "",
    academicYear: "",
    attendanceThreshold: 75,
    flaskApiEndpoint: ""
});

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: true,
    aiRiskAlerts: true,
    weeklyDigest: false
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirmPass: ''
  });

  const loadSettings = async () => {
    try {
        const response = await api.get("/Settings");

        const data = response.data;

        setInstitute({
            name: data.instituteName,
            accreditation: data.accreditationGrade,
            academicYear: data.academicYear,
            attendanceThreshold: data.lowAttendanceThreshold,
            flaskApiEndpoint: data.flaskApiEndpoint
        });

    } catch (err) {
        console.error("Unable to load settings.", err);
    }
};

useEffect(() => {
    loadSettings();
}, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    addToast('Profile Updated', 'Your faculty profile settings have been saved.', 'success');
  };

  const handleSaveInstitute = async (e) => {
    e.preventDefault();

    try {

        await api.post("/Settings", {

            instituteName: institute.name,

            accreditationGrade: institute.accreditation,

            academicYear: institute.academicYear,

            lowAttendanceThreshold: institute.attendanceThreshold,

            flaskApiEndpoint: institute.flaskApiEndpoint

        });

        addToast(
            "Settings Saved",
            "Institutional configuration updated successfully.",
            "success"
        );

    } catch (err) {

        addToast(
            "Save Failed",
            "Unable to save settings.",
            "error"
        );

        console.error(err);
    }
};

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirmPass) {
      addToast('Password Mismatch', 'New password and confirmation do not match.', 'warning');
      return;
    }
    addToast('Password Changed', 'Your security password has been updated successfully.', 'success');
    setPasswords({ current: '', newPass: '', confirmPass: '' });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          System & Faculty Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure profile details, institutional thresholds, theme preferences, and notification channels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Faculty Profile & Theme */}
        <div className="md:col-span-6 space-y-6">
          {/* Profile Form */}
          <div className="saas-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <User className="w-4 h-4 text-primary-600" /> Faculty Profile Details
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Institutional Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Academic Title</label>
                  <input
                    type="text"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-600/20 flex items-center gap-1.5 transition-all mt-2"
              >
                <Save className="w-3.5 h-3.5" /> Save Profile Changes
              </button>
            </form>
          </div>

          {/* Theme & Visuals Card */}
          <div className="saas-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sun className="w-4 h-4 text-amber-500" /> Interface Visual Theme
            </h3>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-white">Dark Mode Toggle</p>
                <p className="text-[11px] text-slate-500">Switch between light corporate theme and high-contrast dark theme</p>
              </div>

              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs"
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Institute Info & Security */}
        <div className="md:col-span-6 space-y-6">
          {/* Institute Settings */}
          <div className="saas-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Building className="w-4 h-4 text-emerald-600" /> Institutional & Threshold Config
            </h3>

            <form onSubmit={handleSaveInstitute} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Institute Name</label>
                <input
                  type="text"
                  value={institute.name}
                  onChange={(e) => setInstitute({ ...institute, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Accreditation</label>
                  <input
                    type="text"
                    value={institute.accreditation}
                    onChange={(e) => setInstitute({ ...institute, accreditation: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Low Attendance Threshold (%)</label>
                  <input
                    type="number"
                    value={institute.attendanceThreshold}
                    onChange={(e) => setInstitute({ ...institute, attendanceThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Year
                </label>

                <input
                  type="text"
                  value={institute.academicYear}
                  onChange={(e) =>
                    setInstitute({
                      ...institute,
                      academicYear: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Flask ML API Endpoint
                </label>

                <input
                  type="text"
                  value={institute.flaskApiEndpoint}
                  onChange={(e) =>
                    setInstitute({
                      ...institute,
                      flaskApiEndpoint: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all mt-2"
              >
                <Save className="w-3.5 h-3.5" /> Save Institutional Config
              </button>
            </form>
          </div>

          {/* Password Change Card */}
          <div className="saas-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Lock className="w-4 h-4 text-red-500" /> Security & Password Update
            </h3>

            <form onSubmit={handlePasswordReset} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwords.newPass}
                    onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwords.confirmPass}
                    onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/20 flex items-center gap-1.5 transition-all mt-2"
              >
                <Lock className="w-3.5 h-3.5" /> Update Password
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
