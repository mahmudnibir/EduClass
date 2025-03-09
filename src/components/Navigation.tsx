'use client';

import { Fragment, useEffect, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  SunIcon,
  MoonIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon,
  UserGroupIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Study Groups', href: '/groups', icon: UserGroupIcon },
  { name: 'Resources', href: '/resources', icon: BookOpenIcon },
  { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
  { name: 'AI Assistant', href: '/ai-chat', icon: SparklesIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-16 bg-white dark:bg-gray-900 shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  StudyApp
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Disclosure as="nav" className="bg-white dark:bg-gray-900 shadow">
      {({ open, close }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    StudyApp
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`inline-flex items-center ${
                        pathname === item.href
                          ? 'border-b-2 border-blue-500 text-gray-900 dark:text-white'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
                      } px-1 pt-1 text-sm font-medium`}
                    >
                      {item.icon && (
                        <item.icon className="h-5 w-5 mr-1" />
                      )}
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                <ThemeToggle />
                {session ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        {session.user?.image ? (
                          <Image
                            className="h-8 w-8 rounded-full"
                            src={session.user.image}
                            alt=""
                            width={32}
                            height={32}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                              {session.user?.name?.[0] || session.user?.email?.[0]}
                            </span>
                          </div>
                        )}
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/profile"
                              className={classNames(
                                active ? 'bg-gray-100 dark:bg-gray-700' : '',
                                'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                              )}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => signOut()}
                              className={classNames(
                                active ? 'bg-gray-100 dark:bg-gray-700' : '',
                                'block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <button
                    onClick={() => signIn()}
                    className="rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500"
                  >
                    Sign in
                  </button>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={`block ${
                    pathname === item.href
                      ? 'bg-blue-50 dark:bg-gray-800 text-blue-500'
                      : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white'
                  } px-3 py-2 text-base font-medium`}
                  onClick={() => close()}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pb-3 pt-4">
              {session ? (
                <>
                  <div className="flex items-center px-4">
                    {session.user?.image ? (
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={session.user.image}
                        alt=""
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                          {session.user?.name?.[0] || session.user?.email?.[0]}
                        </span>
                      </div>
                    )}
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                        {session.user?.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {session.user?.email}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <ThemeToggle />
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Disclosure.Button
                      as={Link}
                      href="/profile"
                      className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200"
                      onClick={() => close()}
                    >
                      Your Profile
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      onClick={() => {
                        signOut();
                        close();
                      }}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      Sign out
                    </Disclosure.Button>
                  </div>
                </>
              ) : (
                <div className="mt-3 space-y-1">
                  <Disclosure.Button
                    as="button"
                    onClick={() => {
                      signIn();
                      close();
                    }}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Sign in
                  </Disclosure.Button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
} 