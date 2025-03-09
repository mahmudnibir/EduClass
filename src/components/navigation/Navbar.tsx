'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import {
  HomeIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  QuestionMarkCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useLoading } from '@/contexts/LoadingContext';
import Image from 'next/image';
import '@/styles/cursor.css';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { setIsLoading } = useLoading();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Chat', href: '/chat', icon: ChatBubbleLeftIcon },
    { name: 'Groups', href: '/groups', icon: UserGroupIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  const profileMenu = [
    { name: 'Profile', href: '/profile', icon: UserIcon },
    { name: 'Help', href: '/help', icon: QuestionMarkCircleIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  const handleNavigation = (href: string) => {
    setIsLoading(true);
    router.push(href);
    setIsProfileOpen(false);
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ redirect: true, callbackUrl: '/auth/signin' });
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={() => handleNavigation('/')}
                className="text-xl font-bold text-gray-900 dark:text-white hover-lift cursor-pointer"
              >
                EduClass
              </button>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 cursor-pointer hover-lift ${
                      isActive
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 cursor-pointer hover-lift"
              >
                {session?.user?.image ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 card-hover">
                  {session ? (
                    <>
                      <div className="px-4 py-2 border-b dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      {profileMenu.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleNavigation(item.href)}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.name}
                        </button>
                      ))}
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleNavigation('/auth/signin')}
                      className="w-full flex items-center px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                      Sign in
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="icon-hover cursor-pointer inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNavigation(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 text-base font-medium cursor-pointer hover-lift ${
                    isActive
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/50 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
} 