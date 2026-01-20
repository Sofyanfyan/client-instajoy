import React, { useState } from "react";
import { usePost } from "../contexts/PostContext";
import PostCard from "../components/PostCard";
import { Input } from "../components/ui/input";
import { Search, TrendingUp } from "lucide-react";

const ExplorePage = () => {
  const { posts, users } = usePost();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) => {
    const postUser = users.find((u) => u.id === post.userId);
    const searchLower = searchQuery.toLowerCase();
    return (
      post.caption.toLowerCase().includes(searchLower) ||
      (postUser?.username &&
        postUser.username.toLowerCase().includes(searchLower)) ||
      (postUser?.fullName &&
        postUser.fullName.toLowerCase().includes(searchLower))
    );
  });

  const trendingHashtags = [
    "travel",
    "food",
    "fashion",
    "fitness",
    "coding",
    "nature",
    "photography",
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-4 pb-20 md:pb-4">
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cari post, username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12"
        />
      </div>

      {/* Trending Hashtags */}
      {!searchQuery && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Trending</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingHashtags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(`#${tag}`)}
                className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors">
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid View for no search */}
      {!searchQuery && (
        <div className="grid grid-cols-3 gap-1 mb-6">
          {posts.slice(0, 9).map((post) => (
            <div
              key={post.id}
              className="aspect-square bg-muted overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Tidak ada hasil untuk "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
