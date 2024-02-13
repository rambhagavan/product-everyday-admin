// VerificationLinkPage.js
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const VerificationLinkPage = () => {
  const { token } = useParams();

  useEffect(() => {
    // Send a request to your backend to verify the token
    // Update user record in the backend
  }, [token]);

  return (
    <div>
      <p>Verifying your email...</p>
    </div>
  );
};

export default VerificationLinkPage;
