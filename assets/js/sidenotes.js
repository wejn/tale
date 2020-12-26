/*
 * @author: Kaushik Gopal
 * @author: Michal Jirku
 *
 * A jQuery function that displays the footnotes
 * on the side (sidenotes) for easier reading.
 *
 * This is as recommended by Edward Tufte's style sidenotes:
 * https://edwardtufte.github.io/tufte-css/#sidenotes
 *
 * ---
 *
 *  Changelog:
 *  - 2020-12-26, Michal Jirku
 *    - switch to resizing (rather than removing and re-initializing)
 *    - run resize triggers via setInterval and from resize/font hooks
 *    - setInterval finally fixes iOS sizing issues for stlviewer
 *    - remove bunch of "global" vars
 *  - 2020-11-23, Michal Jirku
 *    - make sidenotes flexible width
 *    - make sidenotes not overlap one another
 *    - make sidenotes reload on font load (to help with &previous)
 *    - make sidenotes compatible with multiple links to the same note
 *  - 2020-09-07, Kaushik Gopal
 *    - initial version from https://blog.jkl.gg/jekyll-footnote-tufte-sidenote/
 *
 */
(function () {
    function showSidenote(index, sup, fnli, prev) {
        // construct sidenote div
        let content = fnli.eq(index).html();
        let div = $(document.createElement("div"));
        div.html("<span class=\"sidenote-header\">" + (index+1) + ". </span>" + content);
        div.addClass("sidenote");

        let sizeit = function() {
            let ww = $("main").outerWidth() + $("main").offset().left;
            let position = sup.offset();
            let minh = 0;
            if (prev != null) {
                minh = prev.position().top + prev.height() + 5;
            }

            div.css({
                "position": "absolute",
                "left": ww,
                "top": minh > position["top"] ? minh : position["top"],
                "min-width": ww > 420 ? ww/4 : ww/3,
                "max-width": ww/3,
            });

            if (ww > 420) {
                if (div.hasClass("sidenote-perma-hover")) {
                    div.removeClass("sidenote-hover");
                    div.removeClass("sidenote-perma-hover");
                }
                sup.hover(function() {
                    div.addClass("sidenote-hover");
                }, function () {
                    div.removeClass("sidenote-hover");
                });
            } else {
                div.addClass("sidenote-hover");
                div.addClass("sidenote-perma-hover");
            }

        };

        sizeit();

        div.data("sizing-func", sizeit); // called from hooks
        setInterval(sizeit, 3000); // last resort, but also fix for dynamic pages

        $(document.body).append(div);

        return div;
    }

    $(window).on("load", function() {
        let fnli = $(".footnotes").find("ol li");

        // Load sidenotes
        let prev = null;
        // kramdown
        $("sup[role='doc-noteref']").each(function(index, el) {
            prev = showSidenote(el.textContent - 1, $(this), fnli, prev);
        });
        // commonmark
        $("sup[class='footnote-ref']").each(function(index, el) {
            prev = showSidenote(el.textContent - 1, $(this), fnli, prev);
        });


        // Helper functions
        let hideNotes = function() {
            const ww = $("main").outerWidth() + $("main").offset().left;
            if (ww > 420) {
                $(".footnotes").hide();
            } else {
                $(".footnotes").show();
            }
        };

        let resizeNotes = function() {
            $(".sidenote").each(function(index, el) {
                $(this).data("sizing-func")();
            });
        };

        // Run + bind them to triggers
        hideNotes();

        $(window).resize(function() {
            hideNotes();
            resizeNotes();
        });

        document.fonts.onloadingdone = function(fss) {
            resizeNotes();
        };
    });

})();
