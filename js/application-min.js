var CaltrateApp = function() {
    function a() {
        window.location.reload(!0)
    }
    var e = {
        AppInit: !1,
        stores: {},
        views: {},
        content: null,
        calc: null,
        drag: null,
        endingTimer: 0
    }, t = Backbone.Model.extend({
            defaults: {
                calcio: 0,
                sexo: "",
                edad: 0
            },
            initialize: function() {}
        }),
        n = Backbone.View.extend({
            initialize: function() {
                e.AppInit = !0;
                e.calc.set({
                    calcio: 0,
                    sexo: ""
                })
            },
            render: function() {
                var t = this;
                this.el.fadeOut(10, function() {
                    e.content.addClass("hidden");
                    $("#inicio").removeClass("hidden")
                }).fadeIn("fast");
                return this
            }
        }),
        r = Backbone.View.extend({
            events: function() {
                return MOBILE ? {
                    "touchstart #sexo-fem, #sexo-masc": "tapSilueta"
                } : {
                    "mousedown #sexo-fem, #sexo-masc": "tapSilueta"
                }
            },
            initialize: function() {
                _.bindAll(this, "tapSilueta", "render");
                $("#sexo-fem, #sexo-masc").each(function(e, t) {
                    $(t).data("inix") ? $(t).css("margin-left", $(t).data("inix")) : $(t).data("inix", parseInt($(t).css("margin-left")))
                });
                $("#edad").change(function() {
                    $(this).val() != "" ? $("#sexo-comenzar a.next").delay(200).fadeIn(400) : $("#sexo-comenzar a.next").fadeOut(180);
                    e.calc.set({
                        edad: $(this).val()
                    })
                });
                $('#edad option[value=""]').attr("selected", "selected");
                this.render()
            },
            tapSilueta: function(t) {
                t.preventDefault();
                t.stopPropagation();
                var n = $(t.currentTarget).attr("id"),
                    r = 1;
                switch (n) {
                    case "sexo-fem":
                        e.calc.set({
                            sexo: "Femenino"
                        });
                        this.el.find(".age_holder").css({
                            right: "auto",
                            left: 50
                        });
                        r = -1;
                        break;
                    case "sexo-masc":
                        e.calc.set({
                            sexo: "Masculino"
                        });
                        this.el.find(".age_holder").css({
                            right: 50,
                            left: "auto"
                        })
                }
                this.$("#sexo-fem, #sexo-masc").each(function(e, n) {
                    var n = $(n);
                    if (n.attr("id") == $(t.currentTarget).attr("id")) {
                        n.stop().animate({
                            scale: 1
                        }, 7, "easeOutQuad");
                        n.removeClass().addClass("current").delay(60 * e).animate({
                            opacity: 1,
                            marginLeft: n.data("inix") - 175 * r
                        }, 780, "easeOutQuad")
                    } else {
                        n.stop().animate({
                            scale: .6
                        }, 10, "easeOutQuad");
                        n.removeClass().addClass("noncurrent").delay(20 * e).animate({
                            opacity: .5,
                            marginLeft: n.data("inix") - 80 * r
                        }, 750)
                    }
                });
                this.el.find(".age_holder").hide().delay(500).fadeIn(400)
            },
            render: function() {
                $("#sexo-fem, #sexo-masc").removeClass().css("opacity", .5);
                $("#sexo-comenzar a.next").hide();
                $(".age_holder").hide();
                $("#sexo-fem, #sexo-masc").each(function(e, t) {
                    $(t).css("margin-left", $(t).data("inix"));
                    $(t).stop().animate({
                        scale: 1
                    }, 50)
                });
                $('#edad option[value=""]').attr("selected", "selected")
            }
        }),
        i = Backbone.View.extend({
            initialize: function() {
                _.bindAll(this, "render");
                e.drag = new DragApp;
                this.render()
            },
            render: function() {
                if (e.drag.sexo != e.calc.get("sexo")) {
                    e.drag.init();
                    $("#factores-riesgo .factor").removeClass("checked")
                }
            }
        }),
        s = Backbone.View.extend({
            longTouch: !1,
            longTouchID: 0,
            pressed: !1,
            tempheight: 0,
            sexo: null,
            initialize: function() {
                _.bindAll(this, "onTouchStart", "onTouchEnd", "onLongTouch", "openWindow", "render");
                $("#riesgo01").data("type", "alcohol");
                $("#riesgo02").data("type", "cigarro");
                $("#riesgo03").data("type", "ejercicio");
                $("#riesgo04").data("type", "cafe");
                $("#factores-riesgo .factor").unbind();
                $("#factores-riesgo .factor").bind(MOBILE ? "touchend" : "mouseup", this.onTouchEnd);
                $("#factores-riesgo a.info").bind(MOBILE ? "touchend" : "mouseup", this.openWindow);
                this.render()
            },
            openWindow: function(e) {
                e.preventDefault();
                e.stopPropagation();
                var t = this,
                    n = e.currentTarget;
                $("#factores-holder .window").hide();
                $("#factores-holder ." + $(n).parent().data("type")).fadeIn(320);
                $("#factores-holder").fadeIn(320);
                $("body").bind(MOBILE ? "touchend" : "mouseup", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $("body").unbind();
                    $("#factores-holder ." + $(n).parent().data("type")).fadeOut(200);
                    $("#factores-holder").fadeOut(200)
                })
            },
            onTouchStart: function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.pressed = !0;
                this.longTouch = !1;
                clearTimeout(this.longTouchID);
                this.longTouchID = setTimeout(this.onLongTouch, 800, e)
            },
            onTouchEnd: function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.pressed = !1;
                this.longTouchID = 0;
                clearTimeout(this.longTouchID);
                var t = this,
                    n = $(e.currentTarget);
                $("#factores-holder .window").fadeOut(200);
                if (this.longTouch) {
                    this.longTouch = !1;
                    $("#factores-holder .window").fadeOut(280)
                } else {
                    n.toggleClass("checked");
                    var r = 0;
                    $("#factores-riesgo .factor").each(function(e, n) {
                        var i = $(t.sexo + " .factorDisplay ." + $(n).data("type"));
                        i.hide();
                        if ($(n).hasClass("checked")) {
                            i.show();
                            i.css("height", 0);
                            i.stop().delay(280 * r).animate({
                                height: t.tempheight + "%"
                            }, 780);
                            r++
                        }
                    })
                }
            },
            onLongTouch: function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.longTouch = !0;
                this.longTouchID = 0;
                clearTimeout(this.longTouchID);
                var t = $(e.currentTarget);
                if (this.pressed) {
                    $("#factores-holder .window").hide();
                    $("#factores-holder ." + t.data("type")).fadeIn(360)
                }
            },
            render: function() {
                $(".factorZone").addClass("hidden");
                e.calc.get("sexo") == "Femenino" ? this.sexo = "#factor-fem" : this.sexo = "#factor-masc";
                this.tempheight = 25;
                var t = e.drag.suma_calcio / e.drag.total_calcio,
                    n = t <= 1 ? Math.ceil(e.drag.max_height * t) : e.drag.max_height;
                $(this.sexo).removeClass("hidden").fadeIn(800);
                $(this.sexo + " .slideFill").css("top", e.drag.max_height).animate({
                    top: e.drag.max_height - n
                }, 800);
                $(this.sexo + " .display").html((t <= 1 ? Math.ceil(t * 100) : "+100") + "%" + "<br>" + "<span class='kcal'>(" + e.drag.suma_calorias + "Kcal)</span>");
                $(this.sexo + " .factorDisplay").css({
                    top: e.drag.max_height - n,
                    height: n
                })
            }
        }),
        o = Backbone.View.extend({
            initialize: function() {
                $(".temp-resultdo").click(function() {
                    $(".resultado_lightbox").fadeIn(600);
                    setTimeout(function() {
                        $(".resultado_lightbox").find(".close").click(function() {
                            $(".resultado_lightbox").fadeOut();
                            window.location = "#/seccion/ending"
                        })
                    }, 400)
                });
                this.render()
            },
            render: function() {
                $(".factorZone").addClass("hidden");
                var t;
                CaltrateApp.calc.get("sexo") == "Femenino" ? t = "#final-fem" : t = "#final-masc";
                var n = e.drag.suma_calcio / e.drag.total_calcio,
                    r = n <= 1 ? e.drag.max_height * n : e.drag.max_height;
                if (n > .94) {
                    $("#prod_caltratefamily").show();
                    $("#prod_caltratefamily .resultados-producto").css({
                        opacity: 0
                    });
                    $("#prod_caltratefamily .resultados-producto").delay(800).animate({
                        opacity: 1
                    }, 700, "easeOutQuad");
                    $("footer .caltrateFamily").show();
                    $(".temp-resultdo").hide()
                } else if (n > .6) {
                    $("#prod_caltrateD").show();
                    $("#prod_caltrateD .resultados-producto").css({
                        opacity: 0
                    });
                    $("#prod_caltrateD .resultados-producto").delay(800).animate({
                        opacity: 1
                    }, 700, "easeOutQuad");
                    $("footer .caltrateD").show();
                    $(".temp-resultdo").show();
                    $(".resultado_lightbox .prod-details").hide();
                    $(".resultado_lightbox .caltrateD").show()
                } else {
                    $("#prod_caltrateM").show();
                    $("#prod_caltrateM .resultados-producto").css({
                        opacity: 0
                    });
                    $("#prod_caltrateM .resultados-producto").delay(800).animate({
                        opacity: 1
                    }, 700, "easeOutQuad");
                    $("footer .caltrateM").show();
                    $(".temp-resultdo").show();
                    $(".resultado_lightbox .prod-details").hide();
                    $(".resultado_lightbox .caltrateM").show()
                }
                $(".resultados-porcentajes .percent").html(Math.ceil(n * 100) + "%" + " <span class='kcal'>(" + e.drag.suma_calorias + "Kcal.)</span>");
                $(t + ".factorZone").removeClass("hidden").fadeIn(800);
                $(t + " .slideFill").animate({
                    top: e.drag.max_height - r
                }, 800);
                $(t + " .display").html((n <= 1 ? Math.ceil(n * 100) : "+100") + "%" + "<br>" + "<span class='kcal'>(" + e.drag.suma_calorias + "Kcal)</span>");
                $(t + " .factorDisplay").css({
                    top: e.drag.max_height - r,
                    height: r
                });
                var i = 0,
                    s = 25;
                $("#factores-riesgo .factor").each(function(e, n) {
                    var r = $(t + " .factorDisplay ." + $(n).data("type"));
                    r.hide();
                    if ($(n).hasClass("checked")) {
                        r.show();
                        r.css("height", 0);
                        r.stop().delay(280 * i).animate({
                            height: s + "%"
                        }, 780);
                        i++
                    }
                })
            }
        }),
        u = Backbone.View.extend({
            initialize: function() {
                this.render()
            },
            render: function() {
                $("#ending").removeClass("hidden");
                $("#slider_holder").stop().animate({
                    "margin-left": -($("#wrapper").width() * 5)
                }, 800, "easeInOutCirc")
            }
        });
    $(document).ready(function() {
        window.MOBILE = navigator.userAgent.match(/mobile/i);
        e.content = $("#container .content");
        e.calc = new t;
        if (MOBILE) {
            desayunoScroll = new iScroll("desayuno-scroller", {
                scrollbarClass: "myScrollbar",
                vScrollbar: !0,
                hideScrollbar: !1
            });
            comidaScroll = new iScroll("comida-scroller", {
                scrollbarClass: "myScrollbar",
                vScrollbar: !0,
                hideScrollbar: !1
            });
            cenaScroll = new iScroll("cena-scroller", {
                scrollbarClass: "myScrollbar",
                vScrollbar: !0,
                hideScrollbar: !1
            });
            snacksScroll = new iScroll("snacks-scroller", {
                scrollbarClass: "myScrollbar",
                vScrollbar: !0,
                hideScrollbar: !1
            })
        }
        var f = Backbone.Router.extend({
            _index: null,
            routes: {
                "/inicio": "goHome",
                "/seccion/:id": "getSection",
                "/alimentos/:cat": "getFoodCat",
                "/alimentos/:cat/:sec": "getFoodCat",
                "*actions": "defaultRoute"
            },
            initialize: function(t) {
                e.views.IndexView = new n({
                    el: $("#container")
                })
            },
            goHome: function() {
                a()
            },
            getSection: function(t) {
                var n = 0;
                switch (t) {
                    case "sexo":
                        n = 1;
                        $("footer .registro").hide();
                        $("footer .factors").hide();
                        $("footer .genero").show();
                        $("footer .ending").hide();
                        $("footer .content-holder").fadeIn(300);
                        e.views.SexoView ? e.views.SexoView.render() : e.views.SexoView = new r({
                            el: $("#sexo")
                        });
                        break;
                    case "paso02":
                        n = 2;
                        $("footer .registro").hide();
                        $("footer .factors").hide();
                        $("footer .genero").show();
                        $("footer .ending").hide();
                        $("footer .content-holder").fadeOut(300);
                        e.views.paso02View ? e.views.paso02View.render() : e.views.paso02View = new i({
                            el: $("#paso02")
                        });
                        break;
                    case "paso03":
                        n = 3;
                        $("#factor-masc .slideFill, #factor-masc .factorDisplay, #factor-masc .display, #factor-masc .mask").hide();
                        $("#factor-fem .slideFill, #factor-fem .factorDisplay, #factor-fem .display, #factor-fem .mask").hide();
                        $("footer .registro").hide();
                        $("footer .factors").show();
                        $("footer .genero").hide();
                        $("footer .ending").hide();
                        $("footer .content-holder").fadeIn(300);
                        e.views.paso03View ? e.views.paso03View.render() : e.views.paso03View = new s({
                            el: $("#paso03")
                        });
                        break;
                    case "resultados":
                        n = 4;
                        $("#final-masc .slideFill, #final-masc .factorDisplay, #final-masc .display, #final-masc .mask").hide();
                        $("#final-fem .slideFill, #final-fem .factorDisplay, #final-fem .display, #final-fem .mask").hide();
                        $(".prod-container").hide();
                        $("footer .registro").hide();
                        $("footer .factors").hide();
                        $("footer .genero").hide();
                        $("footer .ending .note").show();
                        $("footer .ending").show();
                        $("footer .content-holder").fadeIn(300);
                        e.views.resultadosView ? e.views.resultadosView.render() : e.views.resultadosView = new o({
                            el: $("#resultados")
                        });
                        break;
                    case "ending":
                        n = 5;
                        $("#final-masc .slideFill, #final-masc .factorDisplay, #final-masc .display, #final-masc .mask").hide();
                        $("#final-fem .slideFill, #final-fem .factorDisplay, #final-fem .display, #final-fem .mask").hide();
                        $(".prod-container").hide();
                        $("footer .registro").hide();
                        $("footer .caltrateFamily").show();
                        $("footer .factors").hide();
                        $("footer .genero").hide();
                        $("footer .ending .note").hide();
                        $("footer .content-holder").fadeIn(300);
                        e.views.resultadosView ? e.views.resultadosView.render() : e.views.resultadosView = new u({
                            el: $("#ending")
                        });
                        break;
                    case "inicio":
                        $("footer .content-holder").fadeOut(300);
                        n = 0
                }
                $("#" + t).removeClass("hidden");
                $("#slider_holder").stop().animate({
                    "margin-left": -($("#wrapper").width() * n)
                }, 1e3, "easeInOutQuart", function() {
                    if (t == "paso03") {
                        $("#factor-masc .mask").show();
                        $("#factor-masc .slideFill, #factor-masc .factorDisplay, #factor-masc .display").fadeIn(600);
                        $("#factor-fem .mask").show();
                        $("#factor-fem .slideFill, #factor-fem .factorDisplay, #factor-fem .display, #factor-fem .mask").fadeIn(600)
                    } else if (t == "resultados") {
                        $("#final-masc .mask").show();
                        $("#final-masc .slideFill, #final-masc .factorDisplay, #final-masc .display").fadeIn(600);
                        $("#final-fem .mask").show();
                        $("#final-fem .slideFill, #final-fem .factorDisplay, #final-fem .display").fadeIn(600)
                    }
                })
            },
            getFoodCat: function(e, t) {
                $("#paso02-drag .food-container").css("overflow", "hidden");
                if (e != "menu") {
                    $("#" + e).parent().find(".cat-container").hide();
                    $("#" + e).show();
                    $("#" + e).parents(".alimentos-slider").stop().animate({
                        "margin-left": -$(".cat-container").width()
                    }, 800, "easeInOutCirc", function() {
                        $("#" + e).parent().find(".alimentos-menu").css("visibility", "hidden");
                        MOBILE ? setTimeout(function() {
                            desayunoScroll.refresh();
                            comidaScroll.refresh();
                            cenaScroll.refresh();
                            snacksScroll.refresh()
                        }, 0) : $(".scroll-pane").jScrollPane()
                    })
                } else {
                    $("#" + t).parents(".alimentos-slider").stop().animate({
                        "margin-left": 0
                    }, 800, "easeInOutCirc", function() {
                        $("#" + e).parent().find(".cat-container").hide()
                    });
                    $("#" + t).parent().find(".alimentos-menu").css({
                        visibility: "visible"
                    })
                }
            },
            defaultRoute: function(t) {
                (t == "" || t == "inicio") && e.views.IndexView.render()
            }
        });
        e.AppInit || (window.location = "#inicio");
        e.app_router = new f;
        Backbone.history.start()
    });
    return e
}();
