'use client'
import { fetchPosts } from '@/app/actions/postAction'
import { useQuery } from '@tanstack/react-query'
import { Post } from '@/components/lib/Post'

const Posts = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  if (isLoading) return <p>Loading...</p>
  if (error instanceof Error) return <p>An error occurred: {error.message}</p>

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {data?.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>

            <hr />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Posts
