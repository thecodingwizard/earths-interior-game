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
            var vid = "male-trailer-vid.mp4";
            if (window.localStorage.gender == "female") {
                vid = "female-trailer-vid.mp4";
            }
            this.src([
                { type: "video/mp4", src: vid }
            ]);
            window.pages.home.vid = this;
            this.on("play", function() {
                controller.mute();
            });
        });
    },
    onShowing: function() {
    },
    onHiding: function() {
        window.pages.home.vid.pause();
    }
};