import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from 'antd';
import { Box, Grid, styled } from '@mui/material';

const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

const ContentBox = styled(Box)(() => ({
  height: '90%',
  width: '400px',
  padding: '50px',
  position: 'relative',
  background: 'rgba(0, 0, 0, 0.01)'
}));

const JWTRoot = styled(JustifyBox)(() => ({
  background: 'white',
  minHeight: '100% !important',
  '& .card': {
    maxWidth: 800,
    minHeight: 300,
    margin: '1rem',
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center'
  }
}));

const VerificationPending = () => {
  return (
    <JWTRoot>
      <Grid container>
        <Grid item sm={12} xs={12}>
          <ContentBox>
            <div className="text-center mb-5">
              <Image src={'/assets/img/logo.jpg'} preview={false} height={100} width={100} />
            </div>
            <div className="d-flex justify-content-center align-items-center vh-100">
              <div className="text-center">
                <h3 className="mt-3">Verification Pending</h3>
                <p>Your account registration is pending verification.</p>
                <p>
                  Please check your email for a verification link. If you haven't received the email, Check your spam.
                </p>


                <Link className="text-primary small" to="session/signin"><input className="btn btn-primary btn-block bg-blue" type="submit" value="Proceed" /></Link>

              </div>
            </div>
          </ContentBox>
        </Grid>
      </Grid>
    </JWTRoot>
  );
};

export default VerificationPending;