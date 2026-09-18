import { initDatabase } from './db/init.js'

import { Post } from './db/models/post.js'

import dotenv from 'dotenv'
dotenv.config()

await initDatabase()

const post = new Post({
  title: 'I am your boogie man',
  author: 'Boogie Man',
  contents: 'I am',
  tags: ['frontend'],
})

await post.save()

const posts = await Post.find()
console.log(posts)
