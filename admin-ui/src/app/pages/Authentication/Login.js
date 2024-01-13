import React, { useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { adminLoginService, adminGetCurrentUser } from '../../services/Auth/AdminAuth'
import { showSnackBar } from '../../redux/actions/snackBarActions';
import { useDispatch } from 'react-redux';


const Login = () => {
  let location = useLocation();
  const navigate = useNavigate()
  const [requestOtp, setrequestOtp] = useState(false)
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const dispatch = useDispatch()
  const handleRequestForOTP = () => {
    setrequestOtp(true)
  }
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(credentials)
    const data = await adminLoginService(credentials)
    console.log(data)
    if (data.success) {
      const userdata = await adminGetCurrentUser(data.data.access, data.data.token_type)
      console.log(userdata)
      if (userdata.success) {
        dispatch(showSnackBar({ msg: "Logged In Succesfully", type: "success" }))
        localStorage.removeItem('Token')
        localStorage.removeItem('User')
        localStorage.setItem('Token', JSON.stringify(data.data));
        localStorage.setItem('User', JSON.stringify(userdata.data));
        navigate('/dashboard')
      }
      else {
        dispatch(showSnackBar({ msg: `${data.exception_reason}`, type: "error" }))
      }
    } else {
      dispatch(showSnackBar({ msg: `${data.exception_reason}`, type: "error" }))
    }
  }
  return (
    <div className='p-5'>
      <div className="row">
        <div className="col d-flex justify-content-center rounded">
          <div className="card bg-white">
            <div className='card-body'>
              {/* <h5 className='font-weight-bold'>Product EveryDay Admin Panel</h5> */}
              <h5 className="font-weight-bolder">Login To Your Account</h5>
              {/* <form> */}
              <div className='form-group mb-3'>
                <label htmlFor="email" className="small">Email</label>
                <input
                  className='form-control form-control-sm'
                  type='email'
                  placeholder='someone@example.com'
                  name='email'
                  value={credentials.email}
                  onChange={onChange}
                  required
                />
              </div>
              <div className='form-group mb-3'>
                <label htmlFor="password" className="small">Password</label>
                <input
                  className='form-control form-control-sm'
                  type='password'
                  placeholder='Password'
                  name='password'
                  value={credentials.password}
                  onChange={onChange}
                  required
                />
              </div>

              <button
                className='btn btn-primary btn-sm button-flex btn-block bg-blue mb-2'
                onClick={handleSubmit}
              >
                Verify and Login
              </button>

              {/* </form> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login