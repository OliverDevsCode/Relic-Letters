import React from 'react';
import { useNavigate } from 'react-router-dom'; // Optional: if using react-router
import './LegalPage.css';

const LegalPage = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className='legal-screen-wrapper'>
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

      </div>

        <footer className='legal-footer'>
          <div className='terminal-divider'>---------------------------------------</div>
          <p className='legal-stamp'>AUTHORIZED STATIONERY // RELIC LETTERS 2026</p>
          <button className='legal-back-btn' onClick={handleBack}>
            [ RETURN_TO_DESK ]
          </button>
        </footer>

      </div>
    </div>
  );
};

export default LegalPage;