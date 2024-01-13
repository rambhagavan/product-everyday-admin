import React from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
    return (
        <div className="row">
            <div className="col d-flex justify-content-center bg-white p-5 rounded">
                <div className="card" style={{'minHeight':'400px'}}>
                    <div className='card-body'>
                        <h6 className='font-weight-bold'>Product EveryDay</h6>
                        <h5 className="font-weight-bolder">Register</h5>
                        <form action="..." method="..." className="w-400 mw-full">
                            <div className="form-group">
                                <label htmlFor="email" className="small">Email</label>
                                <input type="email" className="form-control form-control-md" id="email" placeholder="email" required="required" />
                                <p className="form-text small">
                                    Only alphanumeric characters and underscores allowed.
                                </p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="small">Name</label>
                                <input type="text" className="form-control form-control-md" id="name" placeholder="name" required="required" />
                                <p className="form-text small">
                                    Must be at least 8 characters long, and contain at least one special character.
                                </p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="small">Phone</label>
                                <input type="text" className="form-control form-control-md" id="name" placeholder="name" required="required" />
                                <p className="form-text small">
                                    Must be a valid Phone No.
                                </p>
                            </div>
                            <input className="btn btn-primary btn-block bg-blue" type="submit" value="Sign up" />
                            <div className="d-flex mb-3">
                                By creating an account, I accept the Terms & Conditions & Privacy Policy
                            </div>
                        </form>
                        <p className="mt-3 mb-0"><Link className="text-primary small" to="/login">Login To your Account ?</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register