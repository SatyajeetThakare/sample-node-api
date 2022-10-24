var fs = require('fs');
const _ = require(`lodash`);
const path = require(`path`);
const mkdirp = require(`mkdirp`);
global.__basedir = __dirname;

function createDirectory(folderPath) {
    return new Promise((resolve, reject) => {
        mkdirp(folderPath)
            .then(resolve({}))
            .catch((error) => { reject(error) });
    })
}

function storeFile(filePath, bufferFile) {
    return new Promise((resolve, reject) => {
        try {
            fs.writeFile(`${filePath}`, bufferFile, {
                encoding: 'base64'
            }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({});
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

function uploadFile(req, fileType, folderName) {
    return new Promise(async (resolve, reject) => {
        try {
            const file = req.file;

            const ext = path.extname(file.originalname).toLowerCase()
            if (!(/(img|jpg|png)$/i.test(ext))) {
                return reject('You can only upload image files!');
            }

            // calculate the size of file
            const fileSizeInBytes = file.size;
            const fileSizeInKB = Number(fileSizeInBytes / 1000).toFixed(2);
            const fileSizeInMB = Number(fileSizeInKB / 1000).toFixed(2);
            // throw error if file size is greater than 15MB
            if (fileSizeInMB > 5) {
                return reject('File size can not be more than 5MB!');
            }

            const bufferFile = file.buffer;
            let reqPath = path.join(__basedir, '../'); // It goes three folders or directories back from given __dirname.
            const folderPath = path.join(__dirname, `../${folderName}`);
            // const fileName = `${fileType}_${req.body.createdBy}${ext}`;
            const fileName = file.originalname;
            const filePath = path.join(__dirname, `../${folderName}`) + '/' + fileName;

            await createDirectory(folderPath);
            // store file on server
            await storeFile(filePath, bufferFile);
            resolve(filePath);
        } catch (error) {
            console.log('error', error);
            reject(error);
        }
    });
}

module.exports = {
    uploadFile
};