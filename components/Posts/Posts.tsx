'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
interface Post {
  id: number;
  title: string;
  body: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data } = await axios.get(
    'https://jsonplaceholder.typicode.com/posts'
  );
  return data;
};

const Posts = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error instanceof Error) return <p>An error occurred: {error.message}</p>;

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {data?.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
