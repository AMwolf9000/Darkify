/* TODO:
    mutaionObserver for new elements
*/
(async () => {
// add style sheet before waiting for DOM to prevent white flash from loading
let overideBasicStyleSheet = `
    * {
        color: white !important;
        background-color: black !important;
    }
`
const style = document.createElement("style");
style.textContent = overideBasicStyleSheet;
document.head.appendChild(style);

// wait for some DOM
await new Promise(resolve => setTimeout(resolve, 100));

overideBasicStyleSheet = `
*:not(a) {
    color: white !important;
}
html, body {
    background-color: black !important;
}
img, video {
    filter: brightness(0.7) !important;
}
a {
    color: rgb(0, 0, 255) !important;
}
.background-black {
    background-color: black !important;
}
.background-trans0_1 {
    background-color: rgba(0, 0, 0, 0.1) !important;
}
.background-trans0_2 {
    background-color: rgba(0, 0, 0, 0.2) !important;
}
.background-trans0_3 {
    background-color: rgba(0, 0, 0, 0.3) !important;
}
.background-trans0_4 {
    background-color: rgba(0, 0, 0, 0.4) !important;
}
.background-trans0_5 {
    background-color: rgba(0, 0, 0, 0.5) !important;
}
.background-trans0_6 {
    background-color: rgba(0, 0, 0, 0.6) !important;
}
.background-trans0_7 {
    background-color: rgba(0, 0, 0, 0.7) !important;
}
.background-trans0_8 {
    background-color: rgba(0, 0, 0, 0.8) !important;
}
.background-trans0_9 {
    background-color: rgba(0, 0, 0, 0.9) !important;
}
`;
const elems = document.body.querySelectorAll("*");
elems.forEach(resolveClassForElems);

function resolveClassForElems(element, index, array) {
    const bgCol = window.getComputedStyle(element).backgroundColor;
    const alpha = parseFloat(bgCol.split(",")[3]);
    console.log(bgCol, alpha);
    if (alpha == 0) {
        return;
    } else if (isNaN(alpha)) {
        element.classList.add("background-black");
    } else {
        const ar = alpha.toPrecision(1).toString().replace(".", "_");
        console.log(ar);
        element.classList.add(`background-trans${ar}`);
    }
} 

style.textContent = overideBasicStyleSheet;

})();