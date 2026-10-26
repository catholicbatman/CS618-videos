import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Header } from '../components/Header.jsx'
import { Post } from '../components/Post.jsx'
import { getPostById } from '../api/posts.js'
import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
import { postTrackEvent } from '../api/events.js'
import { PostStats } from '../components/PostStats.jsx'

export function ViewPost({ postId }) {
  const [session, setSession] = useState()
  const trackEventMutation = useMutation({
    mutationFn: (action) => postTrackEvent({ postId, action, session }),
    onSuccess: (data) => setSession(data?.session),
  })
  useEffect(() => {
    let timeout = setTimeout(() => {
      trackEventMutation.mutate('startView')
      timeout = null
    }, 1000)
    return () => {
      if (timeout) clearTimeout(timeout)
      else trackEventMutation.mutate('endView')
    }
  }, [])

  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  })
  const post = postQuery.data
  return (
    <div style={{ padding: 8 }}>
      {post && (
        <Helmet>
          <title>{post.title} | Full-Stack React Blog</title>
        </Helmet>
      )}
      <Header />
      <br />
      <hr />
      <Link to='/'>Back to main page</Link>
      <br />
      <hr />
      {post ? (
        <div>
          <Post {...post} fullPost />
          <hr /> <PostStats postId={postId} />
        </div>
      ) : (
        `Post with id${postId} not found.`
      )}
    </div>
  )
}
ViewPost.propTypes = {
  postId: PropTypes.string.isRequired,
}
