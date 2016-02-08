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
        var incorrectIndexes = [];
        var incorrectData = [];
        var incorrectIndex = 0;
        var doneCount = 0;
        var lastButtonClickTime = 0;
        
        $(".test-question").each(function(index, element) {
            $(element).find(".test-answers").find(".button").click(function() {
                if (doneCount > index) {
                    return;
                }
                doneCount++;
                progressbar.moveTo(Math.round(questionIndex/questions*100));
                if ($(this).data("correct") == true) {
                    correctCount++;
                    $("#test-correct-message").html("");
                    $("#test-correct-message").html($(this).data("message"));
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
                    incorrectIndexes.push(index);
                    var correct = "";
                    var first = true;
                    $(element).find(".test-answers").find(".button[data-correct='true']").each(function(index, el) {
                        if (first) {
                            first = false;
                            correct += $(el).text();
                        } else {
                            correct += " or " + $(el).text();
                        }
                    })
                    
                    incorrectData.push({
                        "choice": $(this).text(),
                        "correct": correct,
                        "title": $("#test-question-title").text(),
                        "message": $(element).find(".test-answers").find(".button[data-correct='true']").data("message")
                    });
                    $("#test-incorrect-message").html("");
                    $("#test-incorrect-message").html($(this).data("message"));
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
        
        $(".test-review").click(function() {
            if (Date.now() - lastButtonClickTime <= 500) {
                return;
            } else {
                lastButtonClickTime = Date.now();
            }
            $(".test-answers").fadeOut();
            if (incorrectCount > 1) {
                $("#test-fail").fadeOut(function() {
                    if (incorrectIndex < incorrectIndexes.length - 1) {
                        $(".test-review-next").fadeIn();
                    }
                    $("#test-review-message").html(incorrectData[incorrectIndex].message);
                    $(".test-question:nth(" + incorrectIndexes[incorrectIndex] + ")").fadeIn();
                    $("#test-question-title").text(incorrectData[incorrectIndex].title);
                    $("#test-review-choice").text(incorrectData[incorrectIndex].choice);
                    $("#test-review-correct").text(incorrectData[incorrectIndex].correct);
                    incorrectIndex++;
                    if (incorrectIndex >= incorrectIndexes.length) {
                        $(".test-retake").fadeIn();
                    }
                    $("#test-review-data").fadeIn();
                });
            } else {
                $("#test-pass").fadeOut(function() {
                    if (incorrectIndex < incorrectIndexes.length - 1) {
                        $(".test-review-next").fadeIn();
                    }
                    $(".test-question:nth(" + incorrectIndexes[incorrectIndex] + ")").fadeIn();
                    $("#test-question-title").text(incorrectData[incorrectIndex].title);
                    $("#test-review-choice").text(incorrectData[incorrectIndex].choice);
                    $("#test-review-correct").text(incorrectData[incorrectIndex].correct);
                    $(".test-question:nth(" + incorrectIndexes[incorrectIndex] + ")").fadeIn();
                    incorrectIndex++;
                    if (incorrectIndex >= incorrectIndexes.length) {
                        $(".test-retake").fadeIn();
                    }
                    $("#test-review-data").fadeIn();
                });
            }
        });
        $(".test-review-next").click(function() {
            if (Date.now() - lastButtonClickTime <= 500) {
                return;
            } else {
                lastButtonClickTime = Date.now();
            }
            if (incorrectIndex >= incorrectIndexes.length - 1) {
                $(".test-review-next").fadeOut();
            }
            $("#test-review-data").fadeOut();
            $(".test-question:nth(" + incorrectIndexes[incorrectIndex-1] + ")").fadeOut(function() {
                console.log(incorrectIndex);
                $(".test-question:nth(" + incorrectIndexes[incorrectIndex] + ")").fadeIn();
                $("#test-review-data").fadeIn();
                $("#test-question-title").text(incorrectData[incorrectIndex].title);
                $("#test-review-choice").text(incorrectData[incorrectIndex].choice);
                $("#test-review-correct").text(incorrectData[incorrectIndex].correct);
                incorrectIndex++;
                if (incorrectIndex >= incorrectIndexes.length) {
                    $(".test-retake").fadeIn();
                }
            });
        });
        $(".test-retake").click(function() {
            if (Date.now() - lastButtonClickTime <= 500) {
                return;
            } else {
                lastButtonClickTime = Date.now();
            }
            $(".test-question:nth(" + incorrectIndexes[incorrectIndex-1] + ")").fadeOut(function() {
                $(".test-answers").show();
                showNext();
            });
            $("#test-review-data").fadeOut();
            $(this).fadeOut();
            progressbar.moveTo(0);
            questionIndex = 0;
            correctCount = 0;
            incorrectCount = 0;
            incorrectIndexes = [];
            incorrectIndex = 0;
            doneCount = 0;
        })
        
        showNext();
        
        function showNext() {
            if ($(".test-question:nth(" + questionIndex++ + ")").length == 0) {
                $(".test-result").text(correctCount + "/" + questions);
                if (incorrectCount > 1) {
                    $("#test-fail").fadeIn();
                } else {
                    $("#test-pass").fadeIn();
                }
                if (incorrectCount == 0) {
                    $(".test-review").hide();
                }
            } else {
                $(".test-question:nth(" + (questionIndex-1) + ")").fadeIn();
                $("#test-question-title").text($(".test-question:nth(" + (questionIndex-1) + ")").data("title"));
            }
        }
    },
    onShowing: function() {
        
    },
    onHiding: function() {
        
    }
};
