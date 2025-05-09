"use client"

import { useState } from "react"
import { fetchPosts, Post } from "@/app/actions"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface SubredditFormProps {
  onPostsChange: (posts: Post[], subreddit: string, sort: string, time?: string) => void
}

export function SubredditForm({ onPostsChange }: SubredditFormProps) {
  const [subreddit, setSubreddit] = useState("")
  const [sort, setSort] = useState("hot")
  const [time, setTime] = useState("all")

  async function handleSubmit(formData: FormData) {
    const posts = await fetchPosts(formData)
    onPostsChange(posts, subreddit, sort, sort === "top" ? time : undefined)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="subreddit">Subreddit Name</Label>
        <Input
          id="subreddit"
          name="subreddit"
          placeholder="e.g. AskReddit"
          value={subreddit}
          onChange={e => setSubreddit(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Sort By</Label>
        <RadioGroup
          name="sort"
          value={sort}
          onValueChange={setSort}
        >
          <div className="flex flex-wrap gap-4">
            {["new", "hot", "rising", "top"].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {sort === "top" && (
        <div className="space-y-2">
          <Label htmlFor="time">Time Period</Label>
          <Select name="time" value={time} onValueChange={setTime}>
            <SelectTrigger id="time">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              {["now", "today", "week", "month", "year", "all"].map((option) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button type="submit" className="w-full">Search Posts</Button>
    </form>

  )
} 