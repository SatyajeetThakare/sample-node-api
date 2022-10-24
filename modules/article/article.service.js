const db = require('../../_helpers/db');
const Article = db.Article;
const FileUploadService = require('../../utils/fileUpload');

module.exports = {
    getArticles,
    getById,
    create,
    update,
    delete: _delete,
    unseenArticles
};

function create(req) {
    return new Promise((resolve, reject) => {
        try {
            const fileType = 'image';
            Article.create(req.body, async function (error, doc) {
                if (error) {
                    reject(error);
                } else {
                    let result = await uploadFile(req, fileType, doc);
                    resolve(doc);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

function uploadFile(req, fileType, article) {
    return new Promise(async (resolve, reject) => {
        FileUploadService.uploadFile(req, fileType, 'article-uploads').then(async (filePath) => {
            let docObj = {
                url: filePath,
                fileName: req.file.originalname,
                uploadedOn: new Date()
            }
            console.log('article', article);
            const query = { _id: article._id };
            const update = {
                $set: { [`attachment`]: docObj }
            }            
            // Update the collection
            let updateAttachmentsInfoResult = await updateArticleAttachmentsInfo(query, update);
            resolve(updateAttachmentsInfoResult);
        }).catch((error) => {
            console.log('Line no 133: Invalid file type provided', error);
            reject(error);
        });
    });
}

function getArticles(userId, allArticle) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await markAllArticlesAsSeen(userId);
            Article.find({ 'isActive': true })
                .populate('createdBy', 'name')
                .exec(function (error, doc) {
                    if (error) {
                        reject(error);
                    } else {
                        // Use this to get pure array of document object
                        let data = JSON.parse(JSON.stringify(doc));
                        // Add is viewed property to every article
                        let result = data.map((e) => ({
                            ...e,
                            isViewed: e.viewedBy.includes(userId)
                        }));
                        resolve(result);
                    }
                });
        } catch (error) {
            reject(error);
        }
    });
}

function getById(articleId, userId) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await markArticleAsSeen(articleId, userId);
            Article.findOne({ _id: articleId })
                .populate('createdBy', 'name')
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

function update(article) {
    return new Promise((resolve, reject) => {
        try {
            Article.updateOne(
                { _id: article._id },
                { isCompleted: true, updatedBy: article.updatedBy }
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

function _delete(id) {
    return new Promise((resolve, reject) => {
        try {
            Article.updateOne(
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

function unseenArticles(userId) {
    return new Promise((resolve, reject) => {
        try {
            Article.find({ isActive: true, viewedBy: { $nin: [userId] } })
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

function markArticleAsSeen(articleId, userId) {
    return new Promise((resolve, reject) => {
        try {
            Article.updateOne(
                { _id: articleId },
                { $addToSet: { viewedBy: userId } }
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

function markAllArticlesAsSeen(userId) {
    return new Promise((resolve, reject) => {
        try {
            Article.updateMany(
                {},
                { $addToSet: { viewedBy: userId } }
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

function updateArticleAttachmentsInfo(query, update) {
    return new Promise(async (resolve, reject) => {
        try {
            Article.update(query, update, function (error, doc) {
                if (error) {
                    reject(error);
                } else {
                    resolve(doc);
                }
            });
        } catch (error) {
            throw error;
        }
    });
}