/*
 * @author: Kaushik Gopal
 * @author: Michal Jirků
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
 *  - 2020-11-23, Michal Jirků
 *    - make sidenotes flexible width
 *    - make sidenotes not overlap one another
 *    - make sidenotes reload on font load (to help with &previous)
 *    - make sidenotes compatible with multiple links to the same note
 *  - 2020-09-07, Kaushik Gopal
 *    - initial version from https://blog.jkl.gg/jekyll-footnote-tufte-sidenote/
 *
 */
(function () {

    function showSidenote(index, sup, ww, $fnli, minh) {

        // construct sidenote div
        let content = $fnli.eq(index).html();
        let div = $(document.createElement('div'));
        div.html("<span class=\"sidenote-header\">" + (index+1) + ". </span>" +
            content);
        div.addClass("sidenote");
        let position = sup.offset();

        div.css({
            position: "absolute",
            left: ww,
            top: minh > position["top"] ? minh : position["top"],
            'min-width': ww > 420 ? ww/4 : ww/3,
            'max-width': ww/3,
        });

        if (ww > 420) {
            sup.hover(function() {
                div.addClass("sidenote-hover");
            }, function () {
                div.removeClass("sidenote-hover");
            });
        } else {
            div.addClass("sidenote-hover");
        }

        // console.log("props " + ww + " fn: " + $fnli.text());

        $(document.body).append(div);

        // console.log("sidenote: " + index + " top: " + div.position().top + " height: " + div.height());

        return div.position().top + div.height() + 5;
    }

    function loadSidenotes(ww, $fnli, fncount, $fn) {
        let minh = 0;
        // kramdown
        $("sup[role='doc-noteref']").each(function(index, el) {
            minh = showSidenote(el.textContent - 1, $(this), ww, $fnli, minh);
        });
        // commonmark
        $("sup[class='footnote-ref']").each(function(index, el) {
            minh = showSidenote(el.textContent - 1, $(this), ww, $fnli, minh);
        });
        if (ww > 420) {
            $fn.hide();
        } else {
            $fn.show();
        }

    }

    $(window).on("load", function() {
        let $fn = $(".footnotes"),
            $fnli = $fn.find("ol li"),
            fncount = $fnli.length,
            ww = $("main").outerWidth() + $("main").offset().left;

        // load first time
        loadSidenotes(ww, $fnli, fncount, $fn);

        $(window).resize(function() {
            const new_ww = $("main").outerWidth() + $("main").offset().left;
            if (new_ww === ww) return;

            // console.log(" XXX -- RESIZE -- XXX ");
            ww = new_ww;
            $(".sidenote").remove();
            loadSidenotes(ww, $fnli, fncount, $fn);
        });

        // fonts have a power to blow up the size of the sidenotes, hence the
        // need to adjust
        document.fonts.onloadingdone = function(fss) {
            ww = $("main").outerWidth() + $("main").offset().left;
            $(".sidenote").remove();
            loadSidenotes(ww, $fnli, fncount, $fn);
        };
    });

})();
