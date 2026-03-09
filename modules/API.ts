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
    deathCount: $("#deathCount"),
    jailCount: $("#jailCount"),
    coins: $("#coins"),
    currentCheckpoint: $("#currentCheckpoint"),
    currentDifficulty: $("#currentDifficulty"),
    isPunished: $("#isPunished"),
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
        DOM.finishCount.text(data.Data.Statistics.Wins)
        DOM.banCount.text(data.Data.Statistics.Bans)
        DOM.deathCount.text(data.Data.Statistics.Deaths)
        DOM.jailCount.text(data.Data.Statistics.Jails)
        DOM.currentCheckpoint.text(data.Data.CurrentCheckpoint)
        DOM.currentDifficulty.text(data.Data.Meta.Difficulty)
        DOM.isPunished.text(data.Data.Meta.CurrentPunishment.Active ? "Yes" : "No")
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
    Data: {
        BanTime: number,
        Coins: number,
        CurrentCheckpoint: number,
        ExploitFlags: { [flagName: string]: number },
        Meta: {
            ClaimedFreeCoins: boolean,
            CurrentPunishment: {
                Active: boolean,
                Time: number
            },
            Difficulty: "easy" | "normal" | "hard",
            LastFinished: number,
            ReadWelcome: boolean
        }
        Statistics: {
            Bans: number,
            Deaths: number,
            Jails: number,
            Playtime: number,
            Wins: number,
            Old: { Bans: number, Wins: number }
        },
        Upgrades: { [upgradeName: string]: number }
        Skips: number,
    },
    MetaData: {
        LastUpdate: number,
        ProfileCreateTime: number,
        MetaTags: Array<any>,
        SessionLoadCount: number
    }
}