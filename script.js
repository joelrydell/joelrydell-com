(function () {
  // --- Statistics: GoatCounter (cookieless, no banner needed) -----------
  // Fill in your GoatCounter code (the part before .goatcounter.com). Empty = off.
  var GOATCOUNTER_CODE = "joelrydell";

  if (GOATCOUNTER_CODE) {
    var gc = document.createElement("script");
    gc.async = true;
    gc.src = "https://gc.zgo.at/count.js";
    gc.setAttribute("data-goatcounter", "https://" + GOATCOUNTER_CODE + ".goatcounter.com/count");
    document.head.appendChild(gc);
  }

  function track(path, title) {
    if (window.goatcounter && typeof window.goatcounter.count === "function") {
      window.goatcounter.count({ path: path, title: title, event: true });
    }
  }

  // --- Language switch -------------------------------------------------
  var meta = {
    sv: {
      title: "Joel Rydell — Foto & film",
      desc: "Joel Rydell är frilansande fotograf och filmare. Dokumentärt, event, reklam och digitala kampanjer – i Sverige såväl som internationellt.",
      play: "Spela"
    },
    en: {
      title: "Joel Rydell — Photography & film",
      desc: "Joel Rydell is a freelance photographer and filmmaker. Documentary, events, commercials and digital campaigns – in Sweden as well as internationally.",
      play: "Play"
    }
  };

  function saved() {
    try { return localStorage.getItem("lang"); } catch (e) { return null; }
  }

  function setLang(lang, remember) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-" + lang + "]").forEach(function (el) {
      el.textContent = el.getAttribute("data-" + lang);
    });
    document.querySelectorAll(".lang span").forEach(function (el) {
      el.classList.toggle("on", el.getAttribute("data-lang") === lang);
    });
    document.title = meta[lang].title;
    var d = document.querySelector('meta[name="description"]');
    if (d) d.setAttribute("content", meta[lang].desc);
    document.querySelectorAll(".frame").forEach(function (b) {
      var title = b.parentNode.querySelector("h3").lastChild.textContent;
      b.setAttribute("aria-label", meta[lang].play + ": " + title);
    });
    if (remember) { try { localStorage.setItem("lang", lang); } catch (e) {} }
  }

  // Swedish by default; English for visitors whose browser isn't set to Swedish.
  var initial = saved() || (/^sv/i.test(navigator.language || "sv") ? "sv" : "en");
  setLang(initial, false);

  document.querySelector(".lang").addEventListener("click", function () {
    var next = document.documentElement.lang === "sv" ? "en" : "sv";
    setLang(next, true);
    track("language/" + next, "Language: " + next);
  });

  // --- Films: load the YouTube player only when clicked ------------------
  document.querySelectorAll(".frame").forEach(function (b) {
    b.addEventListener("click", function () {
      var filmTitle = b.parentNode.querySelector("h3").lastChild.textContent;
      track("play/" + b.getAttribute("data-yt"), "Play: " + filmTitle);
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + b.getAttribute("data-yt") + "?autoplay=1&rel=0";
      f.allow = "autoplay; fullscreen; picture-in-picture; encrypted-media";
      f.allowFullscreen = true;
      f.referrerPolicy = "strict-origin-when-cross-origin";
      f.title = b.getAttribute("aria-label") || "Film";
      var wrap = document.createElement("div");
      wrap.className = "frame";
      wrap.style.cursor = "default";
      wrap.appendChild(f);
      b.replaceWith(wrap);
    });
  });

  // --- Header name appears once the hero title has scrolled away ----------
  var hero = document.querySelector(".hero");
  function onScroll() {
    document.body.classList.toggle("at-top", window.scrollY < hero.offsetHeight * 0.6);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  document.querySelectorAll(".mail, .ig").forEach(function (a) {
    a.addEventListener("click", function () {
      var kind = a.classList.contains("mail") ? "email" : "instagram";
      track("click/" + kind, "Click: " + kind);
    });
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
