'use client'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '@/app/actions/postAction'
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Stack,
} from '@mui/material'

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
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setTitle('')
      setBody('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({ title, body })
  }

  return (
    <Box maxWidth="md" sx={{ mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Create New Post
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
              variant="outlined"
              slotProps={{
                htmlInput: {
                  'data-testid': 'title',
                },
              }}
            />

            <TextField
              label="Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              slotProps={{
                htmlInput: {
                  'data-testid': 'body',
                },
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{ mt: 2 }}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </Button>
            </Box>
          </Stack>
        </form>

        {isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error: {error.message}
          </Alert>
        )}

        {isSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Post created successfully!
          </Alert>
        )}
      </Paper>
    </Box>
  )
}

export default AddPost
