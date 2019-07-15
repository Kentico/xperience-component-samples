const glob = require('glob');
const path = require('path');
const constants = require("./constants");

module.exports = {
  getSourceOutputMappings(isProduction) {
    const solutionFolderPath = path.resolve(__dirname, "../");
    const solutionFolderName = path.basename(solutionFolderPath);
    const sourceFiles = glob.sync(solutionFolderPath + `/**/${constants.SOURCE_FILES_FOLDER_NAME}/**/${constants.ENTRY_FILE_NAME}`);
    
    return sourceFiles.map(sourceFilePath => sourceFilePath.split(solutionFolderName)[1])
      .reduce((mappings, filePath) => {
        const componentFolderName = filePath.split("/")[1];
        const componentContentPath = `.${path.dirname(filePath.split(constants.SOURCE_FILES_FOLDER_NAME)[1])}`;
        const outputPath = isProduction ? 
          path.resolve(__dirname, "../", `${componentFolderName}/${constants.OUTPUT_FOLDER_NAME}`, componentContentPath) :
          path.resolve(__dirname, "../", constants.DEV_OUTPUT_PATH, componentContentPath);

        mappings[`.${filePath}`] = outputPath;
        return mappings;
      }, {});
  }
}