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
}

async function query(filterBy) {
  try {
    // const criteria = _buildCriteria(filterBy)
    const criteria = {}

    const collection = await dbService.getCollection('board')
    let boards = await collection.find(criteria).toArray()
    if (!boards.length) {
      const demoData = _getDemoData()
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
  try {
    const collection = await dbService.getCollection('board')
    const addedBoard = await collection.insertOne(board)
    return addedBoard
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

function _buildCriteria(filterBy) {
  const criteria = {}

  // by name
  const regex = new RegExp(filterBy.name, 'i')
  criteria.name = { $regex: regex }

  // filter by inStock
  if (filterBy.inStock) {
    criteria.inStock = { $eq: JSON.parse(filterBy.inStock) }
  }

  // filter by labels
  if (filterBy.labels?.length) {
    criteria.labels = { $in: filterBy.labels }
  }

  return criteria
}

function _getDemoData() {
  return [{
    'title': 'Trello dev proj',
    'createdAt': Date.now(),
    'createdBy': {},
    'style': {
      'imgUrl': '../assets/imgs/boardBackground/1.jpg'
    },
    'labels': [
      {
        "id": "l101",
        "title": "Done",
        "color": "#61bd4f"
      },
      {
        "id": "l102",
        "title": "Progress",
        "color": "#f2d600"
      },
      {
        "id": "l103",
        "title": "Low priority",
        "color": "#c377e0"
      },
      {
        "id": "l104",
        "title": "Medium priority",
        "color": "#ff9f1a"
      },
      {
        "id": "l105",
        "title": "High priority",
        "color": "#eb5a46"
      },
      {
        "id": "l106",
        "title": "All",
        "color": "#0079bf"
      },
    ],
    'members': [],
    'groups': [
      {
        'id': utilService.makeId('g'),
        'title': 'Frontend',
        'tasks': [
          {
            'id': utilService.makeId('t'),
            'title': 'Replace logo',
            'description': "Choose name and find logo",
            'labelIds': ['l101'],
            'attachments': [{
              'id': utilService.makeId('a'),
              'createdAt': '1648319551701',
              'name': "logo-icon.png",
              'url': "http://res.cloudinary.com/twello/image/upload/v1648313534/logo-icon_wzlcpi.png"
            }]
          },
          {
            'id': utilService.makeId('t'),
            'title': 'Add Libraries',
            'cover': {
              'backgroundImage': "url(http://res.cloudinary.com/twello/image/upload/v1648315255/Libraries_zungf8.png)"
            },
            'labelIds': ['l102'],
          }
        ],
        'style': {}
      },
      {
        'id': utilService.makeId('g'),
        'title': 'Backend',
        'tasks': [
          {
            'id': utilService.makeId('t'),
            'title': 'DB collections',
            'description': "Add board and user collections",
            'labelIds': ['l104'],
            'cover': { 'backgroundColor': "pink" },
            'attachments': [{
              'id': utilService.makeId('a'),
              'createdAt': '1648319551701',
              'name': "mongo-DB.png",
              'url': "http://res.cloudinary.com/twello/image/upload/v1648314220/mongo-DB_gwdwux.png"
            }]
          },
          {
            'id': utilService.makeId('t'),
            'title': 'API routes',
            'description': "Add API routes",
            'labelIds': ['l105'],
          },
          {
            'id': utilService.makeId('t'),
            'title': 'Socket service',
            'description': "Add API routes",

          },
        ],
        'style': {}
      },
      {
        'id': utilService.makeId('g'),
        'title': 'CSS',
        'tasks': [
          {
            'id': utilService.makeId('t'),
            'title': 'Planning the design',
            'description': "Get to know the design of the Trello and understand how we would like to implement it",
            'labelIds': ['l101'],
            'cover': { 'backgroundImage': "url(http://res.cloudinary.com/twello/image/upload/v1648315891/design_kwnpub.jpg)" },
          },
          {
            'id': utilService.makeId('t'),
            'title': 'Add helpers',
            'description': "Add helpers file to improve css",
          },
          {
            'id': utilService.makeId('t'),
            'title': 'Fix design',
            'cover': { 'backgroundColor': "red" }
          },
        ],
        'style': {}
      },
      {
        'id': utilService.makeId('g'),
        'title': 'To do',
        'tasks': [
          {
            'id': utilService.makeId('t'),
            'title': 'Add checklist',
            'description': "Add the feature in task details and preview",
            'labelIds': ['l101', 'l105', 'l106'],
          },
          {
            'id': utilService.makeId('t'),
            'title': 'Add users',
            'cover': { 'backgroundColor': "yellow" },
            'description': "Add the feature in task details and preview",
          },
        ],
        'style': {}
      },
      {
        'id': utilService.makeId('g'),
        'title': 'Done',
        'tasks': [
          {
            'id': utilService.makeId('t'),
            'title': 'Add cover',
          },
          {
            'id': utilService.makeId('t'),
            'title': 'Add labels',
            'description': "Add color and names",
            'labelIds': ['l102', 'l103', 'l106']
          },
          {
            'id': utilService.makeId('t'),
            'title': 'Add attachments',
          },
        ],
        'style': {}
      },
    ]
  },
  {
    'title': 'Trello dev proj',
    'createdAt': Date.now(),
    'createdBy': {},
    'style': {
      'imgUrl': '../assets/imgs/boardBackground/2.jpg'
    },
    'labels': [
      {
        "id": "l101",
        "title": "Done",
        "color": "#61bd4f"
      },
      {
        "id": "l102",
        "title": "Progress",
        "color": "#f2d600"
      },
      {
        "id": "l103",
        "title": "Low priority",
        "color": "#ff9f1a"
      },
      {
        "id": "l104",
        "title": "Medium priority",
        "color": "#eb5a46"
      },
      {
        "id": "l105",
        "title": "High priority",
        "color": "#c377e0"
      },
      {
        "id": "l106",
        "title": "All",
        "color": "#0079bf"
      },
    ],
    'members': [],
    'groups': [
      {
        'id': utilService.makeId('g'),
        'title': 'Group 1',
        'tasks': [
          {
            'id': utilService.makeId('t'),
            'title': 'Replace logo'
          },
          {
            'id': utilService.makeId('t'),
            'title': 'Add Samples',
            "labelIds": ["l103", "l104"]
          }
        ],
        'style': {}
      }
    ]
  }]
}