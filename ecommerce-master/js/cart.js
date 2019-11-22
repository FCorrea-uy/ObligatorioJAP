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
const pagotext = "Seleccionar forma de pago";
let ERROR_MSG = "Ha habido un error :(, verifica qué pasó.";
let paymentType = false;

//Función que se utiliza para actualizar los costos de la compra
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

//Aquí se calcula el subtotal
function updateSubtotal() {
    cantidad = parseInt(document.getElementById("count").value);
    subtotal = cantidad * unitCost;
    document.getElementById("subtotal").innerHTML = subtotal;
    updateTotalCosts();
}

//Las dos funciones siguientes sirven para habilitar una forma de pago y deshabilitar la otra
function creditCardPayment() {
    document.getElementById('creditCardPaymentRadio').disabled = false;
    document.getElementById('creditCardNumber').disabled = false;
    document.getElementById('creditCardSecurityCode').disabled = false;
    document.getElementById('dueDate').disabled = false;
    document.getElementById('bankAccountNumber').disabled = true;
}

function bankAccountPayment() {
    document.getElementById('bankingRadio').disabled = false;
    document.getElementById('creditCardNumber').disabled = true;
    document.getElementById('creditCardSecurityCode').disabled = true;
    document.getElementById('dueDate').disabled = true;
    document.getElementById('bankAccountNumber').disabled = false;
}


//Esta función muetralos artículos en una tabla
var articles = [];

function showArticles(array) {

    let htmlContentToAppend = "";
    for (let i = 0; i < array.length; i++) {
        let articles = array[i];

        unitCost = articles.unitCost

        htmlContentToAppend += `
        <tr>
        <td><img style="width: 50%;"  src="` + articles.src + `" alt="` + `" class="img-thumbnail"></td>
        <td>` + articles.name + `</td>
        <td>` + articles.unitCost + ` ` + articles.currency + ` </td>
        <td><input type="number" id="count" value="1" min="0" onchange="updateSubtotal()" required></td>
        <td id="subtotal"></td>
        </tr>
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
    });

    document.getElementById("creditCardPaymentRadio").addEventListener("change", function() {
        document.getElementById("formaDePago").innerHTML = CREDIT_CARD_PAYMENT;
    });

    document.getElementById("bankingRadio").addEventListener("change", function() {
        document.getElementById("formaDePago").innerHTML = BANKING_PAYMENT;
    });

    //Aquí se definen los porcentajes
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

    //Esta función hace la validación del formulario
    var cartForm = document.getElementById("cart-info");

    cartForm.addEventListener("submit", function(e) {

        let calle = document.getElementById("calle");
        let numero = document.getElementById("numero");
        let esquina = document.getElementById("esquina");
        let pais = document.getElementById("pais");
        let pago = document.getElementById("formaDePago");

        let infoMissing = false;

        calle.classList.remove('is-invalid');
        numero.classList.remove('is-invalid');
        pais.classList.remove('is-invalid');
        esquina.classList.remove('is-invalid');
        pago.classList.remove('is-invalid');

        if (calle.value === "") {
            calle.classList.add('is-invalid');
            infoMissing = true;
        }

        if (numero.value <= 0) {
            numero.classList.add('is-invalid');
            infoMissing = true;
        }

        if (esquina.value === "") {
            esquina.classList.add('is-invalid');
            infoMissing = true;
        }

        if (pais.value === "") {
            pais.classList.add('is-invalid');
            infoMissing = true;
        }

        if (pago.textContent === pagotext) {
            pago.classList.add('is-invalid');
            infoMissing = true;
        }


        if (!infoMissing) {

            getJSONData(CART_BUY_URL).then(function(resultObj) {
                let msgToShowHTML = document.getElementById("resultSpan");
                let msgToShow = "";

                if (resultObj.status === 'ok') {
                    msgToShow = resultObj.data.msg;
                } else if (resultObj.status === 'error') {
                    msgToShow = ERROR_MSG;
                }

                bootbox.alert(msgToShow, null);
            });
        }

        if (e.preventDefault) e.preventDefault();
        return false;
    });
});