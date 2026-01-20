import React, { createContext, useContext, useState, useEffect } from "react";
import { dummyPosts, dummyNotifications, dummyUsers } from "../data/dummyData";
import { useAuth } from "./AuthContext";

const PostContext = createContext(undefined);

//eslint-disable-next-line react-refresh/only-export-components
export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
};

export const PostProvider = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState(dummyPosts);
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [users, setUsers] = useState(dummyUsers);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedPosts = localStorage.getItem("instaapp_posts");
    if (storedPosts) {
      try {
        const parsed = JSON.parse(storedPosts);
        const postsWithDates = parsed.map((p) => ({
          ...p,
          createdAt: new Date(p.createdAt),
        }));
        //eslint-disable-next-line
        setPosts(postsWithDates);
      } catch (e) {
        console.warn("Failed to parse stored posts", e);
      }
    }

    const storedNotifications = localStorage.getItem("instaapp_notifications");
    if (storedNotifications) {
      try {
        const parsed = JSON.parse(storedNotifications);
        const notificationsWithDates = parsed.map((n) => ({
          ...n,
          createdAt: new Date(n.createdAt),
        }));
        setNotifications(notificationsWithDates);
      } catch (e) {
        console.warn("Failed to parse stored notifications", e);
      }
    }

    const storedUsers = localStorage.getItem("instaapp_users");
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (e) {
        console.warn("Failed to parse stored users", e);
      }
    }
  }, []);

  // Save posts to localStorage
  useEffect(() => {
    localStorage.setItem("instaapp_posts", JSON.stringify(posts));
  }, [posts]);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem(
      "instaapp_notifications",
      JSON.stringify(notifications),
    );
  }, [notifications]);

  // Save users to localStorage (opsional, jika kamu mengizinkan perubahan users)
  // useEffect(() => {
  //   localStorage.setItem('instaapp_users', JSON.stringify(users));
  // }, [users]);

  const addPost = (imageUrl, caption) => {
    if (!user) return;

    const newPost = {
      id: Date.now().toString(),
      userId: user.id,
      imageUrl,
      caption,
      likes: [],
      comments: [],
      createdAt: new Date(),
    };

    setPosts((prev) => [newPost, ...prev]);
  };

  const likePost = (postId) => {
    if (!user) return;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = post.likes.includes(user.id);
          const newLikes = isLiked
            ? post.likes.filter((id) => id !== user.id)
            : [...post.likes, user.id];

          // Add notification if liking someone else's post
          if (!isLiked && post.userId !== user.id) {
            const newNotification = {
              id: Date.now().toString(),
              type: "like",
              fromUserId: user.id,
              postId,
              message: "liked your post",
              read: false,
              createdAt: new Date(),
            };
            setNotifications((prevNotif) => [newNotification, ...prevNotif]);
          }

          return { ...post, likes: newLikes };
        }
        return post;
      }),
    );
  };

  const addComment = (postId, text) => {
    if (!user) return;

    const newComment = {
      id: Date.now().toString(),
      userId: user.id,
      text,
      createdAt: new Date(),
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          // Add notification if commenting on someone else's post
          if (post.userId !== user.id) {
            const truncatedText =
              text.length > 30 ? text.substring(0, 30) + "..." : text;
            const newNotification = {
              id: Date.now().toString(),
              type: "comment",
              fromUserId: user.id,
              postId,
              message: `commented: "${truncatedText}"`,
              read: false,
              createdAt: new Date(),
            };
            setNotifications((prevNotif) => [newNotification, ...prevNotif]);
          }

          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      }),
    );
  };

  const deletePost = (postId) => {
    if (!user) return;

    setPosts((prev) =>
      prev.filter((post) => {
        // Only allow deleting own posts
        return !(post.id === postId && post.userId === user.id);
      }),
    );
  };

  const deleteComment = (postId, commentId) => {
    if (!user) return;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const updatedComments = post.comments.filter((comment) => {
            // Allow deletion if it's your comment OR you own the post
            return !(
              comment.id === commentId &&
              (comment.userId === user.id || post.userId === user.id)
            );
          });
          return { ...post, comments: updatedComments };
        }
        return post;
      }),
    );
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getUnreadNotificationsCount = () => {
    return notifications.filter((n) => !n.read).length;
  };

  const getUserById = (userId) => {
    return users.find((u) => u.id === userId);
  };

  return (
    <PostContext.Provider
      value={{
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
