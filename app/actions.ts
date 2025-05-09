"use server"

export type SortType = "new" | "hot" | "rising" | "top"
export type TimeType = "now" | "today" | "week" | "month" | "year" | "all"

export type Post = {
  id: string
  title: string
  url: string
}

const API_KEY = process.env.RAPIDAPI_KEY
const API_HOST = process.env.RAPIDAPI_HOST

if (!API_KEY || !API_HOST) {
  throw new Error("Missing required environment variables")
}

const timeMap: Record<TimeType, string> = {
  now: "hour",
  today: "day",
  week: "week",
  month: "month",
  year: "year",
  all: "all"
}

export async function fetchPosts(
  subreddit: string,
  sort: SortType,
  time?: TimeType
): Promise<Post[]> {
  let url = ""
  if (sort === "top") {
    const mappedTime = timeMap[time ?? "all"]
    url = `https://reddit34.p.rapidapi.com/getTopPostsBySubreddit?subreddit=${encodeURIComponent(subreddit)}&time=${mappedTime}`
  } else {
    url = `https://reddit34.p.rapidapi.com/getPostsBySubreddit?subreddit=${encodeURIComponent(subreddit)}&sort=${sort}`
  }
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-key": API_KEY as string,
      "x-rapidapi-host": API_HOST as string,
    },
    cache: "no-store"
  })
  if (!res.ok) return []
  const json = await res.json()
  const posts = Array.isArray(json?.data?.posts)
    ? json.data.posts.map((item: any) => ({
        id: item.data?.id || item.data?.name || "",
        title: item.data?.title || "",
        url: item.data?.url || "",
      }))
    : []
  return posts.filter((p: Post) => p.title && p.url)
} 