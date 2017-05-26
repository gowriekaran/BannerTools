// document.domain = 'staging.mhweb.ca';

console.log(document.domain);
console.log("Trying to hack stage");
var iFrame = document.getElementById("preview");
console.log("iFrame: ", iFrame);
console.log("iFrame: ", iFrame.attributes);
console.log("iFrame: ", iFrame.attributes[iFrame.attributes.length-1]);
console.log("iFrame: ", iFrame.id);
console.log("iFrame: ", iFrame.classList);
// console.log("iFrame innerHTML: ", iFrame.innerHTML);
// console.log("iFrame src: ",iFrame.src);
// console.log("iFrame contentWindow: ", iFrame.contentWindow.location.href);
// console.log("iFrame contentWindow innerHTML: ", iFrame.contentWindow.document.body.innerHTML);
