var users = [
    {
      "id": 1,
      "forename": "Roy",
      "surname": "Fielding"
    },
    {
      "id": 2,
      "forename": "Tim",
      "surname": "Berners-Lee"
    },
    {
      "id": 3,
      "forename": "Jyri",
      "surname": "Kemppainen"
    },
    {
      "id": 4,
      "forename": "Test",
      "surname": "Data"
    }


  ]

let dataMap = {
  jk: [1, 3],
  pl: [2]
}

export function getDataMap () {
    // replace with actual database query
    return dataMap
}

export function getUserDataMap ( username ) {
  // replace with actual database query
  return dataMap[username]
}

export function getUsers () {
    // replace with actual database query
    return users
}

export function getUserById ( id ) {
  // replace with actual database query
  return users.find(item => item.id === id)
}

export function createUser( newData ) {
    // find next id (auto-increment simulation)
    const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1
  
    const newId = { id: nextId }
    const newUser = { ...newId, ...newData }
  
    // "insert" to simulated database
    users.push( newUser )
  
    // return the new user (like an INSERT returning its row)
    return newUser
  }

export function updateUser(id, data) {
  const existing = getUserById(id);

  if (existing) {
    Object.assign(existing, data); // simpler way to copy fields
    return true;
  } else {
    const newUser = { id, ...data };
    users.push(newUser);
    return false;
  }
}

export function deleteUserById(id) {
  const initialLength = users.length;
  users = users.filter(user => user.id !== id);
  return  users.length < initialLength; // true if a user was removed
}

export function searchUser(searchString) {
  let filtered = [];
  let result = [];

  const byForename = users.filter(item => item.forename === searchString);
  filtered = [...filtered, ...byForename];

  const bySurname = users.filter(item => item.surname === searchString);
  filtered = [...filtered, ...bySurname];


  filtered = filtered.filter(
    (item, index, self) => index === self.findIndex(x => x.id === item.id)
  );  

  if(filtered.length > 0)
  {
    for(let element of filtered)
      {
        let userInfo = { forename: "Name", surname: "Surname"}
        userInfo.forename = element.forename
        userInfo.surname = element.surname
        result.push(userInfo)
      }
  }

  return result
}

  