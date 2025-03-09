'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  CameraIcon,
  KeyIcon,
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  location: string;
  language: string;
  image: string | null;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    emailVisibility: boolean;
    activityVisibility: boolean;
  };
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    bio: '',
    location: '',
    language: 'English',
    image: null,
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisibility: 'public',
      emailVisibility: true,
      activityVisibility: true,
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user) {
      setProfileData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image || null,
      }));
      fetchProfileData();
    }
  }, [session, status, router]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) throw new Error('Failed to fetch profile data');
      const data = await response.json();
      
      setProfileData(prev => ({
        ...prev,
        ...data.user,
        bio: data.user.bio || '',
        location: data.user.location || '',
        language: data.user.language || 'English',
        notifications: data.user.notifications || {
          email: true,
          push: true,
          sms: false,
        },
        privacy: data.user.privacy || {
          profileVisibility: 'public',
          emailVisibility: true,
          activityVisibility: true,
        },
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const data = await response.json();
      if (data.url) {
        setProfileData(prev => ({
          ...prev,
          image: data.url,
        }));
        await update({ image: data.url });
        toast.success('Profile picture updated!');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const data = await response.json();
      setProfileData(prev => ({
        ...prev,
        ...data.user,
      }));
      setIsEditing(false);
      await update({
        ...session,
        user: {
          ...session?.user,
          name: profileData.name,
          image: profileData.image,
        },
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <LoadingOverlay isLoading={isSaving} message="Saving changes..." />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="absolute -bottom-12 left-8">
              <div className="relative w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-700">
                {isUploading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <LoadingSpinner size="sm" variant="secondary" />
                  </div>
                ) : (
                  <>
                    {profileData.image ? (
                      <Image
                        src={profileData.image}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="w-full h-full text-gray-400" />
                    )}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <CameraIcon className="h-6 w-6 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-16 px-8 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    profileData.name || 'Your Name'
                  )}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {profileData.email}
                </p>
              </div>
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                disabled={isSaving}
                className="button-hover px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" variant="secondary" />
                    <span className="ml-2">Saving...</span>
                  </div>
                ) : isEditing ? (
                  'Save Changes'
                ) : (
                  'Edit Profile'
                )}
              </button>
            </div>

            {/* Profile Sections */}
            <div className="space-y-8">
              {/* Basic Information */}
              <section>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, bio: e.target.value }))
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        placeholder="Your location"
                      />
                      <MapPinIcon className="absolute left-3 top-[13px] h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Preferences */}
              <section>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <GlobeAltIcon className="h-5 w-5 mr-2 text-gray-400" />
                  Preferences
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Language
                    </span>
                    <select
                      value={profileData.language}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          language: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Notifications */}
              <section>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <BellIcon className="h-5 w-5 mr-2 text-gray-400" />
                  Notifications
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Email Notifications
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.notifications.email}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              email: e.target.checked,
                            },
                          }))
                        }
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 ${
                          !isEditing && 'opacity-60 cursor-not-allowed'
                        }`}
                      ></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Push Notifications
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.notifications.push}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              push: e.target.checked,
                            },
                          }))
                        }
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 ${
                          !isEditing && 'opacity-60 cursor-not-allowed'
                        }`}
                      ></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      SMS Notifications
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.notifications.sms}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              sms: e.target.checked,
                            },
                          }))
                        }
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 ${
                          !isEditing && 'opacity-60 cursor-not-allowed'
                        }`}
                      ></div>
                    </label>
                  </div>
                </div>
              </section>

              {/* Privacy */}
              <section>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-2 text-gray-400" />
                  Privacy
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Profile Visibility
                    </span>
                    <select
                      value={profileData.privacy.profileVisibility}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          privacy: {
                            ...prev.privacy,
                            profileVisibility: e.target.value as 'public' | 'private' | 'friends',
                          },
                        }))
                      }
                      disabled={!isEditing}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Show Email
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.privacy.emailVisibility}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            privacy: {
                              ...prev.privacy,
                              emailVisibility: e.target.checked,
                            },
                          }))
                        }
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 ${
                          !isEditing && 'opacity-60 cursor-not-allowed'
                        }`}
                      ></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Show Activity Status
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.privacy.activityVisibility}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            privacy: {
                              ...prev.privacy,
                              activityVisibility: e.target.checked,
                            },
                          }))
                        }
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 ${
                          !isEditing && 'opacity-60 cursor-not-allowed'
                        }`}
                      ></div>
                    </label>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
} 