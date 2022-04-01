const logger = require('../../services/logger.service')
const boardService = require('./board.service')

module.exports = {
  getBoards,
  getBoardById,
  addBoard,
  updateBoard,
  removeBoard,
  addActivity
}

// LIST
async function getBoards(req, res) {
  try {
    const filterBy = req.query
    const boards = await boardService.query(filterBy)
    res.json(boards)
  } catch (err) {
    logger.error('Failed to get boards', err)
    res.status(500).send({ err: 'Failed to get boards' })
  }
}

// READ
async function getBoardById(req, res) {
  try {
    const { id } = req.params
    const board = await boardService.getById(id)
    res.json(board)
  } catch (err) {
    logger.error('Failed to get board', err)
    res.status(500).send({ err: 'Failed to get board' })
  }
}

// CREATE
async function addBoard(req, res) {
  try {
    const board = req.body
    const addedBoard = await boardService.add(board)
    // console.log(addedBoard)
    res.json(addedBoard)
  } catch (err) {
    logger.error('Failed to add board', err)
    res.status(500).send({ err: 'Failed to add board' })
  }
}

// UPDATE
async function updateBoard(req, res) {
  try {
    const board = req.body
    // console.log(board)
    const updatedBoard = await boardService.update(board)
    // console.log(updatedBoard)
    res.json(updatedBoard)
  } catch (err) {
    logger.error('Failed to update board', err)
    res.status(500).send({ err: 'Failed to update board' })
  }
}

// DELETE
async function removeBoard(req, res) {
  try {
    const { id } = req.params
    const removedId = await boardService.remove(id)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove board', err)
    res.status(500).send({ err: 'Failed to remove board' })
  }
}


async function addActivity(req, res) {
  try {
    const activity = req.body
    console.log('from add-activity in controller', activity)
    await boardService.addActivity(activity)
    // Load bearing console log
    res.status(200).send()
  } catch (err) {
    logger.error('Failed to add activity', err)
    res.status(500).send({ err: 'Failed to add activity' })
  }
}