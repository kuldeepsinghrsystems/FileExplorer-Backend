const {
    getFolderDtlsFromFileSystem,
    groupByFileType,
    filterFileByType
  } = require('../../services/fileService');
const utility = require('../../utils/utility');
const fs = require('fs');
const path = require('path');

jest.mock('fs');
describe('fileService',()=>{
    describe('getFolderDtlsFromFileSystem', () => {
        it('should return folder details', () => {
            const directoryPath = '/path/to/directory'; 
             const mockStats = {
              birthtime: new Date(),
              isDirectory: () => true,
              isFile: () => false,
            };
        
            jest.spyOn(fs, 'statSync').mockImplementation(() =>{
                return mockStats;
            });
            jest.spyOn(fs, 'readdirSync').mockImplementation(() =>{
                return [];
            });
        
            const result = getFolderDtlsFromFileSystem(directoryPath);
            expect(fs.statSync).toHaveBeenCalled();
            expect(fs.readdirSync).toHaveBeenCalled();
          });
    });
    describe('groupByFileType', () => {
        it('should group files by file type', () => {
          const files = [
            { fileType: 'jpg' },
            { fileType: 'txt' },
            { fileType: 'jpg' },
            { fileType: 'pdf' },
          ];
      
          const result = groupByFileType(files);
      
          const expectedGroupedData = [
            { id: 0, fileType: 'jpg', count: 2 },
            { id: 1, fileType: 'txt', count: 1 },
            { id: 2, fileType: 'pdf', count: 1 },
          ];
      
          expect(result).toEqual(expectedGroupedData);
        });
        test('should handle an empty array', () => {
            const files = [];
        
            const result = groupByFileType(files);
        
            expect(result).toEqual([]);
        });
        test('should handle files with different types', () => {
            const files = [
              { fileType: 'jpg' },
              { fileType: 'pdf' },
              { fileType: 'txt' },
            ];
        
            const result = groupByFileType(files);
        
            const expectedGroupedData = [
              { id: 0, fileType: 'jpg', count: 1 },
              { id: 1, fileType: 'pdf', count: 1 },
              { id: 2, fileType: 'txt', count: 1 },
            ];
        
            expect(result).toEqual(expectedGroupedData);
        });
    });
    describe('filterFileByType', () => {
        test('should filter files by file type', () => {
          const files = [
            { fileType: 'jpg' },
            { fileType: 'txt' },
            { fileType: 'jpg' },
            { fileType: 'pdf' },
          ];
      
          const fileTypeToFilter = 'jpg';
      
          const result = filterFileByType(files, fileTypeToFilter);
      
          const expectedFilteredFiles = [
            { fileType: 'jpg' },
            { fileType: 'jpg' },
          ];
      
          expect(result).toEqual(expectedFilteredFiles);
        });
      
        test('should handle an empty array', () => {
          const files = [];
      
          const fileTypeToFilter = 'txt';
      
          const result = filterFileByType(files, fileTypeToFilter);
      
          expect(result).toEqual([]);
        });
      
        test('should handle files with different types', () => {
          const files = [
            { fileType: 'jpg' },
            { fileType: 'pdf' },
            { fileType: 'txt' },
          ];
      
          const fileTypeToFilter = 'pdf';
      
          const result = filterFileByType(files, fileTypeToFilter);
      
          const expectedFilteredFiles = [
            { fileType: 'pdf' },
          ];
      
          expect(result).toEqual(expectedFilteredFiles);
        });
    });   
})

  