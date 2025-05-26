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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocationKey = getLocationKey;
exports.getCurrentWeather = getCurrentWeather;
const axios_1 = __importDefault(require("axios"));
const API_KEY = process.env.ACCUWEATHER_API_KEY || '';
const BASE_URL = 'http://dataservice.accuweather.com';
function getLocationKey(city) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${BASE_URL}/locations/v1/cities/search`;
        const response = yield axios_1.default.get(url, {
            params: { apikey: API_KEY, q: city }
        });
        if (response.data.length > 0) {
            return response.data[0].Key;
        }
        throw new Error('Location not found');
    });
}
function getCurrentWeather(locationKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${BASE_URL}/currentconditions/v1/${locationKey}`;
        const response = yield axios_1.default.get(url, {
            params: { apikey: API_KEY }
        });
        return response.data[0];
    });
}
