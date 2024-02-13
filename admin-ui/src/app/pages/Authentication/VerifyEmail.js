import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Alert, CircularProgress } from "@mui/material";
import { AuthContext} from "../../context/AuthContext";
import { BACKEND_URL, baseUrl, portRequest } from '../../core/constants'
// import { base } from "../../../../../server/app/models/user";
import { divide } from "lodash";
import axios from "axios";
// import React from "react";


const VerifyEmail=() => {
    const { user, updateUser }= useContext(AuthContext);
    const [ isLoading, setIsLoading]=useState(false);
    const [ error, setError]=useState( null);
    // const { searchParams, setSearchParams}=useSearchParams();
    const { search } = useLocation()
    const emailToken = search.substring(12)
    const navigate =useNavigate();

    // const emailToken=searchParams.get("emailToken");

    // console.log(user);
    console.log("emailToken",typeof(emailToken))
    // console.log(category)
    useEffect(()=> {
        (async()=>{
            if(user?.verified){
                setTimeout(()=>{
                    return navigate("/");
                },3000);
            }else{
                if(emailToken){

                    setIsLoading(true);
                    const response = await axios.post(
                        "http://127.0.0.1:6080/api/auth/verify-email", emailToken
                    );
                    setIsLoading(false);
                    
                    console.log("res",response);
                    if(response.error){
                        return setError(response);
                    } 

                    updateUser(response);
                }
            }
        })();

    },[]);

    return (
         <div>
            {isLoading?(
                <div>
                   <h1>loading...</h1>
                </div>

            ):(
                <div>
                    {user?.verified ? (
                        <div>
                            <h1>email verified successfully</h1>
                            </div>
                    ):(
                        <div>
                            {error}
                            </div>
                            )}
                        </div>

                    )}
                    </div>
            );

};

export default VerifyEmail;