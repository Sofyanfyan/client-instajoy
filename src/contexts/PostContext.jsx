import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Post, Comment, Notification, dummyPosts, dummyNotifications, dummyUsers, User } from '@/data/dummyData';
import { useAuth } from './AuthContext';

interface PostContextType {
  posts: Post[];
  notifications: Notification[];
  users: User[];
  addPost: (imageUrl: string, caption: string) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  deletePost: (postId: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  getUnreadNotificationsCount: () => number;
  getUserById: (userId: string) => User | undefined;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(dummyPosts);
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
  const [users, setUsers] = useState<User[]>(dummyUsers);

  useEffect(() => {
    const storedPosts = localStorage.getItem('instaapp_posts');
    if (storedPosts) {
      const parsed = JSON.parse(storedPosts);
      setPosts(parsed.map((p: Post) => ({ ...p, createdAt: new Date(p.createdAt) })));
    }
    
    const storedNotifications = localStorage.getItem('instaapp_notifications');
    if (storedNotifications) {
      const parsed = JSON.parse(storedNotifications);
      setNotifications(parsed.map((n: Notification) => ({ ...n, createdAt: new Date(n.createdAt) })));
    }
    
    const storedUsers = localStorage.getItem('instaapp_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('instaapp_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('instaapp_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addPost = (imageUrl: string, caption: string) => {
    if (!user) return;
    
    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
      imageUrl,
      caption,
      likes: [],
      comments: [],
      createdAt: new Date(),
    };
    
    setPosts(prev => [newPost, ...prev]);
  };

  const likePost = (postId: string) => {
    if (!user) return;
    
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(user.id);
        const newLikes = isLiked 
          ? post.likes.filter(id => id !== user.id)
          : [...post.likes, user.id];
        
        // Add notification if liking someone else's post
        if (!isLiked && post.userId !== user.id) {
          const newNotification: Notification = {
            id: Date.now().toString(),
            type: 'like',
            fromUserId: user.id,
            postId,
            message: 'liked your post',
            read: false,
            createdAt: new Date(),
          };
          setNotifications(prev => [newNotification, ...prev]);
        }
        
        return { ...post, likes: newLikes };
      }
      return post;
    }));
  };

  const addComment = (postId: string, text: string) => {
    if (!user) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      text,
      createdAt: new Date(),
    };
    
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        // Add notification if commenting on someone else's post
        if (post.userId !== user.id) {
          const truncatedText = text.length > 30 ? text.substring(0, 30) + '...' : text;
          const newNotification: Notification = {
            id: Date.now().toString(),
            type: 'comment',
            fromUserId: user.id,
            postId,
            message: `commented: "${truncatedText}"`,
            read: false,
            createdAt: new Date(),
          };
          setNotifications(prev => [newNotification, ...prev]);
        }
        
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));
  };

  const deletePost = (postId: string) => {
    if (!user) return;
    
    setPosts(prev => prev.filter(post => {
      // Only allow deleting own posts
      if (post.id === postId && post.userId === user.id) {
        return false;
      }
      return true;
    }));
  };

  const deleteComment = (postId: string, commentId: string) => {
    if (!user) return;
    
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter(comment => {
            // Only allow deleting own comments or comments on own posts
            if (comment.id === commentId && (comment.userId === user.id || post.userId === user.id)) {
              return false;
            }
            return true;
          }),
        };
      }
      return post;
    }));
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getUnreadNotificationsCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const getUserById = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  return (
    <PostContext.Provider value={{
      posts,
      notifications,
      users,
      addPost,
      likePost,
      addComment,
      deletePost,
      deleteComment,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      getUnreadNotificationsCount,
      getUserById,
    }}>
      {children}
    </PostContext.Provider>
  );
};
