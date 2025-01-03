'use client'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '@/app/actions/postAction'

const AddPost = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const queryClient = useQueryClient()

  const {
    mutate,
    isPending: isLoading,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // Invalidate and refetch posts after successful mutation
      queryClient.invalidateQueries({ queryKey: ['posts'] })

      // Clear form
      setTitle('')
      setBody('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Trigger the mutation to create a new post
    mutate({ title, body })

    // Clear the form after submission
    setTitle('')
    setBody('')
  }

  return (
    <div>
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="body">Body:</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {isError && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {isSuccess && (
        <p style={{ color: 'green' }}>Post created successfully!</p>
      )}
    </div>
  )
}

export default AddPost
