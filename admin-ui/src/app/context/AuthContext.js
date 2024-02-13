import { useEffect } from "react";
import {createContext, useCallback , useState} from "react";
// import { baseUrl, portRequest } from '../../core/constants'

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) =>{
      const [user, setUser] = useState("");
      useEffect(()=>{
            const currentUser = localStorage.getItem("User")
            setUser(JSON.parse(currentUser))
      },[])
      const updateUser = useCallback((response)=>{
            localStorage.setItem("User",JSON.stringify(response));
            setUser(response);
       },[])

      //  console.log(user)

       return (
            <AuthContext.Provider value={{user,updateUser}} >
                  {children}
            </AuthContext.Provider>
       )

}

 

