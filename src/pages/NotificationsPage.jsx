import React from "react";
import { usePost } from "../contexts/PostContext";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Heart, MessageCircle, UserPlus, Check, BellOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "../lib/utils";

const NotificationsPage = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUserById,
    getUnreadNotificationsCount,
  } = usePost();

  const unreadCount = getUnreadNotificationsCount();

  const formatTime = (date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: idLocale,
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5 text-destructive fill-destructive" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-instagram-blue" />;
      case "follow":
        return <UserPlus className="w-5 h-5 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-4 pb-20 md:pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifikasi</h1>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllNotificationsAsRead}
            className="text-primary">
            <Check className="w-4 h-4 mr-1" />
            Tandai semua dibaca
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-1">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const fromUser = getUserById(notification.fromUserId);

            return (
              <div
                key={notification.id}
                onClick={() => markNotificationAsRead(notification.id)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors",
                  notification.read ? "bg-card" : "bg-primary/5",
                )}>
                {/* Avatar with icon */}
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={fromUser?.avatar}
                      alt={fromUser?.username}
                    />
                    <AvatarFallback>
                      {fromUser?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-card rounded-full flex items-center justify-center shadow-sm">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold">{fromUser?.username}</span>{" "}
                    <span className="text-muted-foreground">
                      {notification.message}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>

                {/* Unread indicator */}
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full gradient-instagram"></div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <BellOff className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Belum ada notifikasi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
