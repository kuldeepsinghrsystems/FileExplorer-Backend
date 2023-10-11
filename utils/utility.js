const fs = require('fs');
const config = require('../config');

const writeData = (jsonData) =>{
    fs.writeFileSync(config.DATA_FILE_PATH, JSON.stringify(jsonData, null, 2));
};

const readData = () =>{
    return JSON.parse(fs.readFileSync(config.DATA_FILE_PATH, 'utf-8'))
};

const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
  
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = {
    writeData,
    readData,
    formatBytes
};