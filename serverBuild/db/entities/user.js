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
const deck_1 = require("./deck");
const feedback_1 = require("./feedback");
let DBUser = class DBUser {
    constructor() {
        this.serialize = () => {
            return { username: this.username };
        };
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], DBUser.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], DBUser.prototype, "username", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], DBUser.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], DBUser.prototype, "password", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], DBUser.prototype, "salt", void 0);
__decorate([
    typeorm_1.OneToMany(type => deck_1.DBDeck, deck => deck.user),
    __metadata("design:type", Array)
], DBUser.prototype, "decks", void 0);
__decorate([
    typeorm_1.OneToMany(type => feedback_1.DBFeedback, fb => fb.user),
    __metadata("design:type", Array)
], DBUser.prototype, "feedbacks", void 0);
DBUser = __decorate([
    typeorm_1.Entity({ name: "User" })
], DBUser);
exports.DBUser = DBUser;
