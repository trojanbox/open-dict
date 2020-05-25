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
var reader_1 = require("./src/app/module/reader");
var qsort_1 = require("./src/app/module/qsort");
var writer_1 = require("./src/app/module/writer");
var loser_tree_1 = require("./src/app/module/loser-tree");
var queue_reader_1 = require("./src/app/module/queue-reader");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var fileList, reader, totalReaders, _a, _b, _i, i, _c, _d, fileName, writer, lt;
        var _this = this;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    console.log('start...');
                    fileList = [];
                    reader = new reader_1.Reader({ mode: 'r' });
                    return [4 /*yield*/, reader.open('D:\\test\\dict-source.txt')];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, reader.getItemList(function (list) { return __awaiter(_this, void 0, void 0, function () {
                            var sort, fileName, fileFullName, writer, _i, sort_1, item;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        sort = qsort_1.qsort(list, function (a, b) { return a.keyword < b.keyword; });
                                        fileName = Math.random() * 1e20;
                                        fileFullName = 'D:\\test\\temp\\' + fileName + '.tmp';
                                        writer = new writer_1.Writer({ mode: 'w' });
                                        fileList.push(fileFullName);
                                        return [4 /*yield*/, writer.open(fileFullName)];
                                    case 1:
                                        _a.sent();
                                        _i = 0, sort_1 = sort;
                                        _a.label = 2;
                                    case 2:
                                        if (!(_i < sort_1.length)) return [3 /*break*/, 5];
                                        item = sort_1[_i];
                                        return [4 /*yield*/, writer.writeLnLazy(JSON.stringify(item))];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        _i++;
                                        return [3 /*break*/, 2];
                                    case 5: return [4 /*yield*/, writer.done()];
                                    case 6:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 10000)];
                case 2:
                    _e.sent();
                    totalReaders = [];
                    _a = [];
                    for (_b in fileList)
                        _a.push(_b);
                    _i = 0;
                    _e.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    i = _a[_i];
                    if (!fileList.hasOwnProperty(i)) return [3 /*break*/, 5];
                    _d = (_c = totalReaders).push;
                    return [4 /*yield*/, new queue_reader_1.QueueReader({ mode: 'r+' }).open(fileList[i])];
                case 4:
                    _d.apply(_c, [_e.sent()]);
                    _e.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    fileName = 'merge_file';
                    writer = new writer_1.Writer({ mode: 'w' });
                    return [4 /*yield*/, writer.open('D:\\test\\temp\\' + fileName + '.tmp')];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, new loser_tree_1.LoserTree(function (a, b) { return parseInt(a.keyword) > parseInt(b.keyword); })];
                case 8:
                    lt = _e.sent();
                    return [4 /*yield*/, lt.bindDataSource(totalReaders)];
                case 9:
                    _e.sent();
                    return [4 /*yield*/, lt.getItem(function (item) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, writer.writeLnLazy(JSON.stringify(item))];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })];
                case 10:
                    _e.sent();
                    return [4 /*yield*/, writer.done()];
                case 11:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main().then(function () {
});
