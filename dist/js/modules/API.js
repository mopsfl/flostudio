"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jquery_1 = __importDefault(require("jquery"));
const UI_1 = __importDefault(require("./UI"));
const DOM = {
    searchBtn: (0, jquery_1.default)(".search"),
    queryInput: (0, jquery_1.default)(".username"),
    error: (0, jquery_1.default)(".error"),
    username: (0, jquery_1.default)("#username"),
    displayName: (0, jquery_1.default)("#displayName"),
    avatar: (0, jquery_1.default)("#avatar"),
    finishCount: (0, jquery_1.default)("#finishCount"),
    banCount: (0, jquery_1.default)("#banCount"),
    freeSkips: (0, jquery_1.default)("#freeSkips"),
    checkpoint: (0, jquery_1.default)("#currentCheckpoint"),
    accessPassword: (0, jquery_1.default)("#accessPassword"),
    login: (0, jquery_1.default)(".login"),
    logout: (0, jquery_1.default)(".logout"),
};
const API = {
    accessToken: null,
    ongoingRequest: false,
    apiUrl: location.hostname === "localhost" ? "http://localhost:6969/v1/" : "https://api.mopsfl.de/v1/",
    errorCodes: {
        5: "User not found in datastore"
    },
    async GetUserData() {
        if (this.ongoingRequest)
            return;
        const query = DOM.queryInput.val()?.toString().trim();
        if (!query)
            return;
        this.setLoading(true);
        DOM.error.text("");
        try {
            this.ongoingRequest = true;
            const response = await fetch(`${this.apiUrl}flostudio/panel/user/${encodeURIComponent(query)}`, {
                headers: { "x-access-token": this.accessToken }
            });
            const json = await response.json();
            if (!response.ok || !json.user || !json.data) {
                this.handleError(json);
                if (response.status === 401) {
                    UI_1.default.showPanel(UI_1.default.access);
                }
                return;
            }
            this.displayUserData(json.user, json.data);
            UI_1.default.showPanel(UI_1.default.results);
        }
        catch (err) {
            console.error(err);
            DOM.error.text("Unexpected error occurred!");
            this.ongoingRequest = true;
        }
        finally {
            this.setLoading(false);
            this.ongoingRequest = false;
        }
    },
    async Login(checkToken = false) {
        const requestInput = checkToken ? localStorage.getItem("fsp_token") : DOM.accessPassword.val().toString().trim();
        if (!requestInput)
            return;
        this.setLoading(true);
        DOM.error.text("");
        try {
            const response = await fetch(`${this.apiUrl}flostudio/panel/login`, {
                method: "POST",
                body: JSON.stringify(checkToken
                    ? { token: localStorage.getItem("fsp_token") }
                    : { password: DOM.accessPassword.val().toString().trim() })
            });
            const json = await response.json();
            if (!response.ok || !json.success) {
                this.handleError(json);
                return false;
            }
            !checkToken && localStorage.setItem("fsp_token", json.token);
            UI_1.default.showPanel(UI_1.default.app);
            (0, jquery_1.default)(".logout").removeClass("hide").hide().fadeIn();
            this.accessToken = localStorage.getItem("fsp_token");
        }
        catch (err) {
            console.error(err);
            DOM.error.text("Unexpected error occurred!");
            this.ongoingRequest = true;
            throw err;
        }
        finally {
            this.setLoading(false);
            this.ongoingRequest = false;
        }
    },
    setLoading(state) {
        DOM.searchBtn.toggleClass("disabled", state);
        DOM.login.toggleClass("disabled", state);
    },
    handleError(response) {
        DOM.error.text(this.errorCodes[response.code] || response.message || "Unknown error occurred!");
    },
    displayUserData(user, data) {
        DOM.username.text(`@${user.username}`);
        DOM.displayName.text(user.displayName);
        DOM.avatar.attr("src", user.avatar);
        DOM.finishCount.text(data.ObbyData.FinishCount);
        DOM.banCount.text(data.ObbyData.BanCount);
        DOM.freeSkips.text(data.ObbyData.FreeSkips);
        DOM.checkpoint.text(data.ObbyData.CheckpointId);
    }
};
exports.default = API;
