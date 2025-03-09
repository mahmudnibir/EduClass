import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon,
  AcademicCapIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Study Groups',
    description: 'Create or join study groups based on subjects and topics.',
    icon: UserGroupIcon,
  },
  {
    name: 'Real-time Collaboration',
    description: 'Work together with shared whiteboards and document editing.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'Session Scheduling',
    description: 'Plan and organize study sessions with your groups.',
    icon: CalendarIcon,
  },
  {
    name: 'Progress Tracking',
    description: 'Monitor your study time and achievements.',
    icon: AcademicCapIcon,
  },
];

export default function Home() {
  return (
    <div className="bg-white">
      <Navigation />
      
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Study Better, Together
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join a community of learners, collaborate in real-time, and achieve your academic goals with our comprehensive study platform.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/signin"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Study Smarter</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to excel in your studies
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform provides all the tools and features you need to make your study sessions more productive and enjoyable.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
