$(document).ready(function(){
console.log('CART IS READY');
    let places = [
        { 'Italy': { coords: [12, 43], code: 'it' } },
        { 'Napa Valley': { coords: [-95.712891, 37.09024] } },
        { 'Piedmont': { coords: [-95.712891, 37.09024] } },
        { 'Russian River Valley': { coords: [-95.712891, 37.09024] } },
        { 'United States': { coords: [-95.712891, 37.09024], code: 'us' } }
    ]

    let country = document.getElementById("tag-country").innerText;

    let getFlag = function(){
        for (let i = 0; i < places.length; i++) {
            for (let key in places[i]) {
                if (key === country) {            
                    let result = `<span class="flag-icon flag-icon-${places[i][key].code}"></span>`;
                    $( "#origin-line" ).append( result );
                }   
            }
        }
    }

    let getCoords = function(){
        let
        region = document.getElementById("tag-region").innerText.slice(0, -2);
        mapPoint = region ? region : country;
        // if(region){
        //     mapPoint = region;
        // } else {
        //     mapPoint = country; 
        // }
        for (let i = 0; i < places.length; i++) {
            for (let key in places[i]) {
                if (key === mapPoint) {            
                    //return coords for map
                    console.log(places[i][key].coords)
                }   
            }
        }
    }
    getFlag();
    getCoords();
    
    let 
        onQuantityButtonClick = function(event){
            console.log('qty btn clicked!')
            let
                $button = $(this),
                $form = $button.closest('form'),
                $quantity = $form.find('.js-quantity-field'),
                quantityValue = parseInt($quantity.val()),
                max = $quantity.attr('max') ? parseInt($quantity.attr('max')) : null;

            if($button.hasClass('plus') && (max == null || quantityValue+1 <= max)){
                //sets value but wo .change() doesn't trigger event (next func)
                $quantity.val(quantityValue + 1).change();
            }
            else if ($button.hasClass('minus')){
                //sets value but wo .change() doesn't trigger event (next func)
                $quantity.val(quantityValue - 1).change();
            }
        }
        

        onQuantityFieldChange = function(event){
            console.log('qty changed!')
            let
                $field = $(this),
                $form = $field.closest('form'),
                $quantityText = $form.find('.js-quantity-text'),
                shouldDisableMinus = parseInt(this.value) === 1,
                shouldDisablePlus = parseInt(this.value) === parseInt($field.attr('max')),
                $minusButton = $form.find('.js-quantity-button.minus');
                $plusButton = $form.find('.js-quantity-button.plus');
        
                $quantityText.text(this.value);
   
            //minus unavailable if current qty = 1
            if(shouldDisableMinus){
                $minusButton.prop('disabled', true);
            } else if ($minusButton.prop('disabled') === true) {
                $minusButton.prop('disabled', false);
            }
            //plus unavailable if current qty = max
            if(shouldDisablePlus){
                $plusButton.prop('disabled', true);
            } 
            else if ($plusButton.prop('disabled') === true) {
                $plusButton.prop('disabled', false);
            }
        },

        // onVariantRadioChange = function(event){
        //     let
        //     $radio = $(this),
        //     $form = $radio.closest('form'),
        //     max = $radio.attr('data-inventory-quantity'),
        //     $quantity = $form.find('.js-quantity-field');
        //     $addToCartButton = $form.find('#add-to-cart-button');
    
        //     if ($addToCartButton.prop('disabled') === true){
        //         $addToCartButton.prop('disabled', false)
        //     }
    
        //     //set max allowed cart qty to inventory qty
        //     $quantity.attr('max', max);
    
        //     if(parseInt($quantity.val()) > max) {
        //         $quantity.val(max).change();
        //     }    
        // },
        onAddToCart = function(event){
            event.preventDefault();
            $.ajax({
                type: 'POST',
                url: '/cart/add.js',
                data: $(this).serialize(),
                dataType: 'json',
                success: onCartUpdated,
                error: onError
            })
        },

        onUpdateInCart = function(event){
            event.preventDefault();
            $.ajax({
                type: 'POST',
                url: '/cart/update.js',
                data: $(this).serialize(),
                dataType: 'json',
                success: onCartUpdated,
                error: onError
            })
        },
        // onLineRemoved = function(event) {
        //     event.preventDefault();
        //     let
        //         $removeLink = $(this),
        //         removeQuery = $removeLink.attr('href').split('change?')[1];
        //     $.post('/cart/change.js', removeQuery, onCartUpdated, 'json');
        // },
        onCartUpdated = function(){
           $.ajax({
               type: 'GET',
               url: '/cart',
               context: document.body,
               success: function(context){

                let 
                //div on cart page that data-cart-item-count attr is on
                    $dataCartContents = $(context).find('.js-cart-page-contents'),
                //html
                    dataCartHtml = $dataCartContents.html(),
                //data attribute
                    dataCartItemCount = $dataCartContents.attr('data-cart-item-count'),

                //el to receive/display cart count
                    $cartItemCount = $('.js-cart-item-count');
                //cmd to update cart count
                    $cartItemCount.text(dataCartItemCount);
               }
           })
        },
        onError = function(XMLHttpRequest, textStatus){
            let data = XMLHttpRequest.responseJSON;
            alert(data.status + ' - ' + data.message + ': ' + data.description)
        }
            
        $(document).on('click', '.js-quantity-button', onQuantityButtonClick);

        $(document).on('change', '.js-quantity-field', onQuantityFieldChange);

    // $(document).on('change', '.js-variant-radio', onVariantRadioChange);

    $(document).on('submit', '#add-to-cart-form', onAddToCart);

    $(document).on('submit', '#update-cart-form', onUpdateInCart);

    // $(document).on('click', '#mini-cart .js-remove-line', onLineRemoved);

    // $(document).on('click', '.js-cart-link, #mini-cart .js-keep-shopping', onCartButtonClick);

});