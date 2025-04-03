import KEYS from "Keys.js";

const $d = document;
const $sneakers = $d.getElementById("sneakers");
const $template = $d.getElementById("sneaker-template");
const $fragmento = $d.createDocumentFragment();
const $options = { headers: { Authorization: `Bearer ${KEYS.secret}` } };

let products, prices;

Promise.all([
  fetch("https://api.stripe.com/v1/products", $options), //url de 1er peticiion
  fetch("https://api.stripe.com/v1/prices", $options), // url de 2da peticion sacada de la documentacion
])
.then(responses => console.log(responses.map(res => res.json())))
.then(json => {
    products = json[0].data;
    prices = json[1].data;
 
    prices.forEach(el => {
        let productData = products.filter(product => product.id === el.product);
        console.log(productData);

        $template.querySelector("sneaker").setAttribute("data-price", el.id);
        $template.querySelector("img").setAttribute.src = productData[0].images[0];
        $template.querySelector("img").alt = productData[0].name;
        $template.querySelector("figcaption").innerHTML = `${productData[0].name} ${el.unit_amount_decimal} ${el.currency}`;

        let $clone = $d.importNode($template, true);

        $fragmento.appendChild($clone);
    });

    $sneakers.appendChild($fragmento);
})
