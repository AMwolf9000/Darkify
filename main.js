/* TODO:
    go into shadow roots/iframes
    ::before & ::after ??
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

overideBasicStyleSheet = `
* {
    scrollbar-color: rgb(42, 42, 42) rgb(106, 106, 106) !important;
}
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
.background-image-initial {
    background-image: initial !important;
}
.background-filter-brightness {
    filter: brightness(0.7) !important;
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

// wait for some DOM
await new Promise(resolve => setTimeout(resolve, 100));

const elems = document.body.querySelectorAll("*");
// disable styleSheet to prevent interference from inital style sheet
style.disabled = true

resolveClassForElems(elems)

function resolveClassForElems(elementList, index, array) {
    console.log(elementList)
    for (const element of elementList) {
        const computedStyle = window.getComputedStyle(element)
        const bgCol = computedStyle.backgroundColor;
        const bgImg = computedStyle.backgroundImage;
        const alpha = parseFloat(bgCol.split(",")[3]);
        console.log(bgCol, bgImg);

        // handle background-image
        if (bgImg != "none") {
            if (bgImg.includes("url")) {
                element.classList.add("background-filter-brightness");
            } else {
                element.classList.add("background-image-initial");
            }
        }

        // handle background-color
        if (alpha == 0) {
            continue;
        } else if (isNaN(alpha)) {
            element.classList.add("background-black");
        } else {
            const ar = alpha.toPrecision(1).toString().replace(".", "_");
            element.classList.add(`background-trans${ar}`);
        }
    }
}

style.textContent = overideBasicStyleSheet;
style.disabled = false

const observer = new MutationObserver(mutationList => {
    for (const mutationRecord of mutationList) {
        if (mutationRecord.addedNodes.length == 0) continue;

        for (const node of mutationRecord.addedNodes) {
            if (node.nodeType != Node.ELEMENT_NODE) continue;

            resolveClassForElems([node, ...node.querySelectorAll("*")])
        }
    }
})

observer.observe(document.body, {subtree: true, childList: true})
})();