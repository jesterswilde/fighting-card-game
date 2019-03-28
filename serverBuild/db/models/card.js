"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.defineModel = (sequelize) => {
    sequelize.define('card', {
        name: {
            type: sequelize_1.TEXT,
            primaryKey: true
        },
        cardJSON: sequelize_1.JSON,
    });
};
