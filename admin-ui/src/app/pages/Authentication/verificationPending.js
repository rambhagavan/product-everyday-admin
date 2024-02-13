import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from 'antd';

const VerificationPending = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <Image src={'/assets/img/logo.jpg'} preview={false} height={100} width={100} />
        <h3 className="mt-3">Verification Pending</h3>
        <p>Your account registration is pending verification.</p>
        <p>
          Please check your email for a verification link. If you haven't received the email, Check your spam. 
        </p>
        
        
         <Link className="text-primary small" to="session/signin"><input className="btn btn-primary btn-block bg-blue" type="submit" value="Proceed" /></Link>
        
      </div>
    </div>
  );
};

export default VerificationPending;
