if (!("pages" in window)) {
    window.pages = {};
}

window.pages.bootcamp = {
    title: "Bootcamp!",
    showing: false,
    init: function(controller) {
        var $home_page = $("#homepage");
        var $crust_page = $("#crustpage");
        var $mantle_page = $("#mantlepage");
        var $core_page = $("#corepage");
        var $active_page = $home_page;
        
        var crustIndex = 0;
        crustIndex = moveAndShow(false, "crust", crustIndex, $("#crustNext"), $("#crustBack"));
        
        var mantleIndex = 0;
        mantleIndex = moveAndShow(false, "mantle", mantleIndex, $("#mantleNext"), $("#mantleBack"));
        
        var coreIndex = 0;
        coreIndex = moveAndShow(false, "core", coreIndex, $("#coreNext"), $("#coreBack"));
        
        function moveAndShow(decrement, title, index, $buttonNext, $buttonBack) {
            if (decrement) index--; else index++;
            var $toShow = $("#" + title + "-pt" + index);
            $toFade = $(".bootcamp-section-" + title + ":visible");
            var backBtn = $("#" + title + "-pt" + (index - 1)).length !== 0;
            var nextBtn = $("#" + title + "-pt" + (index + 1)).length !== 0;
            if ($toFade.length !== 0) {
                if ($buttonNext && $buttonBack) {
                    $buttonNext.clearQueue().fadeOut();
                    $buttonBack.clearQueue().fadeOut();
                }
                $toFade.clearQueue().fadeOut(function() {
                    $toShow.clearQueue().fadeIn();
                    if ($buttonBack && backBtn) {
                        $buttonBack.clearQueue().fadeIn();
                    }
                    if ($buttonNext && nextBtn) {
                        $buttonNext.clearQueue().fadeIn();
                    }
                });
            } else {
                $toShow.clearQueue().show();
                if ($buttonBack && backBtn) {
                    $buttonBack.clearQueue().show();
                }
                if ($buttonNext && nextBtn) {
                    $buttonNext.clearQueue().show();
                }
            }
            return index;
        }
        
        $("#crustNext").click(function() {
            crustIndex = moveAndShow(false, "crust", crustIndex, $(this), $("#crustBack"));
        });
        
        $("#crustBack").click(function() {
            crustIndex = moveAndShow(true, "crust", crustIndex, $("#crustNext"), $(this));
        });
        
        $("#mantleNext").click(function() {
            mantleIndex = moveAndShow(false, "mantle", mantleIndex, $(this), $("#mantleBack"));
        });
        
        $("#mantleBack").click(function() {
            mantleIndex = moveAndShow(true, "mantle", mantleIndex, $("#mantleNext"), $(this));
        });
        
        $("#coreNext").click(function() {
            coreIndex = moveAndShow(false, "core", coreIndex, $(this), $("#coreBack"));
        });
        
        $("#coreBack").click(function() {
            coreIndex = moveAndShow(true, "core", coreIndex, $("#coreNext"), $(this));
        });

        $home_page.show();
        
        $(".bootcamp-continue").click(function() {
            switch ($active_page) {
                case $crust_page:
                    $(".bootcamp-active").removeClass("bootcamp-active");
                    $(".bootcamp-mantle").addClass("bootcamp-active");
                    $active_page.fadeOut(function() {
                        $(".bootcamp-page").hide();
                        $mantle_page.fadeIn();
                        $active_page = $mantle_page;
                    });
                    $(".bootcamp-chooser").fadeIn();
                    break;
                case $mantle_page:
                    $(".bootcamp-active").removeClass("bootcamp-active");
                    $(".bootcamp-core").addClass("bootcamp-active");
                    $active_page.fadeOut(function() {
                        $(".bootcamp-page").hide();
                        $core_page.fadeIn();
                        $active_page = $core_page;
                    });
                    $(".bootcamp-chooser").fadeIn();
                    break;
                case $core_page:
                    controller.startTest();
                    break;
            }
        });
        
        $(".bootcamp-crust, #earth #crust").click(function() {
            $(".bootcamp-active").removeClass("bootcamp-active");
            $(".bootcamp-crust").addClass("bootcamp-active");
            $active_page.fadeOut(function() {
                $(".bootcamp-page").hide();
                $crust_page.fadeIn();
                $active_page = $crust_page;
            });
            $(".bootcamp-chooser").fadeIn();
        });
        
        $(".bootcamp-mantle, #earth #mantle").click(function() {
            $(".bootcamp-active").removeClass("bootcamp-active");
            $(".bootcamp-mantle").addClass("bootcamp-active");
            $active_page.fadeOut(function() {
                $(".bootcamp-page").hide();
                $mantle_page.fadeIn();
                $active_page = $mantle_page;
            });
            $(".bootcamp-chooser").fadeIn();
        });
        
        $(".bootcamp-core, #earth #core").click(function() {
            $(".bootcamp-active").removeClass("bootcamp-active");
            $(".bootcamp-core").addClass("bootcamp-active");
            $active_page.fadeOut(function() {
                $(".bootcamp-page").hide();
                $core_page.fadeIn();
                $active_page = $core_page;
            });
            $(".bootcamp-chooser").fadeIn();
        });
        
        $(".bootcamp-chooser").click(function() {
            $(".bootcamp-active").removeClass("bootcamp-active");
            $active_page.fadeOut(function() {
                $(".bootcamp-page").hide();
                $home_page.fadeIn();
                $active_page = $home_page;
                $(".bootcamp-chooser").fadeOut();
            });
        });
        
        var $earth = $("#earth");
        var $crust = $earth.find("#crust");
        var $mantle = $earth.find("#mantle");
        var $core = $earth.find("#core");
        $crust.mouseenter(function() {
            $(".bootcamp-crust").addClass("button-active");
            $(this).attr("r", 150);
        }).mouseleave(function() {
            $(".bootcamp-crust").removeClass("button-active");
            $(this).attr("r", 140);
        });
        $mantle.mouseenter(function() {
            $(".bootcamp-mantle").addClass("button-active");
            $(this).attr("r", 130);
        }).mouseleave(function() {
            $(".bootcamp-mantle").removeClass("button-active");
            $(this).attr("r", 120);
        });
        $core.mouseenter(function() {
            $(".bootcamp-core").addClass("button-active");
            $(this).attr("r", 60);
        }).mouseleave(function() {
            $(".bootcamp-core").removeClass("button-active");
            $(this).attr("r", 50);
        });
        
        $(".bootcamp-crust").mouseenter(function() {
            $crust.attr("r", 150);
        }).mouseleave(function() {
            $crust.attr("r", 140);
        });
        $(".bootcamp-mantle").mouseenter(function() {
            $mantle.attr("r", 130);
        }).mouseleave(function() {
            $mantle.attr("r", 120);
        });
        $(".bootcamp-core").mouseenter(function() {
            $core.attr("r", 60);
        }).mouseleave(function() {
            $core.attr("r", 50);
        });
        
        $(".bootcamp-button:not(.bootcamp-active)").mouseenter(function() {
            $(".bootcamp-active").removeClass("button-hovering");
        }).mouseleave(function() {
            $(".bootcamp-active").addClass("button-hovering");
        });
    },
    onShowing: function() {
        
    },
    onHiding: function() {
        
    }
};
