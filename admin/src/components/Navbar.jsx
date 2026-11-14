import { useState } from "react";
import { FiUser, FiBell, FiCheck } from "react-icons/fi";
import { useSocket } from "../context/SocketContext";

const Navbar = ({ collapsed }) => {
  const {
    notifications = [],
    unreadCount = 0,
    markAsRead,
    markAllAsRead,
  } = useSocket();

  const [showNotifications, setShowNotifications] = useState(false);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead && notification._id) {
      await markAsRead(notification._id);
    }
  };

  return (
    <header
      className={`fixed top-0 ${
        collapsed ? "md:left-20" : "md:left-64"
      } left-0 right-0 h-16 bg-dark/70 backdrop-blur-2xl border-b border-white/[0.08] shadow-lg shadow-black/20 flex items-center justify-between px-4 md:px-8 z-30 transition-all duration-300 ease-in-out`}
    >
      {" "}
      {/* Soft glowing accent line */}
      <span className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      {/* Title */}
      <div className="hidden sm:flex items-center gap-3">
        <span className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-accent" />

        <h2 className="font-display text-lg font-semibold tracking-tight text-white">
          Dashboard
        </h2>
      </div>
      {/* Right Actions */}
      <div className="ml-auto flex items-center gap-3">
        {/* Notification Section */}
        <div className="relative">
          {/* Bell Button */}
          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-all duration-300 hover:border-primary/30 hover:bg-white/10 hover:text-white"
            aria-label="Notifications"
          >
            <FiBell size={19} />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-dark bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <>
              {/* Outside click overlay */}
              <button
                type="button"
                aria-label="Close notifications"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setShowNotifications(false)}
              />

              <div className="absolute right-0 top-12 z-50 w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-dark shadow-2xl shadow-black/40 sm:w-[380px]">
                {/* Dropdown Header */}
                <div className="flex items-center justify-between border-b border-white/10 p-4">
                  <div>
                    <h3 className="font-semibold text-white">Notifications</h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {unreadCount} unread notifications
                    </p>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="flex items-center gap-1 text-xs text-primary transition-colors hover:text-white"
                    >
                      <FiCheck size={14} />
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="max-h-[380px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center">
                      <FiBell className="mx-auto mb-3 text-3xl text-gray-600" />

                      <p className="text-sm text-gray-400">
                        No notifications yet
                      </p>

                      <p className="mt-1 text-xs text-gray-600">
                        New order alerts will appear here
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        type="button"
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`flex w-full items-start gap-3 border-b border-white/5 p-4 text-left transition-colors hover:bg-white/5 ${
                          !notification.isRead ? "bg-primary/5" : ""
                        }`}
                      >
                        {/* Icon */}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <FiBell size={17} />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-semibold text-white">
                              {notification.title}
                            </h4>

                            {!notification.isRead && (
                              <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                            )}
                          </div>

                          <p className="mt-1 text-xs leading-relaxed text-gray-400">
                            {notification.message}
                          </p>

                          <p className="mt-2 text-[11px] text-gray-600">
                            {notification.createdAt
                              ? new Date(
                                  notification.createdAt,
                                ).toLocaleString()
                              : "Just now"}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Pill */}
        <div className="group flex items-center gap-3 ml-auto pl-1.5 pr-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all duration-300 cursor-pointer">
          <div className="relative">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg shadow-primary/30 ring-2 ring-white/10 group-hover:ring-primary/40 transition-all duration-300">
              <FiUser className="text-white" size={16} />
            </div>

            {/* Online dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-dark" />
          </div>

          <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
