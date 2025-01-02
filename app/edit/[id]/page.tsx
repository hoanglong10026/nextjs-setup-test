import EditPost from '@/components/EditPost/EditPost';

export default async function EditPostPge({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <EditPost id={id} />;
}