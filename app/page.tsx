"use client"

import { useState } from "react"
import { SubredditForm } from "@/components/subreddit-form"
import { PostList } from "@/components/post-list"
import { Post } from "./actions"

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">SubredditPosts</h1>
      <SubredditForm onPostsChange={setPosts} onLoadingChange={setIsLoading} />
      <PostList posts={posts} isLoading={isLoading} />
    </main>
  )
}
