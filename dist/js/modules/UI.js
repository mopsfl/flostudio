"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jquery_1 = __importDefault(require("jquery"));
const UI = {
    access: (0, jquery_1.default)(".accessPassword"),
    app: (0, jquery_1.default)(".app"),
    results: (0, jquery_1.default)(".results"),
    header: (0, jquery_1.default)(".app .panel-header"),
    inputs: (0, jquery_1.default)(".app .inputs"),
    hideAll() {
        this.access.hide();
        this.app.hide();
        this.results.hide();
    },
    showPanel(panel) {
        this.hideAll();
        panel.removeClass("hide").fadeIn();
    },
    showResults() {
        this.results.fadeIn();
        this.header.hide();
        this.inputs.hide();
    },
    backToSearch() {
        this.results.hide();
        this.header.fadeIn();
        this.inputs.fadeIn();
    }
};
exports.default = UI;
