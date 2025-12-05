import jwt from 'jsonwebtoken';
import {userExist} from '../databases/authdb.js';

// middleware/verifyToken
export const verifyToken = (authToken) => {
    try {
      const token = authToken.substring(7);
      if( token ) { 
        const decodedToken = jwt.verify(token, 'my_secret_key');

        if(!userExist(decodedToken.username)) {
          return null
        }
        return decodedToken.username
      }
    } catch (err) {
      if(err.name === "TokenExpiredError") 
        console.log("JWT expired")
      else
        console.log("JWT verification failed:", err.message)
      return null
    }    
}