const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const utilService = require('../../services/util.service')

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
  addActivity
}

async function query(filterBy) {
  try {
    const criteria = _buildCriteria(filterBy)
    // const criteria = {}
    const collection = await dbService.getCollection('board')
    let boards = await collection.find(criteria).toArray()
    if (!boards.length) {
      const demoCollection = await dbService.getCollection('demo_data')
      const demoData = await demoCollection.find().toArray()
      collection.insertMany(demoData)
      boards = await collection.find(criteria).toArray()
    }
    return boards
  } catch (err) {
    logger.error('cannot find boards', err)
    throw err
  }
}

async function getById(boardId) {
  try {
    const collection = await dbService.getCollection('board')
    const board = collection.findOne({ _id: ObjectId(boardId) })
    return board
  } catch (err) {
    logger.error(`while finding board ${boardId}`, err)
    throw err
  }
}

async function remove(boardId) {
  try {
    const collection = await dbService.getCollection('board')
    await collection.deleteOne({ _id: ObjectId(boardId) })
    return boardId
  } catch (err) {
    logger.error(`cannot remove board ${boardId}`, err)
    throw err
  }
}

async function add(board) {
  // console.log(board)
  try {
    if (!board?.members || !board?.members.length) board.members = [{
      "_id": "624489ca5b668804d46317cd",
      "username": "guest@ca.com",
      "fullname": "Guest",
      "imgUrl": "https://idhubs.com/themes/frontend/default/assets/images/avatar/g/600.png"
    }]
    else board.members.push({
      "_id": "624489ca5b668804d46317cd",
      "username": "guest@ca.com",
      "fullname": "Guest",
      "imgUrl": "https://idhubs.com/themes/frontend/default/assets/images/avatar/g/600.png"
    })
    const collection = await dbService.getCollection('board')
    const addedBoardId = await collection.insertOne(board)
    board._id = addedBoardId.insertedId.toString()
    return board
  } catch (err) {
    logger.error('cannot insert board', err)
    throw err
  }
}

async function update(board) {
  try {
    const id = ObjectId(board._id)
    delete board._id
    const collection = await dbService.getCollection('board')
    await collection.updateOne({ _id: id }, { $set: { ...board } })
    board._id = id
    return board
  } catch (err) {
    logger.error(`cannot update board ${board._id}`, err)
    throw err
  }
}

async function addActivity(activity) {
  try {
    const id = ObjectId(activity.ids.boardId)
    const collection = await dbService.getCollection('board')
    // console.log('from service', activity)
    await collection.updateOne({ _id: id }, { $push: { activities: activity } })
    const newCollection = await dbService.getCollection('board')
    const newBoards = await newCollection.find().toArray()
    console.log('New boards from addActivity', newBoards)
    return Promise.resolve()
  } catch (err) {
    logger.error(`cannot add activity ${activity.id}`, err)
    throw err
  }
}
function _buildCriteria(filterBy) {
  const criteria = {}

  // by user
  // console.log(filterBy)
  // const regex = new RegExp(filterBy[0])
  // console.log(regex)
  // console.log(regex)
  // criteria.members = {
  //   $regex: regex
  // }
  if (filterBy.user) {
    const user = JSON.parse(filterBy.user)
    // console.log(user)
    criteria.$or = [{ members: user }, { createdBy: user }]
  }
  // by name
  // const regex = new RegExp(filterBy.name, 'i')
  // criteria.name = { $regex: regex }

  // // filter by inStock
  // if (filterBy.inStock) {
  //   criteria.inStock = { $eq: JSON.parse(filterBy.inStock) }
  // }

  // // filter by labels
  // if (filterBy.labels?.length) {
  //   criteria.labels = { $in: filterBy.labels }
  // }

  return criteria
}