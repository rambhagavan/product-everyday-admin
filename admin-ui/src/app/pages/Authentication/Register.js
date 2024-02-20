import React, { useState } from 'react';
import { Image } from 'antd';
import { sendVerificationEmail, adminRegisterService } from '../../services/Auth/AdminAuth';
import { BACKEND_URL, headersConfig } from '../../core/constants'
//import {image} from `../../../../public/assets/images/browsers/glogo.webp`
// new register
import {
  Link,
  useNavigate,
} from 'react-router-dom';


// for google auth redirect page
const handleGoogleLogin = () => {
    window.open(`${BACKEND_URL}/auth/google`,"_self");
  };

const Register = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await adminRegisterService(credentials);
      localStorage.setItem("User",JSON.stringify(data));
      console.log(data)
     const verificationToken = data.token;

      // Send verification email with the token
     await sendVerificationEmail(credentials.email, verificationToken);

      // Redirect to the verification page
       navigate('/verify');
    } catch (error) {
      setError(error);
    }
  };


    
    return (

        <div>
              <div className="text-center mb-5 mt-5">
                  <Image src={'/assets/img/logo.jpg'} preview={false} height={100} width={100}/>
             </div>
       
       
        <div className="row">
            <div className="col d-flex justify-content-center bg-white p-5 rounded">
                <div className="card" style={{'minHeight':'400px'}}>
                    <div className='card-body'>
                       
                        <form action="..." method="..." className="w-400 mw-full" onSubmit={handleSubmit} >
                            <div className="form-group">
                                <label htmlFor="email" className="small">Email</label>
                                <input onChange={handleChange} type="email" name='email' className="form-control form-control-md" id="email" placeholder="email" required="required" />
                                <p className="form-text small">
                                    Only alphanumeric characters and underscores allowed.
                                </p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="text" className="small">FirstName</label>
                                <input onChange={handleChange} type="text" name='firstName' className="form-control form-control-md" id="name" placeholder="name" required="required" />
                                <p className="form-text small">
                                    {/* Must be at least 8 characters long, and contain at least one special character. */}
                                </p>
                            </div>
                             {/* my added code */}
                            <div className="form-group">
                                <label htmlFor="password" className="small">LastName</label>
                                <input onChange={handleChange} type="text" name='lastName'  className="form-control form-control-md" id="name" placeholder="name" required="required" />
                                <p className="form-text small">
                                    {/* Must be at least 8 characters long, and contain at least one special character. */}
                                </p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="text" className="small">Phone</label>
                                <input onChange={handleChange} type="text" name='phone' className="form-control form-control-md" id="name" placeholder="phone no." required="required" />
                                <p className="form-text small">
                                    Must be a valid Phone No.
                                </p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="small">Password</label>
                                <input onChange={handleChange} type="password" name='password' className="form-control form-control-md" id="password" placeholder="password" required="required" />
                                <p className="form-text small">
                                    Must be at least 8 characters long, and contain at least one special character.
                                </p>
                            </div>
                            <input className="btn btn-primary btn-block bg-blue" type="submit" value="Sign up" />
                            <h6 className='d-flex justify-content-center mt-1 md-1'>Or</h6>
                        
                            {/* <div className="loginButton google" onClick={google}>
                                 <img src="../assets/images.browsers/glogo.webp" alt="" className="icon"/>
                                 Google
                                 </div> */}
                           
                        </form>
                        <input className="btn btn-primary btn-block bg-red" onClick={handleGoogleLogin} img src="/images/browsers/glogo.webp"  type="submit" value="Google" />
                        <div className="d-flex mt-3 mb-3">
                                By creating an account, I accept the Terms & Conditions & Privacy Policy
                            </div>

                        <p className="mt-3 mb-0"><Link className="text-primary small" to="/login">Login To your Account ?</Link></p>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Register


