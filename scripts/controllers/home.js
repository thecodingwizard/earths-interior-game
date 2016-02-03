if (!("pages" in window)) {
    window.pages = {};
}

window.pages.home = {
    title: "Earth's Interior Game",
    showing: false,
    vid: null,
    init: function(controller) {
        var $btnIntro = $("#homeIntroduction");
        var $btnBootcamp = $("#homeBootcamp");
        var $btnTest = $("#homeTest");
        var $btnJeopardy = $("#homeJeopardy");
        var alternativeTrailer = "media/trailer-opt-2.mp4";
        
        $btnBootcamp.click(function() {
            controller.startBootcamp();
        });
       
        $btnJeopardy.click(function() {
            controller.mute();
            window.open("https://docs.google.com/presentation/d/144_6sCGURBERJ-vjPTgWKLlZfADFrVte45HRWsWivfQ/present?usp=sharing");
        });
        
        $btnIntro.click(function() {
            controller.startIntro();
        });
        
        $btnTest.click(function() {
            controller.startTest();
        });
        
        videojs('vidTrailer').ready(function() {
            var vid = "media/male-trailer-vid.mp4";
            if (window.localStorage.gender == "female") {
                vid = "media/female-trailer-vid.mp4";
            }
            if (Math.round(Math.random()) == 0) {
                this.src([
                    { type: "video/mp4", src: vid }
                ]);
            } else {
                this.src([
                    { type: "video/mp4", src: alternativeTrailer }
                ]);
                alternativeTrailer = vid;
            }
            window.pages.home.vid = this;
            this.on("play", function() {
                controller.mute();
            });
        });
        
        $("#vidTrailer-switch").click(function() {
            var alt = alternativeTrailer;
            alternativeTrailer = window.pages.home.vid.currentSrc();
            window.pages.home.vid.src([
                { type: "video/mp4", src: alt }
            ]);
        });
    },
    onShowing: function() {
    },
    onHiding: function() {
        window.pages.home.vid.pause();
    }
};