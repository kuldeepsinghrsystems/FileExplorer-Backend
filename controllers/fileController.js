const logger = require('./../logger');
const fileService = require('../services/fileService');


const showFiles = async(req,res) =>{ 
    try{
        if(!req?.query?.path)
            res.status(400).json({ error: 'missing parameters' });;
        
        //Write Files metadata in json file
        const writeResult = fileService.writeFileData(req.query.path);

        if(!writeResult)
          throw new Error('Write failed')

        //If Response if successful then return json collection 
        response = fileService.getFilesTypeCount();

        res.status(200).json(response);
    }catch(error){
        logger.error('Error in showFiles:', error);
        if (error.code === 'ENOENT') {
            res.status(404).json({ error: 'No data found' });
        }else{
            res.status(500).json({ error: 'Internal server error' });
        }        
    }
};

//Returns / executed every time back button is pressed.
const getFilesTypeCount = async(req,res) =>{
    try{
        const response = fileService.getFilesTypeCount();

        res.status(200).json(response);
    }catch(error){
        logger.error('Error in getFilesTypeCount:', error);
        res.status(500).json({ error: 'Internal server error' });        
    }
};


const getFilesByType = (req, res) => {
    try{
        //validation
        if(!req?.params?.type)
          res.status(400).json({ error: 'missing parameters' });

        const fileType = req.params.type;
        const response = fileService.getFilesByType(fileType);
        
        res.json(response);
    }catch(error){
        logger.error('Error in getFilesByType:', error);

        // Handle specific errors for this function
        if (error.name === 'TypeError') {
            // Handle invalid input error
            res.status(400).json({ error: 'Missing file type' });
        } else {
            // Handle other unexpected errors
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    
};

module.exports = {
    showFiles,
    getFilesTypeCount,
    getFilesByType
};