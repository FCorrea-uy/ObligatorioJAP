let unitCost = 0;
let productCurrency = "";
let subtotal = 0;
let shippingPercentage = 0.15;
let total = 0;
let MONEY_SYMBOL = "$";
let PERCENTAGE_SYMBOL = '%';
let PESO_SYMBOL = "UYU ";
let paymentTypeSelected = false;
const CREDIT_CARD_PAYMENT = "Tarjeta de crédito";
const BANKING_PAYMENT = "Transferencia bancaria";
let ERROR_MSG = "Ha habido un error :(, verifica qué pasó.";

//Función que se utiliza para actualizar los costos de publicación
function updateTotalCosts() {
    let unitProductCost = document.getElementById("costText");
    let comissionCost = document.getElementById("comissionText");
    let totalCost = document.getElementById("totalCostText");

    let unitCostToShow = MONEY_SYMBOL + subtotal;
    let comissionToShow = MONEY_SYMBOL + Math.round(((shippingPercentage * 100) * subtotal) / 100);
    let totalCostToShow = MONEY_SYMBOL + Math.round(subtotal + ((shippingPercentage * 100) * subtotal) / 100);

    unitProductCost.innerHTML = unitCostToShow;
    comissionCost.innerHTML = comissionToShow;
    totalCost.innerHTML = totalCostToShow;
}

function updateSubtotal() {
    cantidad = parseInt(document.getElementById("count").value);
    subtotal = cantidad * unitCost;
    document.getElementById("subtotal").innerHTML = subtotal;
    updateTotalCosts();
}

function showPaymentTypeNotSelected() {

}

function hidePaymentTypeNotSelected() {

}

var articles = [];

function showArticles(array) {

    let htmlContentToAppend = "";
    for (let i = 0; i < array.length; i++) {
        let articles = array[i];

        unitCost = articles.unitCost

        htmlContentToAppend += `
        <td><img style="width: 50%;"  src="` + articles.src + `" alt="` + `" class="img-thumbnail"></td>
        <td>` + articles.name + `</td>
        <td>` + articles.unitCost + ` ` + articles.currency + ` </td>
        <td><input type="number" id="count" value="1" onchange="updateSubtotal()" required></td>
        <td id="subtotal"></td>
        `
    }
    document.getElementById("cart").innerHTML = htmlContentToAppend;
    updateSubtotal();
}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e) {
    getJSONData(CART_INFO_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            showArticles(resultObj.data.articles);
        }
    })
});

document.getElementById("premiumradio").addEventListener("change", function() {
    shippingPercentage = 0.15;
    updateTotalCosts();
});

document.getElementById("expressradio").addEventListener("change", function() {
    shippingPercentage = 0.07;
    updateTotalCosts();
});

document.getElementById("estandarradio").addEventListener("change", function() {
    shippingPercentage = 0.05;
    updateTotalCosts();
});