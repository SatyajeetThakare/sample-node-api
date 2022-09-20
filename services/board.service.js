const Board = require('../models/Board')

const get = function (_id) {
  return getAll().find(account => account._id == _id);
}

const getAll = function () {
  return data.Accounts;
}

function createBoard(board) {
  return new Promise((resolve, reject) => {
    try {
      Board.create(board, function (error, doc) {
        if (error) {
          reject(error);
        } else {
          resolve(doc);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function updateBoard(board) {
  return new Promise((resolve, reject) => {
    try {
      Board.findByIdAndUpdate(board._id,
        board, { new: true },
        function (error, doc) {
          if (error) {
            reject(error);
          } else {
            resolve(doc);
          }
        });
    } catch (error) {
      reject(error);
    }
  });
}

function deleteBoard(board) {
  return new Promise((resolve, reject) => {
    try {
      Board.update({ '_id': board._id },
        { $set: { 'isActive': false, remarks: board.remarks || 'Deleted' } },
        function (error, doc) {
          if (error) {
            reject(error);
          } else {
            resolve(doc);
          }
        });
    } catch (error) {
      reject(error);
    }
  });
}

function getBoardById(id) {
  return new Promise((resolve, reject) => {
    try {
      Board.findById(id).exec(function (error, doc) {
        if (error) {
          reject(error);
        } else {
          resolve(doc);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getBoards() {
  return new Promise((resolve, reject) => {
    try {
      Board.find({ 'isActive': true }).exec(function (error, doc) {
        if (error) {
          reject(error);
        } else {
          resolve(doc);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  get,
  getAll,
  createBoard,
  updateBoard,
  deleteBoard,
  getBoardById,
  getBoards
};
