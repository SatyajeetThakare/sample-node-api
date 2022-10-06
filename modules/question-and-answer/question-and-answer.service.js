const db = require('../../_helpers/db');
const QuestionAndAnswer = db.QuestionAndAnswer;

module.exports = {
    getQuestions,
    getQuestionAnswersById,
    create,
    update,
    answerAQuestion,
    delete: _delete
};

function create(question) {
    return new Promise((resolve, reject) => {
        try {
            QuestionAndAnswer.create(question, function (error, doc) {
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

function getQuestions(questionFilter) {
    return new Promise((resolve, reject) => {
        try {
            QuestionAndAnswer.find(questionFilter)
            .populate('createdBy', 'name')
            .exec(function (error, doc) {
                if (error) {
                    reject(error);
                } else {
                    resolve(doc);
                }
            });
        } catch (error) {
            console.log('error', error);
            reject(error);
        }
    });
}

function getQuestionAnswersById(questionId) {
    return new Promise((resolve, reject) => {
        try {
            QuestionAndAnswer.findOne({ _id: questionId })
            .populate('createdBy', 'name')
            .populate('answers.answeredBy', 'name')
            .exec(function (error, doc) {
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

function update(question) {
    return new Promise((resolve, reject) => {
        try {
            QuestionAndAnswer.updateOne(
                { _id: question._id },
                { isCompleted: true, updatedBy: question.updatedBy }
            ).exec(function (error, doc) {
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

function answerAQuestion(questionId, answer) {
    return new Promise((resolve, reject) => {
        try {
            QuestionAndAnswer.updateOne(
                { _id: questionId },
                { $push: { answers: answer } }
            ).exec(function (error, doc) {
                if (error) {
                    reject(error);
                } else {
                    console.log('doc', doc);
                    resolve(doc);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

function _delete(id) {
    return new Promise((resolve, reject) => {
        try {
            QuestionAndAnswer.updateOne(
                { _id: id },
                { isActive: false }
            ).exec(function (error, doc) {
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