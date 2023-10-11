const fs = require('fs');
const path = require('path');
const { formatBytes} = require('../utils/utility');
const Folder = require('../models/Folder');
const File = require('../models/File');
const moment = require('moment');
const utility = require('../utils/utility');

const getFolderDtlsFromFileSystem = (directoryPath) =>{
    
    const directoryStats = fs.statSync(directoryPath);

    // Read the contents of the directory
    const details = {
        folderPath:directoryPath,
        createdAt:directoryStats.birthtime,
        folders: [],
        files: [],
    };

    const items = fs.readdirSync(directoryPath);
    
    // Iterate through the items in the directory
    items.forEach((item) => {
        const itemPath = path.join(directoryPath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            details.folders.push({
                folderName: item,
                created: stats.birthtime,
            });
        }else if (stats.isFile()) {
            const fileSizeFormatted = formatBytes(stats.size);
            details.files.push({
              fileName: item,
              created: stats.birthtime,
              fileType: path.extname(item).toLowerCase().replace(/^\./, ''),
              size: fileSizeFormatted
            });
        } 
    });
    return details;
};

const  groupByFileType = (files) =>{
    const count = {};
    files.forEach((obj) => {
        const fileType = obj.fileType;
        count[fileType] = (count[fileType] || 0) + 1;
    });
    return Object.keys(count).map((fileType,index) => ({
        id:index,
        fileType,
        count: count[fileType],
    }));
}

const filterFileByType = (files,type) => {
   const res = files.filter(element => element.fileType==type);
   return res;
};

const writeFileData = (filePath) => {
    //get folder and files from specific path    
    const folderAndFileDetails = getFolderDtlsFromFileSystem(filePath);

    //insert data into json
    utility.writeData(folderAndFileDetails);
    return true;
}



const getFilesTypeCount = () => {

    // Read folder data from a JSON file 
    const data = utility.readData();
    if(Object.keys(data).length === 0)
       throw new Error('No data found');

   //group files by their types
   const fileTypes = groupByFileType(data.files);
   const created = moment(data.created).format('YYYY-MM-DD HH:mm');
   const folderData = new Folder(data.folderPath,created,data.files.length,fileTypes);
   
   return folderData;
}

const getFilesByType = (fileType) => {
    // Read folder data from a JSON file 
    const data = utility.readData();
    if(Object.keys(data).length === 0)
       throw new Error('No data found');
    
    //group files by file type
    const files = filterFileByType(data.files,fileType);
    const fileMetadata = [];
    files.forEach((element,index) => {
        const created = moment(element.created).format('YYYY-MM-DD HH:mm');
        const file = new File(index,element.fileName,element.fileType,created,element.size);
        fileMetadata.push(file);
    });
    return { 'path':data.folderPath,'nooffiles':data.files.length,'fileMetadata': fileMetadata }
}


module.exports = {
    getFolderDtlsFromFileSystem,
    groupByFileType,
    filterFileByType,
    getFilesTypeCount,
    getFilesByType,
    writeFileData
};