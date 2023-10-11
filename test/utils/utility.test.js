const fs = require('fs');
const {
  writeData,
  readData,
  formatBytes,
} = require('../../utils/utility'); 
const config = require('../../config');

jest.mock('fs');

describe('writeData', () => {
 test('should write JSON data to a file', () => {
    const jsonData = { key: 'value' };
    
    writeData(jsonData);
    
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      config.DATA_FILE_PATH,
      JSON.stringify(jsonData, null, 2)
    );
  });
});

describe('readData', () => {
  test('should read JSON data from a file', () => {
    const jsonData = { key: 'value' };
    
    fs.readFileSync.mockReturnValue(JSON.stringify(jsonData));
    
    const result = readData();
    
    expect(fs.readFileSync).toHaveBeenCalledWith(
      config.DATA_FILE_PATH,
      'utf-8'
    );
    
    expect(result).toEqual(jsonData);
  });
});

describe('formatBytes', () => {
  test('should format bytes to human-readable sizes', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1024 * 1024)).toBe('1 MB');
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
    expect(formatBytes(1024 * 1024 * 1024 * 1024)).toBe('1 TB');
  });
});
