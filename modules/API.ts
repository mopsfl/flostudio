import $ from "jquery";
import UI from "./UI";

const DOM = {
    searchBtn: $(".search"),
    queryInput: $(".username"),
    error: $(".error"),
    username: $("#username"),
    displayName: $("#displayName"),
    avatar: $("#avatar"),
    finishCount: $("#finishCount"),
    banCount: $("#banCount"),
    freeSkips: $("#freeSkips"),
    checkpoint: $("#currentCheckpoint"),
    accessPassword: $("#accessPassword"),
    login: $(".login"),
    logout: $(".logout"),
}

const API = {
    accessToken: null,
    ongoingRequest: false,
    apiUrl: location.hostname === "localhost" ? "http://localhost:6969/v1/" : "https://api.mopsfl.de/v1/",

    errorCodes: {
        5: "User not found in datastore"
    },

    async GetUserData() {
        if (this.ongoingRequest) return

        const query = DOM.queryInput.val()?.toString().trim();
        if (!query) return;

        this.setLoading(true)
        DOM.error.text("")

        try {
            this.ongoingRequest = true
            const response = await fetch(
                `${this.apiUrl}flostudio/panel/user/${encodeURIComponent(query)}`, {
                headers: { "x-access-token": this.accessToken }
            })

            const json = await response.json()

            if (!response.ok || !json.user || !json.data) {
                this.handleError(json)

                if (response.status === 401) {
                    UI.showPanel(UI.access)
                }
                return
            }

            this.displayUserData(json.user, json.data)
            UI.showPanel(UI.results)
        } catch (err) {
            console.error(err)
            DOM.error.text("Unexpected error occurred!")
            this.ongoingRequest = true
        } finally {
            this.setLoading(false)
            this.ongoingRequest = false
        }
    },

    async Login(checkToken = false) {
        const requestInput = checkToken ? localStorage.getItem("fsp_token") : DOM.accessPassword.val().toString().trim()
        if (!requestInput) return

        this.setLoading(true)
        DOM.error.text("")

        try {
            const response = await fetch(`${this.apiUrl}flostudio/panel/login`, {
                method: "POST",
                body: JSON.stringify(
                    checkToken
                        ? { token: localStorage.getItem("fsp_token") }
                        : { password: DOM.accessPassword.val().toString().trim() }
                )
            })

            const json = await response.json()

            if (!response.ok || !json.success) {
                this.handleError(json)
                return false
            }

            !checkToken && localStorage.setItem("fsp_token", json.token)

            UI.showPanel(UI.app)
            $(".logout").removeClass("hide").hide().fadeIn()
            this.accessToken = localStorage.getItem("fsp_token")
        } catch (err) {
            console.error(err)
            DOM.error.text("Unexpected error occurred!")
            this.ongoingRequest = true
            throw err
        } finally {
            this.setLoading(false)
            this.ongoingRequest = false
        }
    },

    setLoading(state: boolean) {
        DOM.searchBtn.toggleClass("disabled", state)
        DOM.login.toggleClass("disabled", state)
    },

    handleError(response: any) {
        DOM.error.text(this.errorCodes[response.code] || response.message || "Unknown error occurred!")
    },

    displayUserData(user: User, data: Data) {
        DOM.username.text(`@${user.username}`)
        DOM.displayName.text(user.displayName)
        DOM.avatar.attr("src", user.avatar)
        DOM.finishCount.text(data.ObbyData.FinishCount)
        DOM.banCount.text(data.ObbyData.BanCount)
        DOM.freeSkips.text(data.ObbyData.FreeSkips)
        DOM.checkpoint.text(data.ObbyData.CheckpointId)
    }
}

export default API;


export type User = {
    username: string,
    id: number,
    displayName: string,
    avatar: string
}

export type Data = {
    ObbyData: {
        BanCount: number,
        CheckpointId: number,
        Disclaimer_1: boolean,
        FinishCount: number,
        Finished: boolean,
        FreeSkips: number
    },
    Settings: {
        Music: boolean
    }
}