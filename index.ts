import $ from "jquery";
import API from "./modules/API";
import UI from "./modules/UI";

$(() => {

    if (!localStorage.getItem("fsp_token")) {
        $(".panel.hide").removeClass("hide")
        UI.showPanel(UI.access)
    } else {
        API.Login(true).then(success => {
            $(".panel.hide").removeClass("hide")

            if (success === false) {
                UI.showPanel(UI.access)
            } else {
                UI.showPanel(UI.app)
                $(".logout").removeClass("hide").hide().fadeIn()
            }
        })
    }

    $(".search").on("click", () => {
        API.GetUserData()
    })

    $(".login").on("click", () => {
        API.Login()
    })

    $(".logout").on("click", () => {
        localStorage.removeItem("fsp_token")
        window.location.reload()
    })

    $(".back").on("click", () => {
        UI.showPanel(UI.app)
    })

    $(document).on("keypress", e => {
        if (e.which === 13 && document.activeElement === $(".username")[0]) {
            API.GetUserData();
        }
    });
});
