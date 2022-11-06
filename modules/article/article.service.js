const db = require('../../_helpers/db');
const Article = db.Article;
const FileUploadService = require('../../utils/fileUpload');
var fs = require('fs');
var path = require('path');
global.__basedir = __dirname;
require('dotenv').config();

const AWS = require('aws-sdk');
const { resolve } = require('path');
const ID = process.env.ID;
const SECRET = process.env.SECRET;
// The name of the bucket that you have created
const BUCKET_NAME = process.env.BUCKET_NAME;
console.log('ID', ID);
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const params = {
    Bucket: BUCKET_NAME,
    CreateBucketConfiguration: {
        // Set your region here
        LocationConstraint: "us-east-1"
    }
};

module.exports = {
    getArticles,
    getById,
    create,
    update,
    delete: _delete,
    unseenArticles
};

function create(req) {
    return new Promise(async (resolve, reject) => {
        try {
            const file = req.file;

            let fileUploadResult = await uploadFile(file);
            req.body.articlePicDetails = fileUploadResult;

            Article.create(req.body, async function (error, doc) {
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

const uploadFile = (file) => {
    return new Promise(async (resolve, reject) => {
        let fileName = `${(new Date().toJSON().slice(0, 19))}_` + file.originalname;
        // Read content from the file
        const fileContent = file.buffer.toString();

        // Setting up S3 upload parameters
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName, // File name you want to save as in S3
            Body: file.buffer
        };

        // Uploading files to the bucket
        s3.upload(params, function (error, data) {
            if (error) {
                reject(error);
            }
            resolve(data);
        });
    });
};

function getArticles(userId, allArticle) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await markAllArticlesAsSeen(userId);
            Article.find({ 'isActive': true })
                .populate('createdBy', 'name')
                .sort({ createdAt: -1 })
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