'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  DocumentIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  ArrowUpTrayIcon,
  BookmarkIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

interface Resource {
  id: number;
  title: string;
  type: 'document' | 'video' | 'link' | 'note';
  subject: string;
  uploadedBy: string;
  uploadDate: string;
  size?: string;
  url: string;
  isBookmarked: boolean;
}

interface ResourceFolder {
  id: number;
  name: string;
  resourceCount: number;
  subject: string;
}

export default function ResourcesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [folders, setFolders] = useState<ResourceFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<ResourceFolder | null>(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    type: 'document',
    subject: '',
    url: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      // Simulated API call
      setTimeout(() => {
        setFolders([
          { id: 1, name: 'Mathematics', resourceCount: 12, subject: 'Mathematics' },
          { id: 2, name: 'Physics', resourceCount: 8, subject: 'Physics' },
          { id: 3, name: 'Programming', resourceCount: 15, subject: 'Computer Science' },
        ]);

        setResources([
          {
            id: 1,
            title: 'Calculus Fundamentals',
            type: 'document',
            subject: 'Mathematics',
            uploadedBy: 'John Doe',
            uploadDate: '2024-03-20',
            size: '2.5 MB',
            url: '#',
            isBookmarked: true,
          },
          {
            id: 2,
            title: 'Physics Lab Tutorial',
            type: 'video',
            subject: 'Physics',
            uploadedBy: 'Jane Smith',
            uploadDate: '2024-03-19',
            url: '#',
            isBookmarked: false,
          },
          {
            id: 3,
            title: 'Programming Best Practices',
            type: 'link',
            subject: 'Computer Science',
            uploadedBy: 'Alex Johnson',
            uploadDate: '2024-03-18',
            url: '#',
            isBookmarked: true,
          },
        ]);

        setIsLoading(false);
      }, 1000);
    }
  }, [session]);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated upload
    const newResource: Resource = {
      id: resources.length + 1,
      ...uploadData,
      uploadedBy: session?.user?.name || 'Anonymous',
      uploadDate: new Date().toISOString().split('T')[0],
      isBookmarked: false,
    };
    setResources([...resources, newResource]);
    setShowUploadModal(false);
    setUploadData({
      title: '',
      type: 'document',
      subject: '',
      url: '',
    });
  };

  const toggleBookmark = (resourceId: number) => {
    setResources(resources.map(resource =>
      resource.id === resourceId
        ? { ...resource, isBookmarked: !resource.isBookmarked }
        : resource
    ));
  };

  const filteredResources = resources.filter(resource =>
    (selectedFolder ? resource.subject === selectedFolder.subject : true) &&
    (searchQuery
      ? resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.subject.toLowerCase().includes(searchQuery.toLowerCase())
      : true)
  );

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <DocumentTextIcon className="h-6 w-6" />;
      case 'video':
        return <VideoCameraIcon className="h-6 w-6" />;
      case 'link':
        return <LinkIcon className="h-6 w-6" />;
      default:
        return <DocumentIcon className="h-6 w-6" />;
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading resources...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Resources</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Access and share study materials</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
          Upload Resource
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources by title or subject..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Folders Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Folders</h2>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedFolder(null)}
                className={`w-full text-left px-4 py-2 rounded-md text-sm ${
                  !selectedFolder
                    ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                } transition-colors duration-200`}
              >
                All Resources
              </button>
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder)}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm ${
                    selectedFolder?.id === folder.id
                      ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } transition-colors duration-200`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FolderIcon className="h-5 w-5 mr-2" />
                      {folder.name}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {folder.resourceCount}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${
                        resource.type === 'document'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                          : resource.type === 'video'
                          ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                          : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                      }`}>
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{resource.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{resource.subject}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleBookmark(resource.id)}
                      className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        resource.isBookmarked
                          ? 'text-yellow-500 dark:text-yellow-400'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      <BookmarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <p>Uploaded by {resource.uploadedBy}</p>
                    <p>on {new Date(resource.uploadDate).toLocaleDateString()}</p>
                    {resource.size && <p>Size: {resource.size}</p>}
                  </div>
                  <div className="mt-4">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                      View Resource
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Upload Resource</h3>
                  <form onSubmit={handleUpload} className="mt-6 space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        required
                        value={uploadData.title}
                        onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Type
                      </label>
                      <select
                        id="type"
                        required
                        value={uploadData.type}
                        onChange={(e) => setUploadData({ ...uploadData, type: e.target.value as Resource['type'] })}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white transition-colors duration-200"
                      >
                        <option value="document">Document</option>
                        <option value="video">Video</option>
                        <option value="link">Link</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        required
                        value={uploadData.subject}
                        onChange={(e) => setUploadData({ ...uploadData, subject: e.target.value })}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        URL
                      </label>
                      <input
                        type="url"
                        id="url"
                        required
                        value={uploadData.url}
                        onChange={(e) => setUploadData({ ...uploadData, url: e.target.value })}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white transition-colors duration-200"
                      />
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                      >
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowUploadModal(false)}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 