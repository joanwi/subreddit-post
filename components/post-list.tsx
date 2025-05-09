import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Post } from "@/app/actions"

interface PostListProps {
  posts: Post[]
  subreddit?: string
  isLoading?: boolean
}

export function PostList({ posts = [], subreddit, isLoading = false }: PostListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 mt-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-8">
        No posts found. Try searching for a different subreddit.
      </div>
    )
  }

  return (
    <div className="space-y-4 mt-8">
      {subreddit && (
        <div className="text-lg font-semibold mb-2 text-center">
          r/{subreddit}
        </div>
      )}
      {posts.map((post) => (
        <Card key={post.id}>
          <CardContent className="p-4">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-medium hover:underline"
            >
              {post.title}
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 