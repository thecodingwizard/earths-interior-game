var music_playing;
var music;
var backStack = [];
var timeBeforeNextInsult = 30000;

$(document).ready(function() {
    
    if (!("gender" in window.localStorage)) {
        bootbox.dialog({
            message: "<span class='blacktext'>Choose your gender...</span>",
            title: "<span class='blacktext'>Choose your gender</span>",
            buttons: {
                success: {
                    label: "<span class='blacktext'>Female</span>",
                    className: "button small-button vert-auto",
                    callback: function() {
                        window.localStorage.gender = "female";
                        handleMusic();
                        handleContainers();
                    }
                },
                main: {
                    label: "<span class='blacktext'>Male</span>",
                    className: "button small-button vert-auto",
                    callback: function() {
                        window.localStorage.gender = "male";
                        handleMusic();
                        handleContainers();
                    }
                }
            }
        });
    } else {
        handleMusic();
        handleContainers();
    }
    
    $("#changeGender").click(function() {
        bootbox.dialog({
            message: "<span class='blacktext'>Choose your gender...\n\nWARNING! Changing your gender" +
                            "will reload the page and result in the loss of all progress made!</span>",
            title: "<span class='blacktext'>Choose your gender</span>",
            buttons: {
                success: {
                    label: "<span class='blacktext'>Female</span>",
                    className: "button small-button vert-auto",
                    callback: function() {
                        window.localStorage.gender = "female";
                        window.location.reload();
                    }
                },
                main: {
                    label: "<span class='blacktext'>Male</span>",
                    className: "button small-button vert-auto",
                    callback: function() {
                        window.localStorage.gender = "male";
                        window.location.reload();
                    }
                }
            }
        });
    });
    
});

function handleContainers() {
    var $homeContainer = $("#homeContainer");
    var $bootcampContainer = $("#bootcampContainer");
    var $introContainer = $("#introContainer");
    var $activeContainer = $homeContainer;
    var $testContainer = $("#testContainer");
    
    var homeController = window.pages.home;
    var bootcampController = window.pages.bootcamp;
    var introController = window.pages.intro;
    var testController = window.pages.test;
    
    var currentPage = "home";
    
    updateBackButton();
    
    var controller = {
        startBootcamp: function(skipBackStack) {
            $("#title").fadeOut(function() {
                $("#title").text(bootcampController.title);
                $("#title").fadeIn();
            });
            bootcampController.showing = true;
            homeController.showing = false;
            introController.showing = false;
            testController.showing = false;
            
            bootcampController.onShowing(controller);
            homeController.onHiding(controller);
            introController.onHiding(controller);
            testController.onHiding(controller);
            
            if (!skipBackStack) {
                backStack.push(currentPage);
            }
            currentPage = "bootcamp";
            updateBackButton();
            
            $activeContainer.fadeOut(function() {
                $bootcampContainer.fadeIn();
                $activeContainer = $bootcampContainer;
            });
        },
        startHome: function(skipBackStack) {
            $("#title").fadeOut(function() {
                $("#title").text(homeController.title);
                $("#title").fadeIn();
            });
            bootcampController.showing = false;
            homeController.showing = true;
            introController.showing = false;
            testController.showing = false;
            
            bootcampController.onHiding(controller);
            introController.onHiding(controller);
            homeController.onShowing(controller);
            testController.onHiding(controller);
            
            if (!skipBackStack) {
                backStack.push(currentPage);
            }
            currentPage = "home";
            updateBackButton();
            
            $activeContainer.fadeOut(function() {
                $homeContainer.fadeIn();
                $activeContainer = $homeContainer;
            });
        },
        startIntro: function(skipBackStack) {
            $("#title").fadeOut(function() {
                $("#title").text(introController.title);
                $("#title").fadeIn();
            });
            bootcampController.showing = false;
            homeController.showing = false;
            introController.showing = true;
            testController.showing = false;
            
            bootcampController.onHiding(controller);
            homeController.onHiding(controller);
            introController.onShowing(controller);
            testController.onHiding(controller);
            
            if (!skipBackStack) {
                backStack.push(currentPage);
            }
            currentPage = "intro";
            updateBackButton();
            
            $activeContainer.fadeOut(function() {
                $introContainer.fadeIn();
                $activeContainer = $introContainer;
            });
        },
        startTest: function(skipBackStack) {
            $("#title").fadeOut(function() {
                $("#title").text(testController.title);
                $("#title").fadeIn();
            });
            bootcampController.showing = false;
            homeController.showing = false;
            testController.showing = true;
            introController.showing = false;
            
            bootcampController.onHiding(controller);
            homeController.onHiding(controller);
            introController.onHiding(controller);
            testController.onShowing(controller);
            
            if (!skipBackStack) {
                backStack.push(currentPage);
            }
            currentPage = "test";
            updateBackButton();
            
            $activeContainer.fadeOut(function() {
                $testContainer.fadeIn();
                $activeContainer = $testContainer;
            });
        },
        mute: function() {
            muteMusic();
        },
        showMessage: function(data) {
            this.lastInsultTime = Date.now();
            $("#message-content, #message-time, #message-pic").fadeOut(function() {
                $("#message-content").html(data.message);
                if (data.pic) {
                    $("#message-pic").setAttribute("src", data.pic);
                }
                $("#message-time").text(new Date().toLocaleTimeString());
                $(this).fadeIn();
            });
        },
        lastInsultTime: 0
    };
    
    showInsult(controller);
    
    setTimeout(showInsult(controller), timeBeforeNextInsult);
    
    $("#back").click(function() {
        console.log(backStack);
        switch (backStack.pop()) {
            case "bootcamp":
                controller.startBootcamp(true);
                break;
            case "home":
                controller.startHome(true);
                break;
            case "intro":
                controller.startIntro(true);
                break;
            case "test":
                controller.startTest(true);
                break;
        }
        updateBackButton();
    });
    
    homeController.init(controller);
    homeController.showing = true;
    bootcampController.init(controller);
    bootcampController.showing = false;
    introController.init(controller);
    introController.showing = false;
    testController.init(controller);
    testController.showing = false;

    $("#title").text(homeController.title);
    $homeContainer.show();
}

var insultIndex = 0;
function showInsult(controller) {
    if (Date.now() - controller.lastInsultTime > timeBeforeNextInsult - 1000) {
        if (window.localStorage.gender == "male") {
            if (window.insults.male.length <= insultIndex) {
                insultIndex = 0;
            }
            controller.showMessage(window.insults.male[insultIndex]);
            insultIndex++;
        } else {
            if (window.insults.female.length <= insultIndex) {
                insultIndex = 0;
            }
            controller.showMessage(window.insults.female[insultIndex]);
            insultIndex++;
        }
    }
    setTimeout(function() {
        showInsult(controller);
    }, timeBeforeNextInsult);
}

function updateBackButton() {
    console.log(backStack);
    if (backStack.length === 0) {
        $("#back").fadeOut();
    } else if (!$("#back").is(":visible")) {
        $("#back").fadeIn();
    }
}

function handleMusic() {
    music = new Audio("media/music.mp3"); 
    music.volume = 0.5;
    music.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    music.play();
    music_playing = true;
    
    $("#mute").click(function() {
        if (music_playing) {
            muteMusic();
        } else {
            music.play();
            music_playing = true;
            $(this).text("Mute");
        }
    });
}

function muteMusic() {
    music.pause();
    music_playing = false;
    $("#mute").text("Unmute");
}

function speak(txt) {
    if ('speechSynthesis' in window) {
        var msg = new SpeechSynthesisUtterance(txt);
        msg.default = true;
        msg.lang = 'en-US';
        window.speechSynthesis.speak(msg);
    } else {
        console.log("No speech synthesis available");
    }
}