import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import { getNotifications,deleteNotification } from '../../utils/userDB';
import './NotificationBox.css';
import { notifyUserToast } from '../../utils/inAppNotifications';
// Removed the broken Firebase map import

const NotificationBox = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const { currentUser } = useAuth();

  // Added currentUser to the dependency array so it fires once the user loads
  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.uid;
      fetchNotifications(userId);
    }
  }, [currentUser]); 

  const handleDeleteNotification = async (id) => {
  const success = await deleteNotification(id, currentUser.uid);
  if (success) {
    setNotifications(prev => prev.filter(notif => notif.notificationId !== id));
  } else {
    notifyUserToast("Oops that didn't work","Please try again!");
  }
};

  async function fetchNotifications(userId) {
    try {
      const fetchedNotifications = await getNotifications(userId);
      if (fetchedNotifications) {
        setNotifications(fetchedNotifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '---';
    
    let date;
    if (typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp); // Fallback for ISO strings or numbers
    }

    return date.toLocaleDateString('en-UK', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).toUpperCase() + ' @ ' + date.toLocaleTimeString('en-UK', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className='notification-box'>
      <button className='close-btn' onClick={onClose}>X</button>
      <h3>Notifications</h3>
      
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((notification) => (
          <div className='notification-view' key={notification.notificationId}>
            <p>{notification.title}</p>
            <p>{formatTimestamp(notification.createdAt)}</p>
            <button onClick={() => handleDeleteNotification(notification.notificationId)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationBox;