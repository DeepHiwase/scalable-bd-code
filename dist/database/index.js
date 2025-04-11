"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import { db } from "../config.js"
const config_1 = require("../config");
// const dbURI = `mongodb://${db.user}:${db.password}@${db.host}:${db.port}/${db.name}`
mongoose_1.default
    .connect(config_1.dbURI)
    .then(() => "MongoDB Connected")
    .catch(err => console.log(err));
