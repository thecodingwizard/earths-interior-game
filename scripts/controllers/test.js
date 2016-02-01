if (!("pages" in window)) {
    window.pages = {};
}

window.pages.test = {
    title: "Test!",
    showing: false,
    init: function(controller) {
        var progressbar = $("#test-progress").ProgressBarWars({percentage:0,time:500});
        var questions = $(".test-question").length;
        var questionIndex = 0;
        var correctCount = 0;
        var incorrectCount = 0;
        
        $(".test-question").each(function(index, element) {
            $(element).find(".test-answers").find(".button").click(function() {
                progressbar.moveTo(Math.round(questionIndex/questions*100));
                if ($(this).data("correct") == true) {
                    correctCount++;
                    $(element).fadeOut(function() {
                        $("#test-correct").fadeIn(function() {
                            setTimeout(function() {
                                $("#test-correct").fadeOut(function() {
                                    showNext();
                                })
                            }, 1000);
                        });
                    })
                } else {
                    incorrectCount++;
                    $(element).fadeOut(function() {
                        $("#test-incorrect").fadeIn(function() {
                            setTimeout(function() {
                                $("#test-incorrect").fadeOut(function() {
                                    showNext();
                                })
                            }, 1000);
                        });
                    })
                }
            })
        });
        
        showNext();
        
        function showNext() {
            if ($(".test-question:nth(" + questionIndex++ + ")").length == 0) {
                $(".test-result").text(correctCount + "/" + questions);
                if (incorrectCount > 1) {
                    $("#test-fail").fadeIn();
                } else {
                    $("#test-pass").fadeIn();
                }
            } else {
                $(".test-question:nth(" + (questionIndex-1) + ")").fadeIn();
            }
        }
    },
    onShowing: function() {
        
    },
    onHiding: function() {
        
    }
};
