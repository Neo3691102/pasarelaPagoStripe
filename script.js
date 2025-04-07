
import KEYS from "./Keys.js"; // importando las llaves de la api de stripe


const $d = document;
const $sneakers = $d.getElementById("sneakers");
const $template = $d.getElementById("sneaker-template").content;
const $fragmento = $d.createDocumentFragment();
const options = { headers: { Authorization: `Bearer ${KEYS.secret}` } };
const formatoDeMoneda = num => `$ ${num.slice(0,-2)}.${num.slice(-2)}`;

let products, prices;

Promise.all([
  fetch("https://api.stripe.com/v1/products", options), //url de 1er peticiion
  fetch("https://api.stripe.com/v1/prices", options), // url de 2da peticion sacada de la documentacion
])
.then(responses => Promise.all(responses.map( res => res.json())))
 .then(json => {
     products = json[0].data;
     prices = json[1].data;
 
     prices.forEach(el => {
        let productData = products.filter(product => product.id === el.product);

         console.log(productData);

         $template.querySelector(".sneaker").setAttribute("data-price", el.id);
         $template.querySelector("img").src = productData[0].images[0];
         $template.querySelector("img").alt = productData[0].name;
         $template.querySelector("figcaption").innerHTML = `${productData[0].name} ${formatoDeMoneda(el.unit_amount_decimal)} ${(el.currency).toUpperCase()}`;
         let $clone = $d.importNode($template, true);

         $fragmento.appendChild($clone);
     });

     $sneakers.appendChild($fragmento);
 })
 .catch(error => {
   let message = error.statusText || "Ocurrio un error en la peticion";

   $sneakers.innerHTML = `Error: ${error.status}: ${message}`;
 })

 $d.addEventListener("click" , e => {
   if (e.target.matches(".sneakers *")){
     let priceId = e.target.parentElement.getAttribute("data-price");

     Stripe(KEYS.public).redirectToCheckout({
       lineItems: [{ 
         price: priceId, 
         quantity: 1
         }],
         mode: "subscription",
         successUrl: "", //direccion local
         cancelUrl: ""
     })
     .then(res => {
       if (res.error) {
         $sneakers.insertAdjacentElement("afterend", res.error.message)
       }
     })
   }
 })


