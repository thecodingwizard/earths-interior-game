if (!("pages" in window)) {
    window.pages = {};
}

window.pages.intro = {
    title: "Intro",
    showing: false,
    vid: null,
    init: function(controller) {
        videojs('vid').ready(function() {
            var vid = "media/male-intro-vid.mp4";
            if (window.localStorage.gender == "female") {
                vid = "media/female-intro-vid.mp4";
            }
            this.src([
                { type: "video/mp4", src: vid }
            ]);
            window.pages.intro.vid = this;
        });
        
        $("#introNext").click(function() {
            controller.startBootcamp();
        });
    },
    onShowing: function(controller) {
        controller.mute();
        window.pages.intro.vid.play();
    },
    onHiding: function() {
        window.pages.intro.vid.pause();
    }
};
