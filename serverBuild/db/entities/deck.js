"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const card_1 = require("./card");
const user_1 = require("./user");
const fightingStyle_1 = require("./fightingStyle");
let DBDeck = class DBDeck {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], DBDeck.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], DBDeck.prototype, "name", void 0);
__decorate([
    typeorm_1.ManyToMany(type => card_1.DBCard),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], DBDeck.prototype, "cards", void 0);
__decorate([
    typeorm_1.ManyToMany(type => fightingStyle_1.DBFightingStyle),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], DBDeck.prototype, "styles", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_1.DBUser, user => user.decks),
    __metadata("design:type", user_1.DBUser)
], DBDeck.prototype, "user", void 0);
DBDeck = __decorate([
    typeorm_1.Entity()
], DBDeck);
exports.DBDeck = DBDeck;
