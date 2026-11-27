import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { io } from "socket.io-client";
import api from "../services/api";

const SocketContext = createContext(null);

const SOCKET_URL = "http://localhost:5000";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get("/notifications");

      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error(
        "Failed to fetch notifications:",
        error.response?.data?.message || error.message,
      );
    }
  }, []);

  useEffect(() => {
    // The admin app stores its session separately from the customer app.
    const token = localStorage.getItem("admin_token");

    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const socketInstance = io(SOCKET_URL, {
      auth: { token },
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Admin Socket connected:", socketInstance.id);
      setIsConnected(true);
      fetchNotifications();
    });

    socketInstance.on("disconnect", () => {
      console.log("Admin Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Admin Socket error:", error.message);
      setIsConnected(false);
    });

    socketInstance.on("notification:new", (notification) => {
      console.log("Admin notification received:", notification);

      // Admin notifications currently don't include an _id.
      if (!notification._id) {
        fetchNotifications();
        return;
      }

      setNotifications((previous) => {
        if (previous.some((item) => item._id === notification._id)) {
          return previous;
        }

        return [notification, ...previous];
      });

      if (!notification.isRead) {
        setUnreadCount((previous) => previous + 1);
      }
    });

    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );

      setUnreadCount((previous) => Math.max(0, previous - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        unreadCount,
        isConnected,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used inside SocketProvider");
  }

  return context;
};
