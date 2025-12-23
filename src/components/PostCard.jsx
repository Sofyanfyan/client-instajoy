import React, { useState } from "react";
import { usePost } from "../contexts/PostContext";
import { useAuth } from "../contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Trash2,
  Send,
} from "lucide-react";
import { cn } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const PostCard = ({ post }) => {
  const { likePost, addComment, deletePost, deleteComment, getUserById } =
    usePost();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const postUser = getUserById(post.userId);
  const isLiked = user ? post.likes.includes(user.id) : false;
  const isOwnPost = user?.id === post.userId;

  const handleLike = () => {
    setIsLikeAnimating(true);
    likePost(post.id);
    setTimeout(() => setIsLikeAnimating(false), 300);
  };

  const handleDoubleClick = () => {
    if (!isLiked) {
      handleLike();
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(post.id, commentText.trim());
      setCommentText("");
    }
  };

  const formatTime = (date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: idLocale,
    });
  };

  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="story-ring">
            <Avatar className="w-10 h-10 ring-2 ring-card">
              <AvatarImage src={postUser?.avatar} alt={postUser?.username} />
              <AvatarFallback>
                {postUser?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="font-semibold text-sm">{postUser?.username}</p>
            <p className="text-xs text-muted-foreground">
              {formatTime(post.createdAt)}
            </p>
          </div>
        </div>

        {isOwnPost && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => deletePost(post.id)}
                className="text-destructive focus:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Image */}
      <div
        className="relative aspect-square bg-muted cursor-pointer"
        onDoubleClick={handleDoubleClick}>
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="w-full h-full object-cover"
        />
        {isLikeAnimating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart className="w-24 h-24 text-destructive fill-destructive animate-like drop-shadow-lg" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="transition-transform hover:scale-110 active:scale-95">
              <Heart
                className={cn(
                  "w-7 h-7 transition-colors",
                  isLiked
                    ? "text-destructive fill-destructive"
                    : "text-foreground",
                )}
              />
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="transition-transform hover:scale-110 active:scale-95">
              <MessageCircle className="w-7 h-7" />
            </button>
            <button className="transition-transform hover:scale-110 active:scale-95">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="transition-transform hover:scale-110 active:scale-95">
            <Bookmark className={cn("w-7 h-7", isSaved && "fill-foreground")} />
          </button>
        </div>

        {/* Likes */}
        <p className="font-semibold text-sm mb-2">{post.likes.length} suka</p>

        {/* Caption */}
        <p className="text-sm">
          <span className="font-semibold mr-2">{postUser?.username}</span>
          {post.caption}
        </p>

        {/* Comments Preview */}
        {post.comments.length > 0 && !showComments && (
          <button
            onClick={() => setShowComments(true)}
            className="text-sm text-muted-foreground mt-2 hover:text-foreground transition-colors">
            Lihat {post.comments.length} komentar
          </button>
        )}

        {/* Comments */}
        {showComments && (
          <div className="mt-3 space-y-2 animate-slide-up">
            {post.comments.map((comment) => {
              const commentUser = getUserById(comment.userId);
              const canDelete = user?.id === comment.userId || isOwnPost;

              return (
                <div key={comment.id} className="flex items-start gap-2 group">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={commentUser?.avatar} />
                    <AvatarFallback>
                      {commentUser?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold mr-1">
                        {commentUser?.username}
                      </span>
                      {comment.text}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(comment.createdAt)}
                    </p>
                  </div>
                  {canDelete && (
                    <button
                      onClick={() => deleteComment(post.id, comment.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add Comment */}
        <form
          onSubmit={handleComment}
          className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Input
            type="text"
            placeholder="Tambahkan komentar..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 h-9 border-0 bg-transparent focus-visible:ring-0 px-0"
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            disabled={!commentText.trim()}
            className="text-primary font-semibold disabled:opacity-50">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </article>
  );
};

export default PostCard;
