import $ from "jquery"

const codes = {
    5: "User not found in datastore"
}

const apiUrl = location.hostname === "localhost" ? "http://localhost:6969/v1/" : "https://api.mopsfl.de/v1/"

const search = $(".search"),
    queryInput = $(".username"),
    error = $(".error"),
    results = $(".results"),
    inputs = $(".inputs"),
    header = $("header")

results.hide()

async function lookupUser() {
    try {
        const query = queryInput.val()
        if (!query) return

        search.addClass("disabled")
        error.text("")

        const response = await fetch(`${apiUrl}flostudio/user/data/${query}`)
        const responseJSON = await response.json()

        if (response.ok && responseJSON.user && responseJSON.data) {
            const user: User = responseJSON.user,
                data: Data = responseJSON.data

            inputs.hide()
            header.hide()
            results.show()

            $("#username").text(`@${user.username}`)
            $("#displayName").text(user.displayName)
            $("#avatar").attr("src", user.avatar)
            $("#finishCount").text(data.ObbyData.FinishCount)
            $("#banCount").text(data.ObbyData.BanCount)
            $("#freeSkips").text(data.ObbyData.FreeSkips)
            $("#currentCheckpoint").text(data.ObbyData.CheckpointId)
        } else {
            error.text(codes[responseJSON.code] || responseJSON.message || "Unknown error occurred!")
        }

        search.removeClass("disabled")
    } catch (err) {
        error.text("Unexpected error occurred!")
        search.removeClass("disabled")
    }
}

search.on("click", lookupUser)
$(document).on("keypress", function (e) {
    if (e.which === 13 && document.activeElement === queryInput[0]) {
        lookupUser();
    }
});

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