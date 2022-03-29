const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const dbService = require('../../services/db.service')
module.exports = {
  signup,
  login,
}

async function login(username, password) {
  logger.debug(`auth.service - login with username: ${username}`)
  const user = await userService.getByUsername(username)
  if (!user) return Promise.reject('Invalid username or password')
  // TODO: un-comment for real login
  const match = await bcrypt.compare(password, user.password)
  if (!match) return Promise.reject('Invalid username or password')

  delete user.password
  return user
}

async function signup(username, password, fullname) {
  const saltRounds = 10
  const collection = await dbService.getCollection('user')
  const users = await collection.find().toArray()
  logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
  if (!username || !password || !fullname) {
    return Promise.reject('fullname, username and password are required!')
  }
  if (users.some(user => user.username === username)) {
    return Promise.reject('User already exists!')
  }

  const hash = await bcrypt.hash(password, saltRounds)
  return userService.add({ username, password: hash, fullname })
}
