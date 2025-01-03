'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchPost, updatePost } from '@/app/actions/postAction'
import { useTranslations } from 'next-intl'

const EditPost = ({ id }: { id: string }) => {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const t = useTranslations('Post')

  const {
    data: post,
    isLoading: isLoadingPost,
    error: fetchError,
  } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
    enabled: !!id,
  })

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setBody(post.body)
    }
  }, [post])

  const {
    mutate,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      router.push('/')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({ id, post: { id: parseInt(id), title, body } })
  }

  if (isLoadingPost) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-gray-600">
        Loading...
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-red-600">
        Error loading post
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {t('Edit Post')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            {t('Title')}
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter post title"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="body"
            className="block text-sm font-medium text-gray-700"
          >
            {t('Body')}
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
            placeholder="Write your post content here"
            rows={5}
          />
        </div>

        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            disabled={isUpdating}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {t('Cancel')}
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            role="submit-button"
            className={`px-4 py-2 rounded-md text-white font-medium transition-colors
              ${
                isUpdating
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
          >
            {isUpdating ? t('Updating') : t('Update Post')}
          </button>
        </div>

        {isUpdateError && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            Error: {updateError.message}
          </div>
        )}
      </form>
    </div>
  )
}

export default EditPost
