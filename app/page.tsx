"use client"

import { useState, useEffect } from "react"
import { SubredditForm } from "@/components/subreddit-form"
import { PostList } from "@/components/post-list"
import { Post } from "./actions"

type QueryHistory = {
  subreddit: string
  sort: string
  time?: string
  date: string
  posts: Post[]
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [subreddit, setSubreddit] = useState("")
  const [history, setHistory] = useState<QueryHistory[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("queryHistory")
    if (stored) setHistory(JSON.parse(stored))
  }, [])

  const handlePostsChange = (posts: Post[], subredditName: string, sort: string, time?: string) => {
    setPosts(posts)
    setSubreddit(subredditName)
    const newRecord: QueryHistory = {
      subreddit: subredditName,
      sort,
      time,
      date: new Date().toLocaleString(),
      posts
    }
    const newHistory = [newRecord, ...history.filter(h => !(h.subreddit === subredditName && h.sort === sort && h.time === time))].slice(0, 6)
    setHistory(newHistory)
    localStorage.setItem("queryHistory", JSON.stringify(newHistory))
  }

  const handleHistoryClick = (record: QueryHistory) => {
    setPosts(record.posts)
    setSubreddit(record.subreddit)
  }

  return (
    <main className="container mx-auto px-2 py-4 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-8">SubredditPosts</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* 主内容区 */}
        <div className="flex-1">
          <SubredditForm onPostsChange={handlePostsChange} />
          <PostList posts={posts} subreddit={subreddit} />
        </div>
        {/* 右侧历史记录 */}
        <aside className="w-full md:w-80">
          <div className="border rounded-lg p-4 bg-white shadow">
            <div className="text-lg font-semibold mb-3 text-center border-b pb-2">History</div>
            {history.length === 0 && (
              <div className="text-center text-gray-400">No history</div>
            )}
            <div>
              {history.map((item, idx) => (
                <button
                  key={idx}
                  className="block w-full text-left mb-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
                  onClick={() => handleHistoryClick(item)}
                >
                  r/{item.subreddit} {item.sort}{item.sort === "top" && item.time ? `-${item.time}` : ""} {item.date}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
