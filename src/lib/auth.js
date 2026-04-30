const users = [
  { id: 1, username: 'doctor1', password: 'password123', role: 'doctor' },
  { id: 2, username: 'nurse1', password: 'password456', role: 'nurse' },
  { id: 3, username: 'admin', password: 'adminpass', role: 'admin' },
]

let currentUser = null

export function login(username, password) {
  const user = users.find(u => u.username === username && u.password === password)
  if (user) {
    currentUser = user
    return true
  }
  return false
}

export function logout() {
  currentUser = null
}

export function getCurrentUser() {
  return currentUser
}

export function addUser(username, password, role = 'user') {
  if (users.find(u => u.username === username)) {
    throw new Error('User already exists')
  }
  const newUser = { id: users.length + 1, username, password, role }
  users.push(newUser)
  return newUser
}
