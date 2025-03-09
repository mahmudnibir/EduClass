'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  BellIcon,
  KeyIcon,
  ShieldCheckIcon,
  UserIcon,
  LanguageIcon,
  MoonIcon,
  SunIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import ThemeToggle from '@/components/ThemeToggle';

interface SettingSection {
  title: string;
  icon: any;
  settings: {
    title: string;
    description: string;
    type: 'toggle' | 'select' | 'button';
    action?: () => void;
    options?: { value: string; label: string }[];
  }[];
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');

  // Handle client-side initialization
  useEffect(() => {
    setMounted(true);
  }, []);

  const settingSections: SettingSection[] = [
    {
      title: 'Account',
      icon: UserIcon,
      settings: [
        {
          title: 'Profile Settings',
          description: 'Manage your profile information and preferences',
          type: 'button',
          action: () => console.log('Open profile settings'),
        },
        {
          title: 'Change Password',
          description: 'Update your account password',
          type: 'button',
          action: () => console.log('Open password change'),
        },
        {
          title: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          type: 'button',
          action: () => console.log('Open 2FA settings'),
        },
      ],
    },
    {
      title: 'Notifications',
      icon: BellIcon,
      settings: [
        {
          title: 'Push Notifications',
          description: 'Receive notifications about study reminders and updates',
          type: 'toggle',
          action: () => setNotifications(!notifications),
        },
        {
          title: 'Email Updates',
          description: 'Get email notifications about your study progress',
          type: 'toggle',
          action: () => setEmailUpdates(!emailUpdates),
        },
        {
          title: 'Study Reminders',
          description: 'Set up custom study schedule reminders',
          type: 'button',
          action: () => console.log('Open reminder settings'),
        },
      ],
    },
    {
      title: 'Appearance',
      icon: Cog6ToothIcon,
      settings: [
        {
          title: 'Theme',
          description: 'Choose between light and dark mode',
          type: 'select',
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System' },
          ],
          action: () => console.log('Theme changed'),
        },
        {
          title: 'Language',
          description: 'Select your preferred language',
          type: 'select',
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' },
          ],
          action: () => console.log('Language changed'),
        },
        {
          title: 'Timezone',
          description: 'Set your local timezone',
          type: 'select',
          options: [
            { value: 'UTC', label: 'UTC' },
            { value: 'EST', label: 'Eastern Time' },
            { value: 'PST', label: 'Pacific Time' },
          ],
          action: () => console.log('Timezone changed'),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: ShieldCheckIcon,
      settings: [
        {
          title: 'Privacy Settings',
          description: 'Manage your privacy preferences',
          type: 'button',
          action: () => console.log('Open privacy settings'),
        },
        {
          title: 'Data Export',
          description: 'Export your study data and progress',
          type: 'button',
          action: () => console.log('Open data export'),
        },
        {
          title: 'Account Deletion',
          description: 'Delete your account and all associated data',
          type: 'button',
          action: () => console.log('Open account deletion'),
        },
      ],
    },
    {
      title: 'Study Preferences',
      icon: GlobeAltIcon,
      settings: [
        {
          title: 'Study Goals',
          description: 'Set and track your study goals',
          type: 'button',
          action: () => console.log('Open study goals'),
        },
        {
          title: 'Study Schedule',
          description: 'Customize your study schedule',
          type: 'button',
          action: () => console.log('Open study schedule'),
        },
        {
          title: 'Study Materials',
          description: 'Manage your study materials and resources',
          type: 'button',
          action: () => console.log('Open study materials'),
        },
      ],
    },
  ];

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        <div className="space-y-8">
          {settingSections.map((section) => (
            <div key={section.title} className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <section.icon className="h-5 w-5 text-gray-500" />
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {section.settings.map((setting) => (
                  <div key={setting.title} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{setting.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {setting.description}
                        </p>
                      </div>
                      {setting.type === 'toggle' && (
                        <button
                          onClick={setting.action}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            notifications ? 'bg-blue-500' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              notifications ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      )}
                      {setting.type === 'select' && (
                        <select
                          className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                        >
                          {setting.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      {setting.type === 'button' && (
                        <button
                          onClick={setting.action}
                          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Configure
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 