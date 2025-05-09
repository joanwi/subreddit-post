"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { fetchPosts, Post } from "@/app/actions"

type SortType = "new" | "hot" | "rising" | "top"
type TimeType = "now" | "today" | "week" | "month" | "year" | "all"

interface SubredditFormProps {
  onPostsChange: (posts: Post[]) => void
  onLoadingChange: (isLoading: boolean) => void
}

export function SubredditForm({ onPostsChange, onLoadingChange }: SubredditFormProps) {
  const [subreddit, setSubreddit] = useState("")
  const [sort, setSort] = useState<SortType>("hot")
  const [time, setTime] = useState<TimeType>("all")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onLoadingChange(true)
    try {
      const posts = await fetchPosts(subreddit, sort, sort === "top" ? time : undefined)
      onPostsChange(posts)
    } catch (error) {
      console.error("Failed to fetch posts:", error)
      onPostsChange([])
    } finally {
      onLoadingChange(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="subreddit">Subreddit Name</Label>
        <Input
          id="subreddit"
          placeholder="e.g. AskReddit"
          value={subreddit}
          onChange={(e) => setSubreddit(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Sort By</Label>
        <RadioGroup value={sort} onValueChange={(value) => setSort(value as SortType)}>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new">New</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hot" id="hot" />
              <Label htmlFor="hot">Hot</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rising" id="rising" />
              <Label htmlFor="rising">Rising</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="top" id="top" />
              <Label htmlFor="top">Top</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {sort === "top" && (
        <div className="space-y-2">
          <Label htmlFor="time">Time Period</Label>
          <Select value={time} onValueChange={(value) => setTime(value as TimeType)}>
            <SelectTrigger id="time">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="now">Now</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button type="submit" className="w-full">Search Posts</Button>
    </form>
  )
} 