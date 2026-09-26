/* CAREER COMPASS — ERROR PAGE */

   "use strict";
   
   document.addEventListener("DOMContentLoaded", function () {
   
       /* ELEMENTS */
   
       const errorPage =
           document.querySelector(".error-page");
   
       const errorCard =
           document.querySelector("[data-error-card]");
   
       const errorVisual =
           document.querySelector(".error-visual");
   
       const refreshButtons =
           document.querySelectorAll("[data-refresh-page]");
   
       const backButtons =
           document.querySelectorAll("[data-error-back]");
   
       const errorButtons =
           document.querySelectorAll(".error-btn");
   
       const floatingSymbols =
           document.querySelectorAll(".error-floating-symbol");
   
       const prefersReducedMotion =
           window.matchMedia &&
           window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   
   
       /* EXIT IF ERROR PAGE DOES NOT EXIST */
   
       if (!errorPage) {
           return;
       }
   
   
       /* PAGE READY */
   
       requestAnimationFrame(function () {
   
           errorPage.classList.add("error-page-ready");
   
       });
   
   
       /* REDUCED MOTION */
   
       if (prefersReducedMotion) {
   
           errorPage.classList.add("reduced-motion");
   
           initializeAccessibleInteractions();
   
           return;
   
       }
   
   
       /* CARD MOUSE GLOW */
   
       if (errorCard) {
   
           errorCard.addEventListener(
               "pointermove",
               handleCardPointerMove
           );
   
           errorCard.addEventListener(
               "pointerleave",
               resetCardPointer
           );
   
       }
   
   
       /* VISUAL PARALLAX */
   
       if (errorVisual) {
   
           errorVisual.addEventListener(
               "pointermove",
               handleVisualPointerMove
           );
   
           errorVisual.addEventListener(
               "pointerleave",
               resetVisualPointer
           );
   
       }
   
   
       /* BUTTON RIPPLE */
   
       errorButtons.forEach(function (button) {
   
           button.addEventListener(
               "click",
               createRipple
           );
   
           button.addEventListener(
               "keydown",
               handleButtonKeyboard
           );
   
       });
   
   
       /* REFRESH BUTTONS */
   
       refreshButtons.forEach(function (button) {
   
           button.addEventListener(
               "click",
               handleRefresh
           );
   
       });
   
   
       /* BACK BUTTONS */
   
       backButtons.forEach(function (button) {
   
           button.addEventListener(
               "click",
               handleBack
           );
   
       });
   
   
       /* FLOATING SYMBOLS */
   
       initializeFloatingSymbols();
   
   
       /* ACCESSIBILITY */
   
       initializeAccessibleInteractions();
   
   
       /* PAGE VISIBILITY */
   
       document.addEventListener(
           "visibilitychange",
           handleVisibilityChange
       );
   
   });
   
   
   /* CARD POINTER MOVEMENT */
   
   function handleCardPointerMove(event) {
   
       const card = event.currentTarget;
   
       const rect = card.getBoundingClientRect();
   
       const x =
           event.clientX - rect.left;
   
       const y =
           event.clientY - rect.top;
   
       const percentX =
           (x / rect.width) * 100;
   
       const percentY =
           (y / rect.height) * 100;
   
   
       card.style.setProperty(
           "--mouse-x",
           percentX + "%"
       );
   
       card.style.setProperty(
           "--mouse-y",
           percentY + "%"
       );
   
   }
   
   
   /* RESET CARD POINTER */
   
   function resetCardPointer(event) {
   
       const card = event.currentTarget;
   
       card.style.setProperty(
           "--mouse-x",
           "50%"
       );
   
       card.style.setProperty(
           "--mouse-y",
           "50%"
       );
   
   }
   
   
   /* VISUAL PARALLAX */
   
   function handleVisualPointerMove(event) {
   
       const visual = event.currentTarget;
   
       const rect =
           visual.getBoundingClientRect();
   
       const centerX =
           rect.left + rect.width / 2;
   
       const centerY =
           rect.top + rect.height / 2;
   
   
       const offsetX =
           (event.clientX - centerX) / rect.width;
   
       const offsetY =
           (event.clientY - centerY) / rect.height;
   
   
       const rotateX =
           offsetY * -8;
   
       const rotateY =
           offsetX * 8;
   
   
       visual.style.transform =
           `perspective(900px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateZ(0)`;
   
   
       visual.style.setProperty(
           "--parallax-x",
           `${offsetX * 16}px`
       );
   
       visual.style.setProperty(
           "--parallax-y",
           `${offsetY * 16}px`
       );
   
   }
   
   
   /* RESET VISUAL PARALLAX */
   
   function resetVisualPointer(event) {
   
       const visual = event.currentTarget;
   
       visual.style.transform =
           "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
   
   
       visual.style.setProperty(
           "--parallax-x",
           "0px"
       );
   
       visual.style.setProperty(
           "--parallax-y",
           "0px"
       );
   
   }
   
   
   /* BUTTON RIPPLE */
   
   function createRipple(event) {
   
       const button =
           event.currentTarget;
   
   
       /*
        * Remove old ripples.
        */
   
       const oldRipples =
           button.querySelectorAll(".error-ripple");
   
       oldRipples.forEach(function (ripple) {
   
           ripple.remove();
   
       });
   
   
       /*
        * Button dimensions.
        */
   
       const rect =
           button.getBoundingClientRect();
   
   
       /*
        * Ripple position.
        */
   
       let x =
           event.clientX - rect.left;
   
       let y =
           event.clientY - rect.top;
   
   
   
       if (
           !Number.isFinite(x) ||
           !Number.isFinite(y)
       ) {
   
           x = rect.width / 2;
           y = rect.height / 2;
   
       }
   
   

       const size =
           Math.max(rect.width, rect.height) * 2;
   
 
       const ripple =
           document.createElement("span");
   
       ripple.className =
           "error-ripple";
   
   
       ripple.style.width =
           size + "px";
   
       ripple.style.height =
           size + "px";
   
       ripple.style.left =
           (x - size / 2) + "px";
   
       ripple.style.top =
           (y - size / 2) + "px";
   
   
   
       if (
           window.getComputedStyle(button).position ===
           "static"
       ) {
   
           button.style.position =
               "relative";
   
       }
   
   
       button.appendChild(ripple);
   
   
   
       window.setTimeout(function () {
   
           if (ripple.parentNode) {
   
               ripple.remove();
   
           }
   
       }, 700);
   
   }
   
   
   /* BUTTON KEYBOARD HANDLING */
   
   function handleButtonKeyboard(event) {
   
       if (
           event.key !== "Enter" &&
           event.key !== " "
       ) {
   
           return;
   
       }

   
       if (
           event.currentTarget.tagName.toLowerCase() ===
           "a"
       ) {
   
           if (event.key === " ") {
   
               event.preventDefault();
   
               event.currentTarget.click();
   
           }
   
           return;
   
       }
   

   }
   
   
   /* REFRESH PAGE */
   
   function handleRefresh(event) {
   
       event.preventDefault();
   
   
       const button =
           event.currentTarget;

   
       if (button.dataset.refreshing === "true") {
   
           return;
   
       }
   
   
       button.dataset.refreshing =
           "true";
   
   
       button.classList.add(
           "is-loading"
       );
   
   
       const icon =
           button.querySelector("i");
   
   
       if (icon) {
   
           icon.classList.remove(
               "fa-rotate-right",
               "fa-sync-alt"
           );
   
           icon.classList.add(
               "fa-spinner",
               "fa-spin"
           );
   
       }
   
   
       window.setTimeout(function () {
   
           window.location.reload();
   
       }, 250);
   
   }
   
   
   /* GO BACK */
   
   function handleBack(event) {
   
       event.preventDefault();
   
   
       if (window.history.length > 1) {
   
           window.history.back();
   
           return;
   
       }
   
   
       const homeLink =
           document.querySelector(
               '.error-btn[href]'
           );
   
   
       if (homeLink) {
   
           window.location.href =
               homeLink.href;
   
           return;
   
       }
   
   
       /*
        * Final fallback.
        */
   
       window.location.href = "/";
   
   }
   
   
   /* FLOATING SYMBOL ANIMATION */
   
   function initializeFloatingSymbols() {
   
       const symbols =
           document.querySelectorAll(
               ".error-floating-symbol"
           );
   
   
       if (!symbols.length) {
   
           return;
   
       }
   
   
       symbols.forEach(function (symbol, index) {
   
           const delay =
               index * 0.35;
   
   
           const duration =
               3.5 + (index * 0.4);
   
   
           symbol.style.setProperty(
               "--float-delay",
               delay + "s"
           );
   
           symbol.style.setProperty(
               "--float-duration",
               duration + "s"
           );
   
       });
   
   }
   
   
   /* ACCESSIBILITY */
   
   function initializeAccessibleInteractions() {
   
       const interactiveElements =
           document.querySelectorAll(
               ".error-btn, .error-footer-brand"
           );
   
   
       interactiveElements.forEach(function (element) {
   
           /*
            * Add keyboard-friendly focus class.
            */
   
           element.addEventListener(
               "focus",
               function () {
   
                   element.classList.add(
                       "keyboard-focus"
                   );
   
               }
           );
   
   
           element.addEventListener(
               "blur",
               function () {
   
                   element.classList.remove(
                       "keyboard-focus"
                   );
   
               }
           );
   
       });
   
   
       document.addEventListener(
           "keydown",
           function (event) {
   
               if (event.key !== "Escape") {
   
                   return;
   
               }

   
               const active =
                   document.activeElement;
   
   
               if (
                   active &&
                   (
                       active.tagName === "INPUT" ||
                       active.tagName === "TEXTAREA" ||
                       active.tagName === "SELECT"
                   )
               ) {
   
                   return;
   
               }
   
   
               if (window.history.length > 1) {
   
                   window.history.back();
   
               }
   
           }
       );
   
   }
   
   
   /* VISIBILITY CHANGE */
   
   function handleVisibilityChange() {
   
       const page =
           document.querySelector(".error-page");
   
   
       if (!page) {
   
           return;
   
       }
   
   
       if (document.hidden) {
   
           page.classList.add(
               "page-hidden"
           );
   
       } else {
   
           page.classList.remove(
               "page-hidden"
           );
   
       }
   
   }
   
   
   /* OPTIONAL SUPPORT LINK HANDLING */
   
   document.addEventListener(
       "DOMContentLoaded",
       function () {
   
           const supportLinks =
               document.querySelectorAll(
                   "[data-support-link]"
               );
   
   
           supportLinks.forEach(function (link) {
   
               link.addEventListener(
                   "click",
                   function (event) {
   
   
                       const href =
                           link.getAttribute("href");
   
   
                       if (
                           !href ||
                           href === "#"
                       ) {
   
                           event.preventDefault();
   
                       }
   
                   }
               );
   
           });
   
       }
   );
   
   
   /* GLOBAL ERROR PAGE API */
   
   window.CareerCompassErrorPage = {
   
       refresh: function () {
   
           window.location.reload();
   
       },
   
   
       back: function () {
   
           if (window.history.length > 1) {
   
               window.history.back();
   
           } else {
   
               window.location.href = "/";
   
           }
   
       },
   
   
       home: function () {
   
           window.location.href = "/";
   
       }
   
   };