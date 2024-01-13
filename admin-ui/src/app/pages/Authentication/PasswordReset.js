import React from 'react'

const PasswordReset = () => {
  return (
    <div className="row">
    <div id="login-block" className="col offset-1 offset-sm-2 offset-md-3 offset-lg-0  d-flex justify-content-center bg-white p-5 rounded">
        <div className="p-20">
            <h6 className='font-weight-bold'>Product EveryDay</h6>
            <h5 className="font-weight-bolder">Register</h5>
            <form className="w-600 mw-full">
                <div className="form-group">
                    <label htmlFor="email" className="small">Email</label>
                    <input type="email" className="form-control form-control-sm" id="email" placeholder="Email" required="required" />
                </div>
                <input className="btn btn-primary btn-block bg-blue" type="submit" value="Send Password Reset Mail" />
            </form>
        </div>
    </div>
</div>
  )
}

export default PasswordReset