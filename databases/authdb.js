const authUsers = [
    { "username": "jk", "password": "sala", rateLimiting: { window: 0, requestCounter: 0 }  },
    { "username": "pl", "password": "pass", rateLimiting: { window: 0, requestCounter: 0 }  }
];

export const getAuthUser = (username) => authUsers.find(u => u.username === username)

export const userExist = (username) => authUsers.some(u => u.username === username)

