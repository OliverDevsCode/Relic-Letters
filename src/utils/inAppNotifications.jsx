import { Toaster, toast } from 'react-hot-toast';
import './toastCSS/letterTheme.css';

function LetterToast({title, message}){
  return (
    <div className="letter-toast">
      <div className="toast-text">
        {/* Background is cleanly mapped via CSS class setup now */}
        <h4 className="toast-title">{title}</h4>
        <p className="toast-message">{message}</p>
      </div>
    </div>
  );
}

function attemptToast({ title, message, promise }) {
  return toast.promise(
    promise,
    {
      loading: (
        <div className="letter-toast animate-fade-in">
          <div className="toast-text">
            <h4 className="toast-title">{title} Status</h4>
            <p className="toast-message" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img 
                src="/toastGifs/processing.gif" 
                alt="Loading" 
                style={{ width: '20px', height: '20px' }} 
              />
              Any minute meow...
            </p>
          </div>
        </div>
      ),

      success: (data) => (
        <div className="letter-toast">
          <div className="toast-text">
            <h4 className="toast-title">{title}</h4>
            <p className="toast-message">{message}</p>
          </div>
        </div>
      ),

      error: (err) => (
        <div className="letter-toast" style={{ borderColor: '#8b0000' }}> {/* Slight red tint alternative for errors */}
          <div className="toast-text">
            <h4 className="toast-title" style={{ color: '#8b0000' }}>{title}: Failed</h4>
            <p className="toast-message">{err.message || err || 'Carrier lost en route.'}</p>
          </div>
        </div>
      )
    },
    {
      style: {
        background: 'none',
        border: 'none',
        padding: 0,
        boxShadow: 'none',
      },
      success: { icon: null },
      error: { icon: null },
      loading: { icon: null }
    }
  );
}

function showLoginNotificationToast({ count, soundUrl }) {
  if (count <= 0) return;

  // Play sound if provided
  if (soundUrl) {
    const audio = new Audio(soundUrl);
    audio.volume = 0.6;
    audio.play().catch((err) => {
      console.warn('Audio playback failed:', err);
    });
  }

  toast.custom(
    <LetterToast
      title="New Mail"
      message={`You have ${count} new letters awaiting!${count > 1 ? 's' : ''}`}
    />,
    {
      duration: 3000,
    }
  );
}

function notifyUserToast(title,message){
  toast.custom(
    <LetterToast
      title={title}
      message={message}
    />,
    {
      duration: 3000,
    }
  );
}

function showToast(message) {

  console.log("Trying to display toast")

  const content = message.notification;

  // const audioPath = message.data.sound


  // // Play Special sound
  // const audio = new Audio(audioPath); 
  // audio.volume = 0.6; 
  // audio.play().catch((err) => {
  //   console.warn('Audio playback failed:', err);
  // });


  toast.custom(<LetterToast title={content.title} message={content.body}/>, {
    duration: 3000,
  });
}

export {showToast,Toaster,attemptToast,showLoginNotificationToast,notifyUserToast};