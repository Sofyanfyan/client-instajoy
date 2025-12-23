// Dummy Users
export const dummyUsers = [
  {
    id: "1",
    username: "johndoe",
    email: "john@example.com",
    password: "password123",
    fullName: "John Doe",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "📸 Photography enthusiast | 🌍 Traveler | ☕ Coffee lover",
    followers: 1234,
    following: 567,
    posts: 42,
  },
  {
    id: "2",
    username: "janedoe",
    email: "jane@example.com",
    password: "password123",
    fullName: "Jane Doe",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    bio: "🎨 Artist | 🌸 Nature lover | ✨ Dreamer",
    followers: 5678,
    following: 321,
    posts: 89,
  },
  {
    id: "3",
    username: "mikebrown",
    email: "mike@example.com",
    password: "password123",
    fullName: "Mike Brown",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    bio: "🏋️ Fitness | 🍕 Foodie | 🎮 Gamer",
    followers: 890,
    following: 445,
    posts: 67,
  },
  {
    id: "4",
    username: "sarahwilson",
    email: "sarah@example.com",
    password: "password123",
    fullName: "Sarah Wilson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "🌺 Fashion blogger | 💄 Beauty tips | 🛍️ Shopaholic",
    followers: 12500,
    following: 890,
    posts: 234,
  },
  {
    id: "5",
    username: "alexchen",
    email: "alex@example.com",
    password: "password123",
    fullName: "Alex Chen",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "💻 Developer | 🎵 Music producer | 🚀 Startup founder",
    followers: 3456,
    following: 234,
    posts: 56,
  },
];

// Dummy Posts
export const dummyPosts = [
  {
    id: "1",
    userId: "2",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
    caption:
      "Morning vibes at the mountains 🏔️ Nothing beats waking up to this view! #nature #travel #adventure",
    likes: ["1", "3", "4", "5"],
    comments: [
      {
        id: "c1",
        userId: "1",
        text: "Stunning view! Where is this?",
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        id: "c2",
        userId: "3",
        text: "Absolutely breathtaking! 😍",
        createdAt: new Date(Date.now() - 1800000),
      },
    ],
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: "2",
    userId: "4",
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&fit=crop",
    caption:
      "New collection drop! 💃 What do you think of this outfit? #fashion #style #ootd",
    likes: ["1", "2", "3"],
    comments: [
      {
        id: "c3",
        userId: "2",
        text: "Love this look! 🔥",
        createdAt: new Date(Date.now() - 5400000),
      },
    ],
    createdAt: new Date(Date.now() - 14400000),
  },
  {
    id: "3",
    userId: "1",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop",
    caption:
      "Sunday brunch done right 🍳☕ Best way to start the day! #food #brunch #yummy",
    likes: ["2", "4", "5"],
    comments: [
      {
        id: "c4",
        userId: "4",
        text: "That looks delicious! 😋",
        createdAt: new Date(Date.now() - 10800000),
      },
      {
        id: "c5",
        userId: "5",
        text: "Where is this place?",
        createdAt: new Date(Date.now() - 9000000),
      },
    ],
    createdAt: new Date(Date.now() - 21600000),
  },
  {
    id: "4",
    userId: "5",
    imageUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=600&fit=crop",
    caption:
      "Late night coding session 💻 Building something amazing! #developer #coding #startup",
    likes: ["1", "2", "3", "4"],
    comments: [
      {
        id: "c6",
        userId: "1",
        text: "What are you working on?",
        createdAt: new Date(Date.now() - 28800000),
      },
    ],
    createdAt: new Date(Date.now() - 43200000),
  },
  {
    id: "5",
    userId: "3",
    imageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop",
    caption:
      "No pain, no gain! 💪 Push yourself beyond your limits. #fitness #gym #motivation",
    likes: ["1", "5"],
    comments: [],
    createdAt: new Date(Date.now() - 86400000),
  },
];

// Dummy Notifications
export const dummyNotifications = [
  {
    id: "n1",
    type: "like",
    fromUserId: "2",
    postId: "3",
    message: "liked your post",
    read: false,
    createdAt: new Date(Date.now() - 300000),
  },
  {
    id: "n2",
    type: "comment",
    fromUserId: "4",
    postId: "3",
    message: 'commented: "That looks delicious!"',
    read: false,
    createdAt: new Date(Date.now() - 600000),
  },
  {
    id: "n3",
    type: "follow",
    fromUserId: "5",
    message: "started following you",
    read: true,
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: "n4",
    type: "like",
    fromUserId: "3",
    postId: "3",
    message: "liked your post",
    read: true,
    createdAt: new Date(Date.now() - 7200000),
  },
];
