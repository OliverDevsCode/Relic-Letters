import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Optional: if using react-router
import { doDeleteUserAccount } from '../../utils/auth';
import { useAuth } from '../../contexts/authContext';

import './LegalPage.css';
import { deleteHouse} from '../../utils/houseDB';
import { deleteUserDoc } from '../../utils/userDB';
import { notifyUserToast } from '../../utils/inAppNotifications';
import LoginCard from '../LoginCard/LoginCard';

const LegalPage = () => {
  const {currentUser,userLoggedIn} = useAuth();
  const [showLogin,setShowLogin] = useState(false);
  const navigate = useNavigate();


  const handleBack = () => {
    window.history.back();
  };

  const initiateDeleteSequence = () => {
    notifyUserToast("Verification Required", "Please re-authenticate to confirm account purging.");
    setShowLogin(true);
  };

  const finalizeAccountDeletion = async() => {
    if(!userLoggedIn){
      return;
    }
    const userId = currentUser?.uid
    try {
      const user = await deleteUserDoc(userId);
      const house = await deleteHouse(userId);
      await doDeleteUserAccount();
      notifyUserToast("Terminal Cleared", "Your profile and houses have been completely removed.");
      navigate('/');
    } catch (error) {
      console.error("error",error);
      notifyUserToast("Error Deleting Account","Contact privacy@relicletters.com");
    }
  };

  

  return (
    <div className='legal-screen-wrapper'>
      {showLogin && (
        <LoginCard 
          onSuccess={() =>{setShowLogin(false)
                        finalizeAccountDeletion()
          }}
        />
      )}
      <div className='legal-container'>
        
        <header className='legal-header'>
          <h1>[ LEGAL_PROTOCOL_DOC_01 ]</h1>
          <h2>TERMS OF USE & OPERATIONAL RULES</h2>
          <div className='terminal-divider'>---------------------------------------</div>
        </header>

        <div className='legal-body-scrollable'>
  
        <section className='legal-section'>
          <h3>1. ACCEPTANCE OF TERMS & AMENDMENTS</h3>
          <p>
            By authenticating an account or interacting with the "Relic Letters" application, hosting network, or subcollection routing systems, you agree to be bound by these Terms of Use and all applicable local privacy laws. If you do not accept these conditions, unauthorized access to the application endpoints is strictly prohibited. We reserve the right to modify these protocols at any time without prior written notice.
          </p>
        </section>

        <section className='legal-section'>
          <h3>2. REGISTRATION, DATA PROTOCOLS & SECURITY</h3>
          <p>
            To utilize transit services, users create account profiles authenticated via Firebase Auth. You are solely responsible for protecting your credentials. While our architecture is locked down securely via custom Firestore Security Rules, you acknowledge that any data uploaded to cloud-hosted databases is transmitted at your own digital risk. We store fundamental identifier components (e.g., User IDs, user-generated street names, message content, and FCM device tokens) purely to execute core mail delivery features.
          </p>
        </section>

        <section className='legal-section'>
          <h3>3. ACCEPTABLE USE & OPEN-SOURCE LICENSE</h3>
          <p>
            This network was established exclusively for good, kindness, and genuine correspondence. Users are strictly barred from deploying unauthorized scripts, tampering with API route paths, intercepting socket networks, or exploiting Firebase database endpoints. 
            <br /><br />
            <strong>Forking Permission:</strong> You are granted a non-exclusive license to fork, modify, and self-host custom instances of this repository for private personal relationships, provided that visible attribution and back-links to the original repository are retained permanently. Commercial redistribution of this software is strictly prohibited.
          </p>
        </section>

        <section className='legal-section'>
          <h3>4. DISCLAIMER OF WARRANTIES ("AS-IS")</h3>
          <p>
            THE SERVICE IS PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. THE DEVELOPER DISCLAIMS ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT GUARANTEE THAT FIREBASE CLOUD STREAM LINKS WILL REMAIN UNINTERRUPTED, COMPLETELY SECURE, ERRORS-FREE, OR TRANSLATED SECURELY BY CARRIER ROUTING LOOPS.
          </p>
        </section>

        <section className='legal-section'>
          <h3>5. LIMITATION OF LIABILITY</h3>
          <p>
            IN NO EVENT SHALL THE ORIGINAL CREATOR, DEVELOPER, OR REPOSITORY OWNER BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. THIS INCLUDES, WITHOUT LIMITATION, LOSS OF PROFITS, DATA ASYNC ERRORS, LOSS OF USE, RECEPTION OF ENCRYPTED/CIPHERED CIPHER SCRIPTS, PROPERTY LOST IN VIRTUAL MAP TRANSIT, OR HARDWARE CRASHES STEMMING FROM EMBEDDED RETRO CSS STYLING OVERLAYS, REGARDLESS OF WHETHER WE WERE ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
          </p>
        </section>

        <section className='legal-section'>
          <h3>6. ACCOUNT TERMINATION RIGHTS</h3>
          <p>
            We reserve the unilateral, unappealable right to instantly revoke database access, clear subcollections, or purge associated Firebase authentication profile records at our sole discretion, without notice or liability, for any breach of these Terms.
          </p>
        </section>

        <section className='legal-section'>
          <h3>7. GOVERNING LAW</h3>
          <p>
            Any legal claims, disputes, or structural challenges arising from the use of this digital infrastructure shall be governed strictly by the laws of your home region, without regard to its conflict of law provisions.
          </p>
        </section>

        {/* --- PRIVACY POLICY SECTION --- */}
        <div className='terminal-divider'>---------------------------------------</div>
        
        <header className='legal-header'>
          <h1>[ LEGAL_PROTOCOL_DOC_02 ]</h1>
          <h2>PRIVACY POLICY & DATA PROTOCOLS</h2>
          <div className='terminal-divider'>---------------------------------------</div>
        </header>

        <section className='legal-section'>
          <h3>1. DATA COLLECTION & STORAGE</h3>
          <p>
            We only collect information that you directly provide to us. Your credentials are managed securely via Firebase Authentication, and your letters or user-generated content are stored within Google Cloud Firestore. We do not track, scrape, or extract any data beyond what you explicitly type into the station interface.
          </p>
        </section>

        <section className='legal-section'>
          <h3>2. COOKIE-FREE TELEMETRY</h3>
          <p>
            We monitor network performance using Vercel Analytics. This system operates entirely without cookies and does not gather, store, or monitor any Personally Identifiable Information (PII) or track your device across alternative network pathways.
          </p>
        </section>

        <section className='legal-section'>
          <h3>3. THIRD-PARTY DISCLOSURE EXCLUSION</h3>
          <p>
            We do not trade, sell, lease, or distribute your correspondence records or identity logs to external advertising or third-party entities. Data is routed purely through our infrastructure providers (Firebase and Vercel) strictly to maintain active terminal applications.
          </p>
        </section>

        <section className='legal-section'>
          <h3>4. DELETION RIGHTS & INQUIRIES</h3>
          <p>
            You maintain absolute control over your digital artifacts. You may update or delete your files at any point via the button below. For overarching data purge inquiries or registry questions, connect directly with our network node at: <strong>privacy@relicletters.com</strong>.
          </p>
        </section>

        {userLoggedIn && (
        <div className='delete-account-wrapper'>
          <button className='delete-account-btn' onClick={initiateDeleteSequence}>
            [ PERMANENTLY_DELETE_ACCOUNT ]
          </button>
        </div>
      )} 

      </div>

        <footer className='legal-footer'>
          <div className='terminal-divider'>---------------------------------------</div>
          <p className='legal-stamp'>AUTHORIZED STATIONERY // RELIC LETTERS 2026</p>
          <button className='legal-back-btn' onClick={()=>{promptLogin()}}>
            [ RETURN_TO_DESK ]
          </button>
        </footer>

      </div>
    </div>
  );
};

export default LegalPage;