import FileManager, { NodeFile } from '../experiences/utils/file-manager'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import experiences from '@hestiaai/hestialabs'

console.log(experiences)

// const fileManager = new FileManager(
//   this.preprocessors,
//   fileManagerWorkers,
//   this.files,
//   this.keepOnlyFiles
// )
// try {
//   await fileManager.init(uppyFiles)
//   this.$store.commit('setFileManager', fileManager)
//   if (dbConfig) {
//     // create database
//     const db = await DBMS.createDB(dbConfig)
//     // generate database records via the file manager
//     const records = await DBMS.generateRecords(fileManager, dbConfig)
//     // insert the records into the database
//     DBMS.insertRecords(db, records)
