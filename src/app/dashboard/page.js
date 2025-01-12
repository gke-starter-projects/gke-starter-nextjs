import {
  Box, Card, CardContent, TextField, Button, Typography, Avatar,
} from '@mui/material';
import { revalidatePath } from 'next/cache';
import { verifyJwtToken } from '../utils/jwt-serverside';
import query from '../../db';

// Mark the server action explicitly
const postTweet = async (formData) => {
  'use server';

  const content = formData.get('content');
  const { userId } = await verifyJwtToken();

  const insertTweetQuery = `
    INSERT INTO tweets (user_id, content)
    VALUES ($1, $2)
    RETURNING id
  `;

  await query(insertTweetQuery, [userId, content]);
  revalidatePath('/dashboard');
};

// Server action to fetch tweets with user information
async function getTweets() {
  'use server';

  const tweetsQuery = `
    SELECT t.id, t.content, t.created_at,
           u.username, u.id as user_id
    FROM tweets t
    JOIN users u ON t.user_id = u.id
    ORDER BY t.created_at DESC
  `;
  const tweets = await query(tweetsQuery);
  return tweets.rows;
}

export default async function DashboardPage() {
  const tweets = await getTweets();

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Post a Tweet
          </Typography>
          <form action={postTweet}>
            <TextField
              name="content"
              multiline
              rows={3}
              fullWidth
              placeholder="What's happening?"
              inputProps={{ maxLength: 280 }}
              sx={{ marginBottom: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Tweet
            </Button>
          </form>
        </CardContent>
      </Card>

      {tweets.map((tweet) => (
        <Card key={tweet.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
              <Avatar sx={{ marginRight: 1 }}>
                {tweet.username[0].toUpperCase()}
              </Avatar>
              <Typography variant="subtitle1">
                @
                {tweet.username}
              </Typography>
              <Typography variant="caption" sx={{ marginLeft: 1 }}>
                {new Date(tweet.created_at).toLocaleString()}
              </Typography>
            </Box>
            <Typography variant="body1">
              {tweet.content}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
