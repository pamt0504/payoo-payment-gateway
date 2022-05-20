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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayooModule = void 0;
var crypto = require("crypto");
var moment = require("moment-timezone");
var node_fetch_1 = require("node-fetch");
var PayooModule = /** @class */ (function () {
    function PayooModule(_a) {
        var username = _a.username, shopId = _a.shopId, shopTitle = _a.shopTitle, checksumKey = _a.checksumKey, endpointCheckout = _a.endpointCheckout, shopDomain = _a.shopDomain, endpointRefund = _a.endpointRefund, apiUsername = _a.apiUsername, apiUserpassword = _a.apiUserpassword, apiSignature = _a.apiSignature;
        this.username = username;
        this.shopId = shopId;
        this.shopTitle = shopTitle;
        this.checksumKey = checksumKey;
        this.endpointCheckout = endpointCheckout;
        this.shopDomain = shopDomain;
        this.endpointRefund = endpointRefund;
        this.apiUsername = apiUsername;
        this.apiUserpassword = apiUserpassword;
        this.apiSignature = apiSignature;
    }
    PayooModule.prototype.createOrderRequest = function (_a) {
        var orderId = _a.orderId, orderNumber = _a.orderNumber, amount = _a.amount, returnUrl = _a.returnUrl, notifyUrl = _a.notifyUrl;
        return __awaiter(this, void 0, void 0, function () {
            var reqData, result, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        reqData = {
                            data: this.createOrderXml({ orderId: orderId, orderNumber: orderNumber, returnUrl: returnUrl, amount: amount, notifyUrl: notifyUrl }),
                            checksum: this.createSHA512(this.checksumKey + this.createOrderXml({ orderId: orderId, orderNumber: orderNumber, returnUrl: returnUrl, amount: amount, notifyUrl: notifyUrl })),
                            refer: this.shopDomain,
                            // payment_group: 'CC,Bank-account',
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, node_fetch_1.default)(this.endpointCheckout, {
                                method: 'POST',
                                body: JSON.stringify(reqData),
                            })];
                    case 2:
                        result = _b.sent();
                        return [2 /*return*/, result.json()];
                    case 3:
                        err_1 = _b.sent();
                        console.log('payoo err', err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PayooModule.prototype.createOrderXml = function (_a) {
        var orderId = _a.orderId, returnUrl = _a.returnUrl, orderNumber = _a.orderNumber, amount = _a.amount, notifyUrl = _a.notifyUrl;
        return ('<shops>' +
            '<shop>' +
            "<username>".concat(this.username, "</username>") +
            "<shop_id>".concat(this.shopId, "</shop_id>") +
            "<session>".concat(orderId, "</session>") +
            "<shop_title>".concat(this.shopTitle, "</shop_title>") +
            "<shop_domain>".concat(this.shopDomain, "</shop_domain>") +
            "<shop_back_url>".concat(encodeURIComponent(returnUrl), "</shop_back_url>") +
            "<order_no>".concat(orderNumber, "</order_no>") +
            "<order_cash_amount>".concat(amount, "</order_cash_amount>") +
            "<order_ship_date>".concat(moment()
                .add(3, 'days')
                .format('DD/MM/YYYY'), "</order_ship_date>") +
            '<order_ship_days>3</order_ship_days>' +
            "<order_description>".concat(encodeURIComponent("Thanh toan cho hoa don so ".concat(orderNumber, "  gia tri ").concat(amount)), "</order_description>") +
            "<validity_time>".concat(this.getDateValidity(), "</validity_time>") +
            "<JsonResponse>TRUE</JsonResponse>" +
            "<notify_url>".concat(notifyUrl, "</notify_url>") +
            '</shop>' +
            '</shops>');
    };
    PayooModule.prototype.createSHA512 = function (text) {
        var hash = crypto.createHash('sha512');
        //passing the data to be hashed
        var data = hash.update(text);
        //Creating the hash in the required format
        return data.digest('hex');
    };
    PayooModule.prototype.getDateValidity = function () {
        return moment()
            .add(1, 'hours')
            .format('yyyyMMDDHHmmss'); //Request will get invalid after 1 hours
    };
    PayooModule.prototype.verifyNotifyData = function (_a) {
        var ip = _a.ip, xml = _a.xml;
        return __awaiter(this, void 0, void 0, function () {
            var data, result, checksum, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        data = JSON.parse(Buffer.from(xml, 'base64').toString());
                        result = JSON.parse(data.ResponseData);
                        return [4 /*yield*/, this.createSHA512(this.checksumKey + data.ResponseData + ip)];
                    case 1:
                        checksum = _b.sent();
                        // check signature
                        if (checksum.toUpperCase() !== data.Signature.toUpperCase()) {
                            throw new Error('The signature is incorrect.');
                        }
                        return [2 /*return*/, result];
                    case 2:
                        err_2 = _b.sent();
                        throw new Error('This order already paid.');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PayooModule.prototype.verifyPayment = function (_a) {
        var status = _a.status, session = _a.session, order_no = _a.order_no, checksum = _a.checksum, totalAmount = _a.totalAmount, paymentFee = _a.paymentFee;
        return __awaiter(this, void 0, void 0, function () {
            var checksumValue;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.createSHA512(this.checksumKey + session + '.' + order_no + '.' + status)];
                    case 1:
                        checksumValue = _b.sent();
                        if (checksum !== checksumValue) {
                            throw new Error('The signature is incorrect.');
                        }
                        if (status !== '1') {
                            throw new Error('The transaction was not completed.');
                        }
                        return [2 /*return*/, {
                                status: status,
                                session: session,
                                order_no: order_no,
                                checksum: checksum,
                                totalAmount: totalAmount,
                                paymentFee: paymentFee,
                            }];
                }
            });
        });
    };
    PayooModule.prototype.refundPayment = function (_a) {
        var OrderNo = _a.OrderNo, PurchaseDate = _a.PurchaseDate, Money = _a.Money, Description = _a.Description;
        return __awaiter(this, void 0, void 0, function () {
            var requestData, checksumValue, res, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        requestData = {
                            OrderNo: OrderNo,
                            Money: Money,
                            Description: Description,
                            ActionType: 2,
                            PurchaseDate: PurchaseDate.substring(0, 8),
                        };
                        return [4 /*yield*/, this.createSHA512(this.checksumKey +
                                "{\"OrderNo\":\"".concat(OrderNo, "\",\"Money\":").concat(Money, ",\"Description\":\"").concat(Description, "\",\"ActionType\":2,\"PurchaseDate\":\"").concat(PurchaseDate.substring(0, 8), "\"}"))];
                    case 1:
                        checksumValue = _b.sent();
                        return [4 /*yield*/, (0, node_fetch_1.default)(this.endpointRefund, {
                                method: 'POST',
                                headers: {
                                    'content-type': 'application/json',
                                    APIUsername: this.apiUsername,
                                    APIPassword: this.apiUserpassword,
                                    APISignature: this.apiSignature,
                                },
                                body: JSON.stringify({
                                    RequestData: JSON.stringify(requestData),
                                    Signature: checksumValue,
                                }),
                            })];
                    case 2:
                        res = _b.sent();
                        return [4 /*yield*/, res.json()];
                    case 3:
                        result = _b.sent();
                        return [2 /*return*/, JSON.parse(result.ResponseData)];
                }
            });
        });
    };
    return PayooModule;
}());
exports.PayooModule = PayooModule;
