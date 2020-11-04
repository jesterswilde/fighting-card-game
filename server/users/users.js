"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var username_1 = require("./username");
var user_1 = require("../db/entities/user");
var auth_1 = require("../auth");
var db_1 = require("../db");
var error_1 = require("../error");
exports.createUser = function (email, userPassword) { return __awaiter(void 0, void 0, void 0, function () {
    var user, username, _a, salt, hash, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = new user_1.DBUser();
                return [4 /*yield*/, username_1.makeValidUsername()];
            case 1:
                username = _b.sent();
                return [4 /*yield*/, auth_1.makeHashAndSalt(userPassword)];
            case 2:
                _a = _b.sent(), salt = _a.salt, hash = _a.hash;
                user.salt = salt;
                user.password = hash;
                user.username = username;
                user.email = email;
                return [4 /*yield*/, db_1.userRepo.save(user)];
            case 3:
                _b.sent();
                return [4 /*yield*/, auth_1.createToken(user.serialize())];
            case 4:
                token = _b.sent();
                return [2 /*return*/, token];
        }
    });
}); };
exports.loginWithEmail = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!auth_1.verifyPasswordForEmail(email, password)) {
                    throw error_1.ErrorEnum.INCORRECT_USER_OR_PW;
                }
                return [4 /*yield*/, db_1.userRepo.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw error_1.ErrorEnum.INCORRECT_USER_OR_PW;
                }
                return [4 /*yield*/, auth_1.createToken(user.serialize())];
            case 2:
                token = _a.sent();
                return [2 /*return*/, token];
        }
    });
}); };
exports.getVerifieduser = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var verified, b64, stringified, username, user, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, auth_1.verifyToken(token)];
            case 1:
                verified = _a.sent();
                if (!verified) return [3 /*break*/, 3];
                b64 = token.split('.')[0];
                stringified = Buffer.from(b64).toString('utf-8');
                username = JSON.parse(stringified).username;
                if (!username) return [3 /*break*/, 3];
                return [4 /*yield*/, db_1.userRepo.findOne({ username: username })];
            case 2:
                user = _a.sent();
                return [2 /*return*/, user];
            case 3: throw error_1.ErrorEnum.INVALID_TOKEN;
            case 4:
                err_1 = _a.sent();
                throw err_1;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.validateEmail = function (email) {
    return !!email;
};
exports.validatePassword = function (pw) {
    return pw.length > 7;
};
