import $ from "jquery";

const UI = {
    access: $(".accessPassword"),
    app: $(".app"),
    results: $(".results"),
    header: $(".app .panel-header"),
    inputs: $(".app .inputs"),

    hideAll() {
        this.access.hide()
        this.app.hide()
        this.results.hide()
    },

    showPanel(panel: JQuery<HTMLElement>) {
        this.hideAll()
        panel.removeClass("hide").fadeIn()
    },

    showResults() {
        this.results.fadeIn()
        this.header.hide()
        this.inputs.hide()
    },

    backToSearch() {
        this.results.hide()
        this.header.fadeIn()
        this.inputs.fadeIn()
    }
}

export default UI;
