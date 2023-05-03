//Variables
let userName='';
let userContact='';
let choiceCart='';
let choiceCartArray =[];
let userArray = [];
let suplement;

//Classes
class User {
    constructor(name,contact){
        this.name = name;
        this.contact = contact; 
    }
}
class Supplement {
    constructor(name, price, stock){
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
    sell(mount) {
        if (mount <= this.stock) {
        this.stock = this.stock - mount;
        return this.price * mount;
        } else {
        return "Sin stock";
        }
    }
    return(mount) {
        if (mount >= this.stock) {
        this.stock = this.stock + mount;
        return this.stock;
        } else {
        return "Sin stock";
        }
    }
}

/*Events */

//Products

// Strawberry
window.addEventListener('load', createStock);
let buttonCollagenStrawLem = document.getElementById('Strawberry🍓-Lemonade🍋');
buttonCollagenStrawLem.addEventListener('click', updateStock);
// CaramelMacchiato
let buttonCollagenCaraMacc = document.getElementById('CaramelMacchiato🍮');
buttonCollagenCaraMacc.addEventListener('click', updateStock);
// Chocolate
let buttonCollagenChoc = document.getElementById('Chocolate🍫');
buttonCollagenChoc.addEventListener('click', updateStock);
//Fit9  
let buttonFit9 = document.getElementById('Fit9');
buttonFit9.addEventListener('click',updateStock);
//Restore
let buttonRestore = document.getElementById('Restore');
buttonRestore.addEventListener('click',updateStock);
//ProteChocolate
let buttonProteChocolate = document.getElementById('ProteChocolate🍫');
buttonProteChocolate.addEventListener('click',updateStock);
//Watermelon
let buttonWatermelon = document.getElementById('Watermelon🍉');
buttonWatermelon.addEventListener('click',updateStock);
//Lemon-Lime
let buttonLemon = document.getElementById('Lemon-Lime🍋');
buttonLemon.addEventListener('click',updateStock);
//Grape
let buttonGrape = document.getElementById('Grape🍇');
buttonGrape.addEventListener('click',updateStock);


// Cart
let aShowCart = document.getElementById('aShowCart');
aShowCart.addEventListener('click',showCart);
// Plus Button
let btnPlus = document.getElementsByClassName('plus-btn');
for(let i = 0; i < btnPlus.length; i++){
    btnPlus[i].addEventListener('click', plusSuplement);
}
//Minus Button
let btnMinus = document.getElementsByClassName('minus-btn');
for(let i = 0; i < btnMinus.length; i++){
    btnMinus[i].addEventListener('click', minusSuplement);
}
//Checkout Button
let btnCheckout = document.getElementById('btnCheckout');
btnCheckout.addEventListener('click',payment);

let btnVaciar = document.getElementById('btnVaciar');
btnVaciar.addEventListener('click',deleteCart);

//Functions
function deleteCart(){
    const cart = getCart();
    const stock = getStock();

    for(cartItem in cart){
        let mount = cart[cartItem].quantity;
        let element = stock[cartItem];

        element.return(mount);
    }

    updateLocal(cart,stock);
    hideCart();
}

function hideCart(){
    const navTotalItems = document.getElementById('navTotalItems');
    const navTotalPrice = document.getElementById('navTotalPrice');
    const ulShoppingCard = document.getElementById('ulShoppingCard');
    const navShoppingCard = document.getElementById('navShoppingCard');
    navShoppingCard.classList.toggle('hide');
    localStorage.setItem('cart', JSON.stringify([]));
    navTotalItems.innerHTML = 0;
    navTotalPrice.innerHTML = 0;
    ulShoppingCard.innerHTML = '';
}

function showCart(){
    const navShoppingCard = document.getElementById('navShoppingCard');
    navShoppingCard.classList.toggle('hide');
    const cart = getCart();
    const navTotalItems = document.getElementById('navTotalItems');
    const navTotalPrice = document.getElementById('navTotalPrice');
    const ulShoppingCard = document.getElementById('ulShoppingCard');
    const totalCart = cart.reduce((acumulator, currentValue)=> acumulator + currentValue.total, 0)??0;
    const totalItems = cart.reduce((acumulator, currentValue)=> acumulator + currentValue.quantity, 0)??0;
    let liShoppingCart = '';

    for(cartItem in cart){
        let liItem = `<li class="clearfix">
        <span class="item-name">${cart[cartItem].name}</span>
        <span class="item-price">$ ${cart[cartItem].total}</span>
        <span class="item-quantity">Quantity: ${cart[cartItem].quantity}</span>
      </li>`;

      liShoppingCart = liShoppingCart + liItem;
    }

    navTotalPrice.innerHTML = '$' + totalCart;
    navTotalItems.innerHTML = totalItems;
    ulShoppingCard.innerHTML = liShoppingCart;
}

function payment () {
    Swal.fire(
        'Pago recibido',
        'Te notificaremos cuando tu pedido este en camino',
        'success'
    ).then(result => {
        hideCart();
    });

}

async function createStock(){
    let stock = getStock();
    if(stock) return;

    stock = await generateStock();

    localStorage.setItem('stock', JSON.stringify(stock));
}

function updateStock(event){
    const id = event.currentTarget.id;
    const stock = getStock();
    const cart = getCart();
    const input = document.getElementById('inp'+id);
    let suplement = stock.findIndex(sup => sup.name == id);
    let suplementCart = cart.findIndex(sup => sup.name == id);
    let totalCart = 0;
    let totalQuantity = 0;
    let inputValue = parseInt(input.value)??0;
    if(suplementCart !=-1){
        totalCart = cart[suplementCart].total;
        totalQuantity = cart[suplementCart].quantity;
    }

    if(stock[suplement].sell(1) == 'Sin stock'){
         Toastify({
            text: "Sin stock",
            duration: 3000,
        }).showToast();
    }
    else{
        totalCart= totalCart+(stock[suplement].price*inputValue);
        totalQuantity= totalQuantity+inputValue;
        if(suplementCart === -1){
            cart.push({name:stock[suplement].name,total:totalCart,quantity:totalQuantity});
        }
        else{
            cart[suplementCart] = {name:stock[suplement].name,total:totalCart,quantity:totalQuantity};
        }
        
        updateLocal(cart,stock);

        showHideToast();
    } 
}

async function generateStock(){
    const response = await fetch("./stock.json");
    const data = await response.json();
    let arrayResult = data.map(function(obj){return new Supplement(obj.name,obj.price,obj.stock)});
    
    return arrayResult;
}

function getStock(){
    const stock = JSON.parse(localStorage.getItem('stock'));
    if(!stock) return stock;
    let stockResult = stock.map(function(obj){return new Supplement(obj.name,obj.price,obj.stock)});
    return stockResult;
}

function getCart(){
    const stock = JSON.parse(localStorage.getItem('cart'))??[];
    
    return stock;
}

function updateLocal(cart, stock){
    localStorage.setItem('stock', JSON.stringify(stock));
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showHideToast(){
    Toastify({
        text: "Tu producto se agregó al carrito",
        duration: 3000,
        style: {
    background: "linear-gradient(to right, #00b09b, #96c93d)",
  },
    }).showToast();
}

function plusSuplement(event){
    const currentTarget = event.currentTarget;    
    const input = currentTarget.closest(':not(button)').children[1];
    let value = parseInt(input.value)??0;

    value = value + 1;

    input.value = value;

}

function minusSuplement(event){
    const currentTarget = event.currentTarget;    
    const input = currentTarget.closest(':not(button)').children[1];
    let value = parseInt(input.value)??0;

    if(value !=0 )
        value = value - 1;

    input.value = value;

}

