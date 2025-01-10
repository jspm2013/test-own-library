"use server";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AppwriteException } from "node-appwrite";
/**
 * Handles Appwrite errors and maps them to a readable format.
 * @param error - The error to handle.
 * @param locale - The locale for error messages (e.g., "en", "de").
 * @returns {object} - Formatted error object.
 */
export const handleApwError = (error_1, ...args_1) => __awaiter(void 0, [error_1, ...args_1], void 0, function* (error, locale = "en") {
    var _a;
    if (!(error instanceof AppwriteException)) {
        throw error;
    }
    const fs = require("fs");
    const path = require("path");
    const internalError = {
        appwrite: true,
        name: "INTERNAL_ERROR",
        type: "internal_error",
        code: 500,
        variant: "error",
        description: "",
    };
    try {
        const messagesPath = path.join(process.cwd(), "messages/appwrite", `${locale}.json`);
        const exceptionsPath = path.join(__dirname, "exceptions", "exceptions.json");
        let localizedMessages;
        try {
            localizedMessages = JSON.parse(fs.readFileSync(messagesPath, "utf-8"));
        }
        catch (_b) {
            return Object.assign(Object.assign({}, internalError), { description: "DEV-MSG: Failed to read custom i18n files for localization." });
        }
        let allExceptions;
        try {
            allExceptions = JSON.parse(fs.readFileSync(exceptionsPath, "utf-8"));
        }
        catch (_c) {
            return Object.assign(Object.assign({}, internalError), { description: "DEV-MSG: Failed to read the library exceptions file." });
        }
        const { type, code } = error;
        const typeLowerCase = type.toLowerCase();
        const variant = code < 300
            ? "success"
            : code < 400
                ? "info"
                : code < 500
                    ? "warning"
                    : "error";
        const description = localizedMessages[typeLowerCase] ||
            ((_a = allExceptions[type]) === null || _a === void 0 ? void 0 : _a.description) ||
            "DEV-MSG: Unknown library error occurred";
        return {
            appwrite: true,
            name: type,
            type: typeLowerCase,
            code,
            variant,
            description,
        };
    }
    catch (_d) {
        return Object.assign(Object.assign({}, internalError), { description: "DEV-MSG: An unexpected library error occurred while handling the error." });
    }
});
