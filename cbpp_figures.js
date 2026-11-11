/*globals module*/
module.exports = function($) {
    "use strict";
    /*polyfill for IE8*/
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(elt /*, from*/) {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0)
                ? Math.ceil(from)
                : Math.floor(from);
            if (from < 0)
            from += len;

            for (; from < len; from++)
            {
            if (from in this &&
                this[from] === elt)
                return from;
            }
            return -1;
        };
    }
    if (typeof(CBPP_Figures)!=="undefined") {
        return;
    }
    var typekitLoaded = false;
    var TypekitRequested = false;
    var CBPP_Figures = {};
    CBPP_Figures.ready = false;

    /*load dependencies*/
    require("./cbpp_figures.scss");
    function ready() {
        if (CBPP_Figures.ready) {return;}
        if (typekitLoaded) {
            CBPP_Figures.ready = true;
            if (typeof(CBPP_Figures.whenReady)==="function") {
                CBPP_Figures.whenReady();
            }
        }
    }

    var fontLoadedCallback = function() {
      typekitLoaded = true; clearTimeout(tkb); ready();
    };

    if (TypekitRequested === false) {
        TypekitRequested = true;

        if (location.hostname !== "www.cbpp.org") {
            var fa = $(document.createElement("link"))
                .attr("rel","stylesheet")
                .attr("href","https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css")
                //.attr("integrity","sha384-zIaWifL2YFF1qaDiAo0JFgsmasocJ/rqu7LKYH8CoBEXqGbb9eO+Xi3s6fQhgFWM")
                .attr("crossorigin","anonymous");
            $("head").append(fa);
        }

        if (location.hostname === "www.cbpp.org" ||
            location.hostname === "cbpp.org" ||
            /(^|\.)apps\.cbpp\.org$/.test(location.hostname) || // apps.cbpp.org and its subdomains (Adobe no longer ties kits to domains)
            location.hostname === "www.cbpp-multimedia.org" ||
            location.hostname === "cbpp-multimedia.org" ||
            location.hostname === "nkaspraknode" ||
            location.hostname === "nkaspraktest" ||
            location.hostname === "localhost" ||
            location.hostname === "apache" ) {
              $.getScript("//use.typekit.net/bwe8bid.js", function() {
                  try{Typekit.load({
                      active: function() {typekitLoaded = true; clearTimeout(tkb); ready();}
                  });}catch(e){}
              });
            } else {


          var link = document.createElement("link");
          if (link.onload) {
            link.onload = fontLoadedCallback;
          } else if (link.addEventListener) {
            link.addEventListener('load', fontLoadedCallback);
          } else {
            link.onreadystagechange = function() {
              var state = link.readyState;
              if (state === 'loaded' || state === 'complete') {
                link.onreadystatechange = null;
                fontLoadedCallback();
              }
            };
          }
          $(link).attr("href", "https://fonts.googleapis.com/css?family=Montserrat:400,400i,700|Pragati+Narrow:400,700:400,700");
          $(link).attr("rel", "stylesheet");
          $("head").append($(link));
          //$("head").append("<link href=\"https://fonts.googleapis.com/css?family=Montserrat:400,400i,700|Pragati+Narrow:400,700:400,700\" rel=\"stylesheet\">");
        }
        /*$.getScript("//use.typekit.net/bwe8bid.js", function() {
            try{Typekit.load({
                active: function() {typekitLoaded = true; clearTimeout(tkb); ready();}
            });}catch(e){}
        });*/
    }

    /*fallback in case Typekit fails*/
    var tkb = setTimeout(function() {
        console.log("typekit error");
        typekitLoaded = true;
        ready();
    },800);

    /*CBPP_Figures.ready = function(callback) {
        if (CBPP_Figures.ready===true) {
            callback();
        } else {
            CBPP_Figures.whenReady = callback;
        }
    };*/

    CBPP_Figures.Figure = function(selector, config) {
        if (CBPP_Figures.ready === false) {
            console.error("Error: CBPP Figures library not loaded yet.");
            return false;
        }
        this.selector = selector;
        this.applyConfig(config);
        this.build();
    };
    CBPP_Figures.Figure.prototype = {
        title : "Title",
        figure_number: "",
        share: false,
    	subtitle : "Subtitle",
    	notes : "<p>Note: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>",
    	credit : "Center on Budget and Policy Priorities | <a href=\"http://www.cbpp.org\">cbpp.org</a>",
        layout: "fixed",
        columns: [1],
        rows: [0.5625],
        cssImportant: true,
        collapseWidth: 0,
        collapseColumns:[],
        mergeRows: [],
        mergeColumns: [],
        breakpoint: 650,
        variableCellsOnBreak: []
    };
    CBPP_Figures.Figure.prototype.applyConfig = function(config) {
        var newConfig = {};
        $.extend(true, newConfig, config);
        for (var item in newConfig) {
            if (config.hasOwnProperty(item)) {
                this[item] = newConfig[item];
            }
        }
    };
    CBPP_Figures.Figure.prototype.getConfig = function() {
        return {
            title: this.title,
            subtitle: this.subtitle,
            notes: this.notes
        };
    };
    CBPP_Figures.Figure.prototype.assign = function(srcSelect,x,y) {
        var destSelect = this.selector + " .grid" + x + y;
        $(destSelect).empty();
        $(srcSelect).detach().appendTo(destSelect);
    };
    CBPP_Figures.Figure.prototype.removeImportantRules = function() {
      function handleRule(obj, ind) {
        try {
          if (typeof(obj.href)!=="undefined" && obj.href!==null) {
            if (obj.href.indexOf("cbpp.org")===-1) {
              return;
            }
          }
          if (typeof(obj.cssRules)!=="undefined") {
            if (obj.cssRules !== null) {
              for (var i = 0, ii = obj.cssRules.length; i<ii; i++) {
                handleRule(obj.cssRules[i], i);
              }
            }
          }
          if (typeof(obj.selectorText)!=="undefined") {
            if (obj.selectorText === ".field-name-body *") {
              obj.parentRule.deleteRule(ind);
            }
          }
        } catch (ex) {
          console.error(ex);
        }
      }
      for (var i = 0, ii = document.styleSheets.length; i<ii; i++) {
        handleRule(document.styleSheets[i], i);
      }
    };
    CBPP_Figures.Figure.prototype.build = function () {
        var s = $(this.selector),
            title = $("<h2 class=\"title\"></h2>"),
            subtitle = $("<h3 class=\"subtitle\"></h3>"),
            notes = $("<div class=\"notes\"></div>"),
            credit = $("<div class=\"credit\"></div>"),
            borderWrap = $("<div class=\"borderWrapper\"></div>"),
            content = $("<div class=\"content\"></div>"),
            figure_number = $("<div class=\"figure_number\"></div>"),
            caption_area = $("<div class=\"caption_area\"></div>"),
            style = "",
            share = "",
            cellWrap,
            cellWidth,
            cellPadding,
            cellsToSkip = [],
            columnsToSkip = [],
            mergedSize,
            beforeBreak,
            afterBreak,
            f = this;

        

        if (typeof(this.responsiveBreak)==='undefined') {
            this.responsiveBreak = Math.max(0,this.columns.length - 1);
        }
        function mergedCellSize() {
            var width = -1, height = -1;
            var cols = f.mergeColumns[y];
            var rows = f.mergeRows[x];
            var numRows = 0;
            var j;
            if (typeof(cols)!=="undefined") {
                if (x >= cols[0] && x < cols[1]) {
                    width = 0;
                    for (j = cols[0];j<=cols[1];j++) {
                        width += f.columns[j]/gridWidth*100;
                        if (j !== cols[0]) {
                            columnsToSkip.push(j);
                        }
                    }
                }
            }
            if (typeof(rows)!=="undefined") {
                if (y >= rows[0] && y < rows[1]) {
                    height = 0;
                    for (j = rows[0];j<=rows[1];j++) {
                        height += f.rows[j]*100;
                        if (j !== rows[0]) {
                            cellsToSkip.push([x,j]);
                        }
                    }
                    numRows = rows[1] - rows[0];
                }
            }
            return {
                numRows: numRows,
                width:width,
                height:height
            };
        }
        function arrayHasVector(container, searchFor) {
            for (var i = 0, ii = container.length; i<ii; i++) {
                if (container[i][0] === searchFor[0] && container[i][1] === searchFor[1]) {
                    return i;
                }
            }
            return -1;
        }
        var x,y,gridWidth=0,width = this.columns.length, cell,height=this.rows.length, beforeWidth = 0, afterWidth = 0, breakVariable;
        for (x = 0; x<width; x++) {
            gridWidth += this.columns[x];
            if (x < this.responsiveBreak) {
                beforeWidth += this.columns[x];
            } else {
                afterWidth += this.columns[x];
            }
        }
        if (beforeWidth > 0) {beforeWidth = gridWidth / beforeWidth;}
        if (afterWidth > 0) {afterWidth = gridWidth / afterWidth;}
        for (y = 0; y<height; y++) {
            beforeBreak = $("<div class='beforeBreak'></div>");
            afterBreak = $("<div class='afterBreak'></div>");

            for (x = 0; x<width; x++) {
                while (columnsToSkip.indexOf(x)!==-1) {
                    columnsToSkip.splice(columnsToSkip.indexOf(x),1);
                    x++;
                }
                while (arrayHasVector(cellsToSkip,[x,y])!==-1) {

                    cellsToSkip.splice(arrayHasVector(cellsToSkip,[x,y]),1);
                    x++;
                }
                if (x<width) {
                    breakVariable = false;
                    if (arrayHasVector(this.variableCellsOnBreak,[x,y])!==-1) {
                        breakVariable = true;
                    }
                    cellWrap = $("<div class=\"cellWrap cellWrap" + x + "" + y + (typeof(this.rows[y])==="number" ? " fixed" : "") + (breakVariable? " breakVariable" : "") + (x===0 ? " firstOfRow" : "") + "\"></div>");

                    cell = $("<div class=\"grid grid" + x + "" + y + "\">");
                    cellWidth = this.columns[x]/gridWidth*100;
                    if (typeof(this.rows[y])==="number") {
                        cellPadding = this.rows[y]*100;
                    }
                    mergedSize = mergedCellSize();
                    if (mergedSize.width!==-1) {
                        cellWidth = mergedSize.width;
                    }
                    if (mergedSize.height!==-1) {
                        cellPadding = mergedSize.height;
                    }
                    style += this.selector + " .cellWrap" + x + "" + y + " {width: " + cellWidth + "%" + (this.cssImportant? " !important" : "") + ";" + (typeof(this.rows[y])==="number" ? "padding-bottom: " + cellPadding + "%;": "") + "}";
                    cell.append("<table class=\"gridBox\"><tr><td class=\"gridLabel\">" + ".grid" + x + "" + y + "</td></tr></table>");
                    cellWrap.append(cell);
                    if (x < this.responsiveBreak) {
                        beforeBreak.append(cellWrap);
                    } else {
                        afterBreak.append(cellWrap);
                    }
                }
            }

            content.append(beforeBreak);
            content.append(afterBreak);
        }

        style += "@media (max-width:" + this.breakpoint + "px) {" + this.selector + " .afterBreak {clear:both;width:" + afterWidth*100 + "% !important;}" + this.selector + " .beforeBreak {clear:both;width:"+ beforeWidth*100 + "% !important;}" + this.selector + " .cellWrap.breakVariable{padding-bottom:0;}" + this.selector + " .cellWrap.breakVariable .grid{position:relative;}}";

        
        function getHTMLText(o) {
            var fields = ["title","subtitle","notes","credit","figure_number","share"];
            var html;
            for (var i = 0, ii = fields.length; i<ii; i++) {
                html = s.find("." + fields[i]).html();
                if (typeof(html)!=="undefined") {
                    o[fields[i]] = html;
                }
                if (s[0].hasAttribute("data-" + fields[i])) {
                    o[fields[i]] = s.attr("data-" + fields[i]);
                }
            }
        }
        getHTMLText(this);
        if (s.attr("id") && this.share) {
            var page_url = encodeURIComponent(window.location.href + "#" + s.attr("id"));
            var url_title = encodeURIComponent(this.title);
            share = $(`<div class='share-icons'>
                <a href="https://www.facebook.com/sharer/sharer.php?u=` + page_url + `"
                    target="_blank"
                    title = "` + url_title + `">
                    <span class="visually-hidden">Share Chart on Facebook</span>
                    <i class="fa fa-facebook-f">
                    </i>
                </a>
            
                <a href="https://twitter.com/share?url=`+page_url+`&text=`+url_title+`"
                    class="twitter-share-button icon-twitter"
                    target="_blank"
                    data-text = "` + url_title + `">
                    <span class="visually-hidden">Share Chart on Twitter</span> 
                    <i class="fa fa-twitter">
                    </i>
                </a>
            </div>`)
        }
        title.html(this.title);
        subtitle.html(this.subtitle);
        notes.html(this.notes);
        figure_number.html(this.figure_number);
        if ($(notes).children("p").length === 0) {
            $(notes).wrapInner("<p></p>");
        }
        credit.html(this.credit);
        s.empty();
        s.removeClass("cbppFigure");
        s.addClass("cbppFigure");
        borderWrap.append(title);
        borderWrap.append(subtitle);
        borderWrap.append(content);
        borderWrap.append(notes);
        s.append(caption_area);
        caption_area.append(figure_number);
        caption_area.append(share);
        s.append(borderWrap);
        s.append(credit);
        var fid = this.selector.replace(/[^a-zA-Z0-9\s\:]*/g,"");
        $(document).find("head").find("style[data-fid='" +fid + "']").remove();
        $(document).find("head").prepend("<style type='text/css' data-fid='" + fid + "'>" + style + "</style>");
        this.removeImportantRules();

    };
    return CBPP_Figures;
};
