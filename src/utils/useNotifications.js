import { messaging, db } from './firebaseConfig';
import { getToken } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';

export async function fetchFCMToken(userId) {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    // Register SW and wait until it's fully active
    await navigator.serviceWorker.register('/service-worker.js');
    const registration = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      await setDoc(
        doc(db, 'users', userId),
        { fcmToken: token },
        { merge: true } // ← replaces your manual getDoc/spread pattern
      );
      console.log('FCM token saved:', token);
    }
  } catch (err) {
    console.error('FCM token error', err);
  }
}