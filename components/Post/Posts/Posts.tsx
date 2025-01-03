'use client'
import { fetchPosts } from '@/app/actions/postAction'
import { useQuery } from '@tanstack/react-query'
import { Post } from '@/components/lib/Post'
import Link from 'next/link'

const Posts = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error instanceof Error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <p className="font-medium">Error loading posts</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
        <Link
          href="/add"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Post
        </Link>
      </div>

      <div className="space-y-6">
        {data?.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 flex-grow">
                  <Link
                    href={`/posts/${post.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
              </div>
              <p className="text-gray-600 mt-2 line-clamp-3">{post.body}</p>
              <div className="mt-4 flex justify-end">
                <Link
                  href={`/edit/${post.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Edit →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {data?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No posts found.</p>
          <p className="text-gray-500 mt-2">
            Create your first post to get started!
          </p>
        </div>
      )}
    </div>
  )
}

export default Posts
