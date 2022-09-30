const db = require('../../_helpers/db');
const Article = db.Article;

module.exports = {
    getArticles,
    getById,
    create,
    update,
    delete: _delete
};

function create(article) {
    return new Promise((resolve, reject) => {
        try {
            Article.create(article, function (error, doc) {
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

function getArticles(allArticle) {
    return new Promise((resolve, reject) => {
        try {
            Article.find({ 'isActive': true }).exec(function (error, doc) {
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

function getById(articleId) {
    return new Promise((resolve, reject) => {
        try {
            Article.findOne({ _id: articleId }).exec(function (error, doc) {
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


function update(article) {
    return new Promise((resolve, reject) => {
        try {
            Article.updateOne({ _id: article._id }, { isCompleted: true, updatedBy: article.updatedBy }).exec(function (error, doc) {
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

function _delete(id) {
    return new Promise((resolve, reject) => {
        try {
            Article.updateOne({ _id: id }, { isActive: false }).exec(function (error, doc) {
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