const fileController = require('../../controllers/fileController');
const fileService = require('../../services/fileService');
const utility = require('../../utils/utility');

describe('File Controller showFiles', () => {
    test('should return 400 if path parameter is missing', () => {
        const req = {};
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        fileController.showFiles(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });
    test('should return folder data response if data is found',  () => {
        fileService.writeFileData = jest.fn().mockReturnValue(true);
        fileService.getFilesTypeCount = jest.fn().mockReturnValue({ folder1: { files: ['file1.pdf'] } });
        const req = { query: { path: '/path/to/folder' } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        fileController.showFiles(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ folder1: { files: ['file1.pdf'] } });
    });
    test('should return 500 if error in getting data',  () => {
        fileService.getFilesTypeCount = jest.fn().mockImplementation(() => {
          throw new Error('Error getting folder details');
        });
        const req = { query: { path: '/path/to/folder' } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        fileController.showFiles(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});

describe('File Controller getFilesTypeCount', () => {
    test('should return folder data in response',  () => {
        fileService.getFilesTypeCount = jest.fn().mockReturnValue({ folder1: { files: ['file1.pdf'] } });
        const req = {  };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        fileController.getFilesTypeCount(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ folder1: { files: ['file1.pdf'] } });
    });
});

describe('File Controller getFilesByType', () => {
    test('should return 400 when no type is provided', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        fileController.getFilesByType(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'missing parameters' });
    })
    test('should return 500 if no data is found', () => {
        utility.readData = jest.fn().mockReturnValue({});
        const req = { params: { type: 'pdf' } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        fileController.getFilesByType(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
    it('should return file data response if data is found', () => {
        utility.readData = jest.fn().mockReturnValue({ file1: { type: 'pdf' }, file2: { type: 'doc' } });
        fileService.getFilesByType = jest.fn().mockReturnValue({ file1: { type: 'pdf' } });
        const req = { params: { type: 'pdf' } };
        const res = {
          json: jest.fn(),
        };
        fileController.getFilesByType(req, res);
        expect(res.json).toHaveBeenCalledWith({ file1: { type: 'pdf' } });
    });
});
