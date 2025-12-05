import settings from './settings.js';
import { getAuthUser } from '../databases/authdb.js'
import { GraphQLError} from 'graphql'

const limiterSettings = settings.rateLimiterSettings;
const getLimiterWindow = () => Math.floor(Date.now() / limiterSettings.windowSizeInMillis);

export const rateLimiter = (authUser) => {

  const user = getAuthUser(authUser);

  if (!user.rateLimiting) {
    // initialize rate limiting info
    user.rateLimiting = {
      window: getLimiterWindow(),
      requestCounter: 0
    };
  }
  // Determine the current rate limiting window
  const currentWindow = getLimiterWindow();

  // If the user has moved to a new window, reset the counter
  if (user.rateLimiting.window < currentWindow) {
    user.rateLimiting.window = currentWindow; //update window
    user.rateLimiting.requestCounter = 1;     // start counting from 1
  } else {
    // Otherwise, increment the counter within the current window
    user.rateLimiting.requestCounter++;
  }

  // Calculate remaining requests in this window
  const remaining = limiterSettings.limit - user.rateLimiting.requestCounter;

  // If user exceeded the allowed requests in this window, block them
  if (user.rateLimiting.requestCounter > limiterSettings.limit) {
     throw new GraphQLError('You have exceeded your request limit. Please wait...', {
       extensions: {
          code: "RATE LIMIT EXCEEDED",
          http: {status: 429}
       }
     })
  }
 
  return {
    user,
    rateLimit: {
      limit: limiterSettings.limit,
      remaining: Math.max(remaining, 0)
    }
  }
};
