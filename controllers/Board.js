const Board = require('../models/Board')
const BoardService = require('../services/board.service');
const constants = require('../constants/constants')
const assert = require('assert')

module.exports.getBoards = (req, res, next) => {
  try {
    BoardService.getBoards().then((doc) => {
      res.json({ error: false, success: true, message: "Boards list", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}

module.exports.getBoardById = (req, res, next) => {
  try {
    BoardService.getBoardById(req.params.id).then((doc) => {
      res.json({ error: false, success: true, message: "Board info", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}

module.exports.createBoard = (req, res, next) => {
  try {
    let _userInfo = req.session.userInfo;
    BoardService.createBoard(req.body).then((doc) => {
      res.json({ error: false, success: true, message: "Board created successfully", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}

module.exports.updateBoard = (req, res, next) => {
  try {
    BoardService.updateBoard(req.body).then((doc) => {
      res.json({ error: false, success: true, message: "Boards list", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}

module.exports.deleteBoard = (req, res, next) => {
  try {
    BoardService.deleteBoard(req.body).then((doc) => {
      res.json({ error: false, success: true, message: "Boards list", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}