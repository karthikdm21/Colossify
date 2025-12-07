'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useInvestorStore } from '@/lib/investorStore';
import { Card } from '../ui/Card';
import { getNotifications, markNotificationRead } from '@/lib/mockInvestorApi';

export function NotificationBell() {
    const { currentUser, notifications, unreadCount, setNotifications, markNotificationRead: markRead } = useInvestorStore();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [currentUser.id]);

    const loadNotifications = async () => {
        const notifs = await getNotifications(currentUser.id);
        setNotifications(notifs);
    };

    const handleMarkRead = async (id: string) => {
        await markNotificationRead(id);
        markRead(id);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-muted/20 transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <Card className="absolute right-0 top-12 w-96 max-h-[500px] overflow-y-auto z-50 p-4 shadow-2xl">
                        <h3 className="font-semibold mb-4">Notifications</h3>
                        {notifications.length === 0 ? (
                            <p className="text-sm text-muted text-center py-8">No notifications</p>
                        ) : (
                            <div className="space-y-2">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => !notif.read && handleMarkRead(notif.id)}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors ${notif.read ? 'bg-background' : 'bg-accent/10 hover:bg-accent/20'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{notif.title}</div>
                                                <div className="text-xs text-muted mt-1">{notif.message}</div>
                                                <div className="text-xs text-muted mt-2">
                                                    {new Date(notif.createdAt).toLocaleDateString()} at{' '}
                                                    {new Date(notif.createdAt).toLocaleTimeString()}
                                                </div>
                                            </div>
                                            {!notif.read && (
                                                <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-1" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </>
            )}
        </div>
    );
}
