import React from "react";
import { usePost } from "../contexts/PostContext";
import PostCard from "../components/PostCard";

const HomePage = () => {
  const { posts } = usePost();

  return (
    <div className="max-w-lg mx-auto px-4 py-4 pb-20 md:pb-4">
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Belum ada post. Buat post pertama Anda!
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
