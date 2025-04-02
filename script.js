import KEYS from "Keys.js";

const $d = document;
const $sneakers = $d.getElementById("sneakers");
const $template = $d.getElementById("sneaker-template");
const $fragmento = $d.createDocumentFragment();
const $options = {header: {Authorization: `Baerer ${KEYS.secret}`}}

let products, price;

