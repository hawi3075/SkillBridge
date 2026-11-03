import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Bell, CheckCheck, CheckCircle2 } from 'lucide-react';

export const NotificationsPage = () => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationApi.getNotifications();
      if (res.success) {
        setNotifications(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      showToast('Error marking notification', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      showToast('All notifications marked as read', 'success');
    } catch (err) {
      showToast('Error updating notifications', 'error');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Notifications</h4>
          <span className="text-muted small">Stay updated on exchange proposals, scheduled sessions, and reviews.</span>
        </div>

        {notifications.some(n => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
          >
            <CheckCheck size={16} />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      <div className="sb-card bg-white p-0 overflow-hidden">
        {loading ? (
          <div className="p-4">
            <LoadingSkeleton count={4} type="table" />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="All caught up!"
            description="You have no notifications right now. Activity on your exchange requests and sessions will appear here."
          />
        ) : (
          <div className="list-group list-group-flush">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`list-group-item p-3 d-flex justify-content-between align-items-start gap-3 ${n.isRead ? 'bg-white' : 'bg-light'}`}
              >
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="fw-bold text-dark small">{n.title}</span>
                    {!n.isRead && (
                      <span className="badge bg-primary" style={{ fontSize: '0.65rem' }}>New</span>
                    )}
                  </div>
                  <p className="text-muted small mb-1" style={{ fontSize: '0.85rem' }}>
                    {n.message}
                  </p>
                  <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  {n.link && (
                    <Link to={n.link} className="btn btn-sm btn-link p-0 text-decoration-none small">
                      View
                    </Link>
                  )}
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="btn btn-sm btn-light border py-1 px-2"
                      title="Mark read"
                    >
                      <CheckCircle2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
