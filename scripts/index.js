var music_playing;
var music;
var muted = false;
var backStack = [];
var nice = false;
var timeBeforeNextInsult = 30000;
var lowBandwith = false; 

function enterEducationMode() {
    window.localStorage.setItem("eduMode", true);
    window.location.reload();
}

function exitEducationMode() {
    window.localStorage.removeItem("eduMode");
    window.location.reload();
}

function enterLowBandwithMode() {
    window.localStorage.setItem("lowBandwith", true);
    window.location.reload();
}

function exitLowBandwithMode() {
    window.localStorage.removeItem("lowBandwith");
    window.location.reload();
}

$(document).ready(function() {
    if ("lowBandwith" in window.localStorage) {
        lowBandwith = true;
        $("#mute").hide();
        $("#muteMusic").hide();
    }
    if (!("gender" in window.localStorage)) {
        bootbox.dialog({
            closeButton: false,
            message: "<span class='blacktext'>Choose your gender...</span>",
            title: "<span class='blacktext'>Choose your gender</span>",
            buttons: {
                success: {
                    label: "<span class='blacktext'>Female</span>",
                    className: "button small-button vert-auto",
                    callback: function() {
                        window.localStorage.gender = "female";
                        genderPickedCallback();
                    }
                },
                main: {
                    label: "<span class='blacktext'>Male</span>",
                    className: "button small-button vert-auto",
                    callback: function() {
                        window.localStorage.gender = "male";
                        genderPickedCallback();
                    }
                }
            }
        });
    } else {
        genderPickedCallback();
    }
    
    $("#changeGender").click(function() {
        bootbox.dialog({
            message: "<span class='blacktext'>Choose your gender...\n\nWARNING! Changing your gender" +
                            " will reload the page and result in the loss of all progress made!</span>",
            title: "<span class='blacktext'>Choose your gender</span>",
            buttons: {
                success: {
                    label: "<span class='blacktext'>Female</span>",
                    className: "button small-button vert-auto",
                    callback: function() {
                        window.localStorage.gender = "female";
                        window.localStorage.removeItem("avatar");
                        window.location.reload();
                    }
                },
                main: {
                    label: "<span class='blacktext'>Male</span>",
                    className: "button small-button vert-auto",
                    callback: function() {
                        window.localStorage.gender = "male";
                        window.localStorage.removeItem("avatar");
                        window.location.reload();
                    }
                }
            }
        });
    });
    
    $("#changePoison").click(function() {
        bootbox.dialog({
            message: "<span class='blacktext'>Choose your poison...\n\nWARNING! Changing your poison" +
                            " will reload the page and result in the loss of all progress made!</span>" + $("#avatarPicker").html(),
            title: "<span class='blacktext'>Choose your poison</span>",
            className: "big-modal",
            buttons: {
                main: {
                    label: "<span class='blacktext'>OK</span>",
                    className: "button small-button vert-auto",
                    callback: function() {
                        if (choice == null) {
                            alert("Please choose your poison");
                            return false;
                        } else {
                            window.localStorage.avatar = choice;
                            window.location.reload();
                        }
                    }
                }
            }
        });
        if (window.localStorage.gender == "male") {
            $(".pick-your-poison-male").each(function(index, element) {
                $(element).attr("src", $(element).data("src"));
            });
            $(".pick-your-poison-female").hide();
        } else {
            $(".pick-your-poison-female").each(function(index, element) {
                $(element).attr("src", $(element).data("src"));
            });
            $(".pick-your-poison-male").hide();
        }
        var choice;
        $(".pick-your-poison-img").each(function(index, element) {
            $(element).off("click");
            $(element).click(function() {
                $(".pick-your-poison-active").removeClass("pick-your-poison-active");
                choice = $(element).data("src");
                $(element).addClass("pick-your-poison-active");
            });
        });
    });
    
});

function genderPickedCallback() {
    if (!("avatar" in window.localStorage)) {
        if (window.localStorage.gender == "male") {
            $(".pick-your-poison-male").each(function(index, element) {
                $(element).attr("src", $(element).data("src"));
            });
            $(".pick-your-poison-female").hide();
        } else {
            $(".pick-your-poison-female").each(function(index, element) {
                $(element).attr("src", $(element).data("src"));
            });
            $(".pick-your-poison-male").hide();
        }
        bootbox.dialog({
            closeButton: false,
            message: $("#avatarPicker").html(),
            className: "big-modal",
            title: "<span class='blacktext'>Pick your poison</span>",
            buttons: {
                main: {
                    label: "<span class='blacktext'>OK</span>",
                    className: "button small-button vert-auto",
                    callback: function() {
                        if (choice == null) {
                            alert("Please choose your poison");
                            return false;
                        } else {
                            window.localStorage.avatar = choice;
                            handleMusic();
                            handleContainers();
                        }
                    }
                }
            }
        });
        var choice;
        $(".pick-your-poison-img").each(function(index, element) {
            $(element).click(function() {
                $(".pick-your-poison-active").removeClass("pick-your-poison-active");
                choice = $(element).data("src");
                $(element).addClass("pick-your-poison-active");
            });
        });
    } else {
        handleMusic();
        handleContainers();
    }
}

function handleContainers() {
    if ("eduMode" in window.localStorage) {
        nice = true;
        $("#messagesContainer").hide();
        $("#eduContainer").show();
        $("#beNice").hide();
    }
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
    
    $(".button, .sfx-button-click").click(function() {
        if (!muted && !lowBandwith) {
            var sfx = new Audio("media/button-click.mp3"); 
            sfx.volume = 0.8;
            sfx.play();
        }
    })
    
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
        showMessage: function(message) {
            if (nice) {
                console.log("Since we are nice, We are not goint to insult you.");
                return;
            }
            this.lastInsultTime = Date.now();
            $("#message-content, #message-time, #message-pic").fadeOut(function() {
                $("#message-content").html(message);
                $("#message-pic").attr("src", window.localStorage.avatar);
                $("#message-time").text(new Date().toLocaleTimeString());
                $(this).fadeIn();
            });
        },
        lastInsultTime: 0
    };
    
    showInsult(controller);
    
    var lastInsultClicked = 0;
    $("#messagesContainer").click(function() {
        if (Date.now() - lastInsultClicked > 820) {
            showInsult(controller, true);
            lastInsultClicked = Date.now();
        }
    });
    
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
    
    $("#beNice").click(function() {
        if (nice) {
            $(this).text("Be Nice to Me");
            nice = false;
            $("#messagesContainer").show();
            $("#niceContainer").hide();
        } else {
            $(this).text("Be Mean to Me");
            nice = true;
            $("#messagesContainer").hide();
            $("#niceContainer").show();
        }
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
function showInsult(controller, override) {
    if (Date.now() - controller.lastInsultTime > timeBeforeNextInsult - 1000 || override) {
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
    if (!lowBandwith) {
        music = new Audio("media/music.mp3"); 
        music.volume = 0.75;
        music.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
        music.play();
        music_playing = true;
        
        $("#muteMusic").click(function() {
            if (music_playing) {
                muteMusic();
            } else {
                music.play();
                music_playing = true;
                $(this).text("Mute Music");
            }
        });
        
        $("#mute").click(function() {
            if (muted) {
                muted = false;
                $(this).text("Mute");
            } else {
                $(this).text("Unmute");
                muted = true;
                muteMusic();
            }
        });
    }
}

function muteMusic() {
    if (!lowBandwith) {
        music.pause();
        music_playing = false;
        $("#muteMusic").text("Unmute Music");
    }
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