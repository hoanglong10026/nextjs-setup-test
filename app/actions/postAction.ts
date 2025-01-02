import { Post } from '@/components/lib/Post';
import axios from 'axios';

export const fetchPosts = async (): Promise<Post[]> => {
  const { data } = await axios.get(
    'https://jsonplaceholder.typicode.com/posts'
  );
  return data;
};

export const fetchPost = async (id: string): Promise<Post> => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  return data;
};

export const createPost = async (newPost: Post) => {
  const { data } = await axios.post(
    'https://jsonplaceholder.typicode.com/posts',
    newPost
  );
  return data;
};

export const updatePost = async ({
  id,
  post,
}: {
  id: string;
  post: Partial<Post>;
}) => {
  const { data } = await axios.put(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    post
  );
  return data;
};
