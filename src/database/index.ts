import mongoose from "mongoose"
import { db } from "../config.js"
import { dbURI } from "../config"
import Logger from "../core/Logger.js"

// const dbURI = `mongodb://${db.user}:${db.password}@${db.host}:${db.port}/${db.name}`

// For Secure and Optimize our db

const options = {
  autoIndex: true,//For faster retrival of data, we can set to true so to index all collection in table in mongo // just for testing / dev not for production/ set false in production mode
  minPoolSize: db.minPoolSize,// specify min no. of socket conn and pool should actually maintain
  maxPoolSize: db.maxPoolSize,
  connectTimeoutMS: 10000,//to prevent to wait indefinetily to connect to mongodb
  socketTimeoutMS: 45000,//to tell to close after 45sec after inactivity
}

Logger.debug(dbURI)

function setRunValidators() {
  return { runValidators: true }
}

mongoose.set('strictQuery', true)//to give error if a filter option like a colum doesn't exist instead of still doing updation/filteration

// plugin to run validators before making connection to validate like .save() but for all updation function so to run validators for updating calls just like .save()

mongoose
  .plugin((schema: any) => {
    schema.pre("findOneAndUpdate", setRunValidators)
    schema.pre("updateMany", setRunValidators)
    schema.pre("updateOne", setRunValidators)
    schema.pre("update", setRunValidators)
  })
  .connect(dbURI!, options)
  .then(() => {
    Logger.info("Mongoose connection done")
  })
  .catch(e => {
    Logger.info("Mongoose connection error")
    Logger.error(e)
  })

//  CONNECTION EVENTS
// When successfully connected
mongoose.connection.on("connected", () => {
  Logger.debug("Mongoose default connection open to " + dbURI)
})

// If the connection throws an error
mongoose.connection.on("error", err => {
  Logger.error("Mongoose default connection error: " + err)
})

// When the connection is disconnected
mongoose.connection.on("disconnected", () => {
  Logger.info("Mongoose default connection disconnected")
})

// If the node process ends, close the Mongoose connection
process.on("SIGINT", () => {
  mongoose.connection.close().finally(() => {
    Logger.info("Mongoose default connection disconnected through app termination")
    process.exit(0)
  })
})

export const connection = mongoose.connection
