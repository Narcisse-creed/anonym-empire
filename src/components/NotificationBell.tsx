import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Notification } from '../types';

interface NotificationBellProps {
  notifications: Notification[];
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ notifications }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // §43: Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative p-2.5 rounded-full bg-[#161616] hover:bg-[#222222] border border-[#D4AF37]/40 text-[#D4AF37] transition-all cursor-pointer shadow-md"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-black animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#101010] border border-[#D4AF37]/30 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Notifications</span>
            <button
              onClick={() => setDropdownOpen(false)}
              className="text-gray-500 hover:text-white text-xs"
            >
              Fermer
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-xs text-gray-500 text-center">Aucune notification</p>
            ) : (
              notifications.slice(0, 10).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 border-b border-gray-800/50 hover:bg-black/40 transition-colors ${
                    !notif.read ? 'bg-[#1A160C]/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm mt-0.5">
                      {notif.type === 'new-collection' && '🆕'}
                      {notif.type === 'back-in-stock' && '🔔'}
                      {notif.type === 'new-product' && '✨'}
                      {notif.type === 'order-update' && '📦'}
                      {notif.type === 'promo' && '🏷️'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{notif.title}</p>
                      <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">{notif.message}</p>
                      <span className="text-[9px] text-gray-600 font-mono mt-1 block">
                        {new Date(notif.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};