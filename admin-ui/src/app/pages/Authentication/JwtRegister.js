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
import { adminGetCurrentUser, adminLoginService, adminRegisterService, sendVerificationEmail } from '../../services/Auth/AdminAuth';
import { Image } from 'antd';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import { BACKEND_URL, DEV_MODE } from '../../core/constants';

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
  firstName: '',
  lastName: '',
  phone: '',
};

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/


// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be 6 character length')
    .required('Password is required!'),
  firstName: Yup.string()
    .min(2, 'First Name must be 2 character length')
    .required('First Name is required!'),
  lastName: Yup.string()
    .min(2, 'Last Name must be 2 character length')
    .required('Last Name is required!'),
  email: Yup.string().email('Invalid Email address').required('Email is required!'),
  phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Phone Number is required!')
});

const JWTRegister = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  // const { login } = useAuth();

  // const handleFormSubmit = async (credentials) => {
  //   setLoading(true);
  //   const res = await adminLoginService(credentials)
  //   console.log(res)
  //   if (res.status === 200) {
  //     dispatch(showSnackBar({ msg: "Logged In Succesfully", type: "success" }))
  //     localStorage.removeItem('Token')
  //     localStorage.removeItem('User')
  //     localStorage.setItem('Token', JSON.stringify(res?.data?.token));
  //     localStorage.setItem('User', JSON.stringify(res?.data?.user));
  //     navigate('/dashboard')
  //   } else {
  //     dispatch(showSnackBar({ msg: `${res?.msg}`, type: "error" }))
  //   }
  //   setLoading(false);
  // }
  // const [credentials, setCredentials] = useState({
  //   email: '',
  //   password: '',
  //   firstName: '',
  //   lastName: '',
  //   phone: '',
  // });

  const [error, setError] = useState(null);

  // const handleChange = (e) => {
  //   setCredentials({ ...credentials, [e.target.name]: e.target.value });
  // };

  const handleFormSubmit = async (credentials) => {
    // e.preventDefault();
    setLoading(true);
    try {
      const data = await adminRegisterService(credentials);
      localStorage.setItem("User", JSON.stringify(data));
      console.log(data)
      const verificationToken = data.token;

      // Send verification email with the token
      await sendVerificationEmail(credentials.email, verificationToken);

      // Redirect to the verification page
      setLoading(false);
      navigate('/verify');
    } catch (error) {
      setLoading(false);
      setError(error);
    }

  };

  const handleGoogleLogin = () => {
    window.open(`${BACKEND_URL}/auth/google`,"_self");
  };


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
                      sx={{ mb: 1.5 }}
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
                    <TextField InputProps={{ sx: { borderRadius: 0 } }}
                      fullWidth
                      size="small"
                      name="firstName"
                      type="firstName"
                      label="First Name"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.firstName}
                      onChange={handleChange}
                      helperText={touched.firstName && errors.firstName}
                      error={Boolean(errors.firstName && touched.firstName)}
                      sx={{ mb: 1.5 }}
                    />
                    <TextField InputProps={{ sx: { borderRadius: 0 } }}
                      fullWidth
                      size="small"
                      name="lastName"
                      type="lastName"
                      label="Last Name"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.lastName}
                      onChange={handleChange}
                      helperText={touched.lastName && errors.lastName}
                      error={Boolean(errors.lastName && touched.lastName)}
                      sx={{ mb: 1.5 }}
                    />
                    <TextField InputProps={{ sx: { borderRadius: 0 } }}
                      fullWidth
                      size="small"
                      name="phone"
                      type="phone"
                      label="Phone Number"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.phone}
                      onChange={handleChange}
                      helperText={touched.phone && errors.phone}
                      error={Boolean(errors.phone && touched.phone)}
                      sx={{ mb: 1.5 }}
                    />

                    <LoadingButton
                      type="submit"
                      fullWidth
                      color="primary"
                      loading={loading}
                      variant="contained"
                      // className='bg-blue'
                      sx={{ my: 2, borderRadius: '0px' }}

                    >
                      Register
                    </LoadingButton>
                  </form>
                )}
              </Formik>
              {DEV_MODE && <>
                <Paragraph className="text-center">
                  Or
                </Paragraph>
                <LoadingButton
                  type="submit"
                  fullWidth
                  color="error"
                  loading={loading}
                  variant="contained"
                  onClick={()=>handleGoogleLogin()}
                  // className='bg-blue'
                  sx={{ my: 2, borderRadius: '0px' }}

                >
                  <GoogleIcon className='me-2' />  Register with Google
                </LoadingButton>
              </>
              }
              <Paragraph>
                Already have an account?
                <NavLink
                  to="/session/signin"
                  style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                >
                  Sign In
                </NavLink>
              </Paragraph>
            </ContentBox>
          </Grid>
        </Grid>
      </div>
    </JWTRoot>
  );
};

export default JWTRegister;
