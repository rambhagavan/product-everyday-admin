import { LoadingButton } from '@mui/lab';
import { Card, Checkbox, Grid, TextField } from '@mui/material';
import { Box, styled, useTheme } from '@mui/material';
import { Paragraph, H6 } from '../../components/Core/Typography';
// import useAuth from 'app/hooks/useAuth';
import { Formik } from 'formik';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { showSnackBar } from '../../redux/actions/snackBarActions';
import { useDispatch } from 'react-redux';
import { adminGetCurrentUser, adminLoginService } from '../../services/Auth/AdminAuth';
import { Image } from 'antd';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';

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

// inital login credentials
const initialValues = {
  email: '',
  password: '',
  remember: false
};

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be 6 character length')
    .required('Password is required!'),
  email: Yup.string().email('Invalid Email address').required('Email is required!')
});

const JwtLogin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  // const { login } = useAuth();

  const handleFormSubmit = async (credentials) => {
    setLoading(true);
    const res = await adminLoginService(credentials)
    console.log(res)
    if (res.status === 200) {
      dispatch(showSnackBar({ msg: "Logged In Succesfully", type: "success" }))
      localStorage.removeItem('Token')
      localStorage.removeItem('User')
      localStorage.setItem('Token', JSON.stringify(res?.data?.token));
      localStorage.setItem('User', JSON.stringify(res?.data?.user));
      navigate('/dashboard')
    } else {
      dispatch(showSnackBar({ msg: `${res?.msg}`, type: "error" }))
    }
    setLoading(false);
  }

  return (
    <JWTRoot>
      <div>
        <Grid container>
          <Grid item sm={12} xs={12}>
            <ContentBox>
              <div className="text-center mb-5">
                <Image src={'/assets/img/logo.jpg'} preview={false} height={100} width={100} />
              </div>
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField InputProps={{ sx: { borderRadius: 0 } }}
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />

                    <TextField InputProps={{ sx: { borderRadius: 0 } }}
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 1.5 }}
                    />

                    <FlexBox justifyContent="space-between">
                      <FlexBox gap={1}>

                      </FlexBox>

                      <NavLink
                        to="/session/forgot-password"
                        style={{ color: theme.palette.primary.main }}
                      >
                        Forgot password?
                      </NavLink>
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      fullWidth
                      color="primary"
                      loading={loading}
                      variant="contained"
                      // className='bg-blue'
                      sx={{ my: 2 , borderRadius:'0px'}}

                    >
                      Login
                    </LoadingButton>
                    <Paragraph>
                      Don't have an account?
                      <NavLink
                        to="/session/signup"
                        style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                      >
                        Register
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </div>
    </JWTRoot>
  );
};

export default JwtLogin;
