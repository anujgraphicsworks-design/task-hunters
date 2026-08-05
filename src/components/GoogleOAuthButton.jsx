import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

export default function GoogleOAuthButton() {
  const { loginWithGoogle } = useApp();
  const googleBtnRef = useRef(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    // 1. Check if GSI script is already loaded
    if (window.google?.accounts?.id) {
      setSdkLoaded(true);
      return;
    }

    // 2. Load Google GSI SDK dynamically
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setSdkLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!sdkLoaded || !googleBtnRef.current) return;

    // Use user-defined Google Client ID or default helper
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '928471928374-demo_google_oauth_client_id.apps.googleusercontent.com';

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          if (response.credential) {
            await loginWithGoogle(response.credential);
          }
        },
        auto_select: false,
      });

      // Render official secure Google Sign-In button
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: googleBtnRef.current.offsetWidth || 380
      });
    } catch (err) {
      console.error("Failed to initialize Google Sign-In:", err);
    }
  }, [sdkLoaded, loginWithGoogle]);

  return (
    <div className="w-full flex justify-center py-1">
      <div ref={googleBtnRef} className="w-full min-h-[44px]" id="google-signin-button"></div>
    </div>
  );
}
