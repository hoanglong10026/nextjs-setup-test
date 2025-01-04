'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchPost, updatePost } from '@/app/actions/postAction'
import { useTranslations } from 'next-intl'
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Stack,
  CircularProgress,
} from '@mui/material'

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
      <Box display="flex" justifyContent="center" p={6}>
        <CircularProgress />
      </Box>
    )
  }

  if (fetchError) {
    return (
      <Box maxWidth="md" sx={{ mx: 'auto', p: 3 }}>
        <Alert severity="error">{t('Error loading post')}</Alert>
      </Box>
    )
  }

  return (
    <Box maxWidth="md" sx={{ mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {t('Edit Post')}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label={t('Title')}
              name="title"
              slotProps={{
                htmlInput: {
                  'data-testid': 'title',
                },
              }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
              variant="outlined"
              disabled={isUpdating}
            />

            <TextField
              label={t('Body')}
              name="body"
              slotProps={{
                htmlInput: {
                  'data-testid': 'body',
                },
              }}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              disabled={isUpdating}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                type="button"
                onClick={() => router.push('/')}
                disabled={isUpdating}
                variant="outlined"
                color="inherit"
              >
                {t('Cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                variant="contained"
                color="primary"
                role="submit-button"
              >
                {isUpdating ? t('Updating') : t('Update Post')}
              </Button>
            </Box>
          </Stack>

          {isUpdateError && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {updateError?.message || t('Error updating post')}
            </Alert>
          )}
        </form>
      </Paper>
    </Box>
  )
}

export default EditPost
