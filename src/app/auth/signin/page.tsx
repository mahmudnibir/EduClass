'use client';

import { getProviders, signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function SignIn() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect('/');
  }

  const providers = await getProviders();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          {providers &&
            Object.values(providers).map((provider) => (
              <div key={provider.name} className="flex justify-center">
                <button
                  onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                >
                  <img
                    className="h-5 w-5"
                    src={`/${provider.name.toLowerCase()}.svg`}
                    alt={`${provider.name} logo`}
                  />
                  <span>Continue with {provider.name}</span>
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
} 