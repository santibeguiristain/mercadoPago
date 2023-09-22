const mercadopago = new MercadoPago("KEY", {
  locale: "es:AR",
})


document.getElementById("checkout-btn").addEventListener("click", function () {
    //Capturamos cantidad, precio y producto desde el innerHtml
    const orderData = {
      quantity: document.getElementById("quantity").innerHTML,
      description: document.getElementById("product-description").innerHTML,
      price: document.getElementById("unit-price").innerHTML
    };
  

    //Peticion para crear la preferencia (producto)
    fetch("http://localhost:8080/create_preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData), //Envia los datos del producto
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (preference) {
        createCheckoutButton(preference.id);
      })
      .catch(function () {
        alert("Unexpected error");
      });
  });





  //////////////////////////////////////////////////
  //Funciones
  //////////////////////////////////////////////////
  function createCheckoutButton(preferenceId) {
    // Initialize the checkout
    const bricksBuilder = mercadopago.bricks(); //Bricks geenra todo lo que es el formulario del lado de mercadoPago
  
    const renderComponent = async (bricksBuilder) => {
      if (window.checkoutButton) window.checkoutButton.unmount(); //Chequeamos que no exista orden de compra anterior, no se generara dos ordenes de compra.
      await bricksBuilder.create(
        'wallet',
        'button-checkout',  //Boton dodne va formulari ode compra, para ingresar datos y demas.
        {
          initialization: {
            preferenceId: preferenceId
          },
          callbacks: {
            onError: (error) => console.error(error),
            onReady: () => {}
          }
        }
      );
    };
    window.checkoutButton =  renderComponent(bricksBuilder);
  }
   
  