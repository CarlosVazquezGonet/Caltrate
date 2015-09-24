var DragApp = function() {
    var e = {
        stores: {},
        views: {},
        collections: {},
        lastIcon: null,
        menuShown: !1,
        total_calcio: 1200,
        suma_calcio: 0,
        suma_calorias: 0,
        max_height: 400,
        sexo: null,
        init: function() {
            this.stores = {};
            this.views = {};
            this.collections = {};
            this.lastIcon = null;
            this.menuShown = !1;
            this.suma_calcio = 0;
            this.suma_calorias = 0;
            this.sexo = null;
            $(".dropZone").hide();
            if (CaltrateApp.calc.get("sexo") == "Femenino") {
                e.views.DropZone = new s({
                    el: $("#drop-fem")
                });
                e.sexo = "Femenino"
            } else {
                e.views.DropZone = new s({
                    el: $("#drop-masc")
                });
                e.sexo = "Masculino"
            }
            $(".dropZone .hoverFill").hide();
            $(".dropZone .slideFill").css("top", e.max_height);
            $(".dropZone .display").html("0%");
            e.collections.desayuno = new n;
            $("#desayuno .alimento").each(function(t, n) {
                e.collections.desayuno.add({
                    name: $(n).find(".table .name").html(),
                    calcio: $(n).find(".table .calcio").html(),
                    calorias: $(n).find(".table .calorias").html(),
                    porciones: $(n).find(".table .porcion").html(),
                    el: $(n)
                })
            });
            e.collections.comida = new n;
            $("#comida .alimento").each(function(t, n) {
                e.collections.desayuno.add({
                    name: $(n).find(".table .name").html(),
                    calcio: $(n).find(".table .calcio").html(),
                    calorias: $(n).find(".table .calorias").html(),
                    porciones: $(n).find(".table .porcion").html(),
                    el: $(n)
                })
            });
            e.collections.cena = new n;
            $("#cena .alimento").each(function(t, n) {
                e.collections.desayuno.add({
                    name: $(n).find(".table .name").html(),
                    calcio: $(n).find(".table .calcio").html(),
                    calorias: $(n).find(".table .calorias").html(),
                    porciones: $(n).find(".table .porcion").html(),
                    el: $(n)
                })
            });
            e.collections.snacks = new n;
            $("#snacks .alimento").each(function(t, n) {
                e.collections.desayuno.add({
                    name: $(n).find(".table .name").html(),
                    calcio: $(n).find(".table .calcio").html(),
                    calorias: $(n).find(".table .calorias").html(),
                    porciones: $(n).find(".table .porcion").html(),
                    el: $(n)
                })
            });
            e.collections.food_list = new i
        }
    }, t = Backbone.Model.extend({
            idAttribute: "_id",
            defaults: {
                name: "",
                calcio: 0,
                calorias: 0,
                porciones: "",
                el: null
            },
            initialize: function() {}
        }),
        n = Backbone.Collection.extend({
            model: t,
            initialize: function() {
                _.bindAll(this, "onAdd");
                this.bind("add", this.onAdd)
            },
            onAdd: function(e) {
                new r({
                    model: e,
                    el: e.get("el")
                })
            }
        }),
        r = Backbone.View.extend({
            defaults: {
                model: null,
                longTouchID: 0,
                activeDragID: 0,
                curX: 0,
                curY: 0,
                startX: 0,
                startY: 0,
                iniX: 0,
                iniY: 0,
                iniZ: 0,
                hasMoved: !1,
                pressed: !1,
                disabled: !1,
                removeTimeOut: 0
            },
            initialize: function() {
                _.bindAll(this, "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel", "initEvents", "removeEvents", "render", "removeItem");
                var e = this;
                this.iniX = this.el.css("left");
                this.iniY = this.el.css("top");
                this.iniZ = this.el.css("z-index");
                this.el.children(".submenu").size() > 0;
                this.initEvents();
                this.render()
            },
            initEvents: function() {
                this.el.find(".table").unbind();
                this.el.find(".remove").unbind();
                if (MOBILE) {
                    this.el.find(".table").bind("touchstart", this.onTouchStart);
                    this.el.find(".table").bind("touchend", this.onTouchEnd);
                    this.el.find(".remove").bind("touchend", this.removeItem);
                    this.el.find(".table").bind("touchcancel", this.onTouchCancel)
                } else {
                    this.el.find(".table").bind("mousedown", this.onTouchStart);
                    this.el.find(".table").bind("mouseup", this.onTouchEnd);
                    this.el.find(".remove").bind("click", this.removeItem)
                }
            },
            removeEvents: function() {
                this.el.find(".remove").css({
                    display: "block"
                });
                this.el.find(".counter").css({
                    display: "block"
                });
                var t = this;
                t.el.unbind();
                t.el.bind("mouseup", function() {
                    e.collections.food_list.each(function(n, r) {
                        if (t.model.get("name") == n.get("name")) {
                            alert("el item");
                            e.collections.food_list.remove(n);
                            t.disabled = !1;
                            t.el.find(".icon").css("opacity", 1);
                            t.el.find(".remove").css({
                                display: "none"
                            });
                            t.initEvents()
                        }
                    })
                })
            },
            onTouchStart: function(t) {
                t.preventDefault();
                this.pressed = !0;
                this.hasMoved = !1;
                if (MOBILE) {
                    var n = t.originalEvent.touches[0] || t.originalEvent.changedTouches[0] || t.touches[0],
                        r = t.currentTarget;
                    this.startX = n.pageX;
                    this.startY = n.pageY;
                    this.el.bind("touchmove", this.onTouchMove)
                } else {
                    var r = t.currentTarget;
                    this.startX = t.pageX;
                    this.startY = t.pageY;
                    $("body").bind("mousemove", this.onTouchMove)
                } if (e.menuShown) {
                    e.menuShown = !1;
                    $("#tooltip, .submenu").fadeOut(100)
                }
            },
            onTouchMove: function(e) {
                e.preventDefault();
                var t = e.currentTarget;
                this.longTouchID != 0 && clearTimeout(this.longTouchID);
                this.pressed && (this.hasMoved = !0)
            },
            onTouchEnd: function(t) {
                t.preventDefault();
                var n = this,
                    r = t.currentTarget;
                this.longTouchID != 0 && clearTimeout(this.longTouchID);
                if (this.pressed && !this.hasMoved) {
                    e.collections.food_list.add({
                        name: this.model.get("name"),
                        calcio: parseInt(this.model.get("calcio")),
                        calorias: parseInt(this.model.get("calorias")),
                        porciones: this.model.get("porciones"),
                        el: this.model.get("el")
                    });
                    n.counterDisplay();
                    n.removeMode = !0;
                    n.el.addClass("active");
                    n.el.find(".counter").fadeIn(400);
                    clearTimeout(n.removeTimeOut);
                    n.removeTimeOut = setTimeout(function() {
                        n.el.find(".remove").fadeIn(400);
                        n.el.find(".counter").hide()
                    }, 1500);
                    $(r).find(".icon").stop().delay(140).animate({
                        opacity: .5
                    }, 200)
                }
                this.pressed = !1
            },
            removeItem: function(t) {
                t.preventDefault();
                t.stopPropagation();
                var n = this,
                    r = t.currentTarget,
                    i = 0;
                e.collections.food_list.find(function(t) {
                    if (t.get("name") == n.model.get("name")) {
                        e.collections.food_list.remove(t);
                        return !0
                    }
                });
                n.el.find(".remove").hide();
                n.el.find(".counter").fadeIn(400);
                clearTimeout(n.removeTimeOut);
                n.removeTimeOut = setTimeout(function() {
                    n.el.find(".remove").fadeIn(400);
                    n.el.find(".counter").hide()
                }, 800);
                var i = n.counterDisplay();
                if (i <= 0) {
                    n.removeMode = !1;
                    clearTimeout(n.removeTimeOut);
                    n.el.find(".icon").css("opacity", 1);
                    n.el.find(".remove").hide();
                    n.el.find(".counter").hide();
                    n.el.removeClass("active")
                }
                r.style.webkitTransform = "scale(1)"
            },
            onTouchCancel: function() {},
            counterDisplay: function() {
                var t = 0,
                    n = this;
                e.collections.food_list.each(function(e, r) {
                    e.get("name") == n.model.get("name") && t++
                });
                n.el.find(".counter").html(t);
                return t
            },
            render: function() {
                this.el.css("opacity", 1);
                this.el.find(".icon").css("opacity", 1);
                this.el.find(".remove").hide();
                this.el.find(".counter").hide()
            }
        }),
        i = Backbone.Collection.extend({
            model: t,
            initialize: function() {
                _.bindAll(this, "onAdd", "onRemove");
                this.bind("add", this.onAdd);
                this.bind("remove", this.onRemove)
            },
            onAdd: function(t) {
                e.views.DropZone.setFill()
            },
            onRemove: function(t) {
                e.views.DropZone.setFill()
            }
        }),
        s = Backbone.View.extend({
            initialize: function() {
                _.bindAll(this, "hitTest", "setFill");
                $(this.el).removeClass("hidden").hide().fadeIn(800)
            },
            setFill: function() {
                var t = this;
                e.suma_calcio = 0;
                e.suma_calorias = 0;
                e.collections.food_list.each(function(t) {
                    e.suma_calcio += t.get("calcio");
                    e.suma_calorias += t.get("calorias")
                });
                var n = e.suma_calcio / e.total_calcio,
                    r = n <= 1 ? Math.ceil(e.max_height * n) : e.max_height;
                n < 1;
                n > .55 ? $(".dropZone .display, .factorZone .display").addClass("white") : $(".dropZone .display, .factorZone .display").removeClass("white");
                $(t + ".dropZone .display").html((n < 1 ? Math.round(n * 100) : "+100") + "%" + "<br>" + "<span class='kcal'>(" + e.suma_calorias + "Kcal)</span>");
                $(t + ".dropZone .slideFill").animate({
                    top: e.max_height - r
                }, 800, "easeOutQuart")
            },
            hitTest: function(e, t) {
                var n = $(this.el).offset().top,
                    r = $(this.el).height() + n,
                    i = $(this.el).offset().left,
                    s = $(this.el).width() + i;
                return e > i && e < s && t > n && t < r
            }
        });
    return e
};
