

/**
 * @fileoverview Rendered in cart page
 *   - To minify, use: https://t.ly/k3cQZ
 *
 * @auther https://github.com/yahyaizhar
 *
 * @version 1.0
 */


(function(YGPRODUCTOPTIONS){

  var ALWAYS_USE_DRAFTORDER = true;

  YGPRODUCTOPTIONS.cart = function(){


    return {

      total_price: 0,
      total_charge: 0,
      data:[],

      selectors: {
          item_total_price: '[data-hulkapps-line-price][data-key="[[itemkey]]"]',
          total_price: '[data-hulkapps-cart-total],[data-js-popup-cart-subtotal]',

          discount_box: '[name="checkout"],[href="/checkout"]@beforebegin',
          form: 'form[action="/cart"],[href="/checkout"]'
      },

      getSelector(selector) {
        if (!!selector && selector != "") {
          var oSelector = selector.split("@");
          return {
            name: oSelector[0],
            placement: !!oSelector[1] ? oSelector[1] : null,
          };
        }
        return null;
      },

      // This will render prices / Discount code box / Event listeners
      init(){
          var self = this;

          this.getCartItems(function(){
    
            self.renderPrices();
    
            if(self.total_charge > 0 || ALWAYS_USE_DRAFTORDER) {
              self.renderDiscountBox();
    
              // Attaching Events
              self.attachEvents();
            }

            var checkoutBtn = document.querySelector('[name="checkout"]');
            if(checkoutBtn){
              checkoutBtn.disabled = false;
              checkoutBtn.classList.remove('btn-hulk-disable')
            }
                  
        })
      },

    getCartItems(cb){

        jQuery.getJSON("/cart.js", function(cart){

            YGPRODUCTOPTIONS.cartData = cart;

            var cart_items = cart.items.map(function(item){
                var options = [];
                var props = item.properties;
                if(!!props){
                    Object.keys(props).forEach(function(key){
    
                        if(key.indexOf('_ygpooption')>-1){
                            var o = {};
                            var value = props[key];
                            var newKey = key.split('|');
    
                            value = value.split('|');
                            o.id = newKey[1];
                            o.charge = !!value[1] ? parseFloat(value[1]) : 0;
                            o.value_id = value[0];
    
                            options.push(o);
                        }
                    })
                }
    
                return {
                    id: item.id,
                    key: item.key,
                    quantity: item.quantity,
                    price: item.price,
                    product_title: item.product_title,
                    product_id: item.product_id,
                    options: options
                }
            })
            YGPRODUCTOPTIONS.cart_items = cart_items;

            cb();
        })    
    },

      renderPrices(){

        var self = this;
        var total_price = 0;

        this.data = [];

        YGPRODUCTOPTIONS.cart_items.forEach(function(item){


          if( item.options.length > 0 && item.options.some(function(op){return op.charge > 0}) ){

            // Generating HTML
            var html = '';

            var item_price = (item.price * item.quantity)/100;
            var charged_price = item.options.reduce(function(total, op){return total+op.charge }, 0);
            item_price += (charged_price * item.quantity);

            self.total_charge += charged_price;

            total_price += item_price;

            self.data.push({
              item: item,
              price: (item.price * item.quantity)/100,
              charged_price: charged_price,
              total_price: item_price
            });

            html += `${YGPRODUCTOPTIONS.utils.formatMoney(item_price).amount_with_symbol}`;

            // Appending HTML
            var oSelector = YGPRODUCTOPTIONS.cart.getSelector(
              YGPRODUCTOPTIONS.cart.selectors.item_total_price
            );

            var name = oSelector.name
            .replace('[[itemkey]]', item.key);

            var els = document.querySelectorAll(name);
            if (els.length > 0) {
              els.forEach(function(el){
                if (!!oSelector.placement) {
                  if (oSelector.placement === "afterbegin") {
                    el.insertAdjacentHTML("afterbegin", html);
                  } else if (oSelector.placement === "beforeend") {
                    el.insertAdjacentHTML("beforeend", html);
                  } else if (oSelector.placement === "beforebegin") {
                    el.insertAdjacentHTML("beforebegin", html);
                  } else if (oSelector.placement === "afterend") {
                    el.insertAdjacentHTML("afterend", html);
                  }
                } else {
                  el.innerHTML = html;
                }
              })
            } else {
              console.error("YGPO - ELEMENT NOT FOUND");
            }

          }
          else{


            var item_price = (item.price * item.quantity)/100;

            total_price += item_price;

            self.data.push({
              item: item,
              price: (item.price * item.quantity)/100,
              charged_price: 0,
              total_price: item_price
            });

          }
        });

        this.total_price = total_price;

        // Generating HTML
          var html = '';

          html += `${YGPRODUCTOPTIONS.utils.formatMoney(total_price).amount_with_symbol}`;

        // Appending HTML
        var oSelector = YGPRODUCTOPTIONS.cart.getSelector(
          YGPRODUCTOPTIONS.cart.selectors.total_price
        );


        var els = document.querySelectorAll(oSelector.name);
        if (els.length > 0) {
          els.forEach(function(el){
            if (!!oSelector.placement) {
              if (oSelector.placement === "afterbegin") {
                el.insertAdjacentHTML("afterbegin", html);
              } else if (oSelector.placement === "beforeend") {
                el.insertAdjacentHTML("beforeend", html);
              } else if (oSelector.placement === "beforebegin") {
                el.insertAdjacentHTML("beforebegin", html);
              } else if (oSelector.placement === "afterend") {
                el.insertAdjacentHTML("afterend", html);
              }
            } else {
              el.innerHTML = html;
            }
          })
        } else {
          console.error("YGPO - ELEMENT NOT FOUND");
        }



      },

      renderDiscountBox(){
        if(this.total_charge <= 0 && !ALWAYS_USE_DRAFTORDER) return;


        var html = `
          <div class="ygpo-discount-box">
              <input placeholder="Discount code" autocomplete="off" aria-required="true" size="30" type="text">
              <button type="button">Apply</button>
          </div>
        `;

        var already_els = document.querySelectorAll('.ygpo-discount-box');
        if (already_els.length > 0) {
          already_els.forEach(function(el){
            el.remove();
          });
        }

        // Appending HTML
        var oSelector = YGPRODUCTOPTIONS.cart.getSelector(
          YGPRODUCTOPTIONS.cart.selectors.discount_box
        );


        var els = document.querySelectorAll(oSelector.name);
        if (els.length > 0) {
          els.forEach(function(el){
            if (!!oSelector.placement) {
              if (oSelector.placement === "afterbegin") {
                el.insertAdjacentHTML("afterbegin", html);
              } else if (oSelector.placement === "beforeend") {
                el.insertAdjacentHTML("beforeend", html);
              } else if (oSelector.placement === "beforebegin") {
                el.insertAdjacentHTML("beforebegin", html);
              } else if (oSelector.placement === "afterend") {
                el.insertAdjacentHTML("afterend", html);
              }
            } else {
              el.innerHTML = html;
            }
          })
        } else {
          console.error("YGPO - ELEMENT NOT FOUND");
        }

      },

      attachEvents(){

        var self = this;

        // Events on form to disable submit
        var form_els = document.querySelectorAll(self.selectors.form);
          
        if (form_els.length > 0) {
          form_els.forEach(function(el){
            if(el.tagName.toLowerCase() == 'a' && el.getAttribute('href') === "/checkout"){
                  
              el.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
  
                self.events.processOrder(this);
              }, false);
            }
            else{

              el.addEventListener('submit', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();

                if(e.submitter && e.submitter.getAttribute('name') === "checkout") self.events.processOrder(e.submitter);
              }, false);
                  
            }
            


          });
        }



        // Events on disocunt box
        var discount_els = document.querySelectorAll('.ygpo-discount-box');
        if (discount_els.length > 0) {
          discount_els.forEach(function(el){
            var input = el.querySelector('input[type="text"]');
            if(input){

              input.addEventListener('keyup', function (e) {

                if (e.key === "Enter") {
                  // Do work
                  e.preventDefault();
                  var container = this.closest('.ygpo-discount-box');
                  self.events.applyDiscount(container);

                }
              }, false);

            }

            var button = el.querySelector('button');
            if(button){
              button.addEventListener('click', function (e) {
                 e.preventDefault();
                var container = this.closest('.ygpo-discount-box');

                self.events.applyDiscount(container);
              }, false);

            }
          });
        }

      },


      events:{
        applyDiscount(container){

          // Generate a payload

          var input = container.querySelector('input[type="text"]');
          var submitBtn = container.querySelector('button');


          submitBtn.setAttribute('aria-disabled', true);
          submitBtn.classList.add('ygpo--loading');

          container.querySelector('.ygpo-discount-error')?.remove();
          container.querySelector('.ygpo-discount-msg')?.remove();
          YGPRODUCTOPTIONS.cart.dt = null;


          var payload = {

            productWithCollections: YGPRODUCTOPTIONS.productWithCollections || [],
            code: input.value,
            shop:Shopify.shop,
            cart: YGPRODUCTOPTIONS.cartData,
            items: YGPRODUCTOPTIONS.cart_items.map(function(item){
              return {
                id: item.id,
                key: item.key,
                title: item.product_title,
                product_id: item.product_id,
                quantity: item.quantity,
                value_ids: item.options.map(function(op){return op.value_id})
              };
            })



          }

          if(typeof YGPRODUCTOPTIONS.customer_id !== "undefined" && !!YGPRODUCTOPTIONS.customer_id)payload.customer_id = YGPRODUCTOPTIONS.customer_id;

          var self = this;
          YGPRODUCTOPTIONS.utils.sendRequest('/po/discount', 'POST', payload)
          .then((response) => response.json()) // we will received HTML
          .then(function(json){

            var html = '';
            if(json.valid === false){

              html = `<p class="ygpo-discount-error">Enter a valid discount code</p>`;

            }
            else{
              var totalPrice = json.discount.totalPrice - json.discount.totalDiscount;

              html = `<div class="ygpo-discount-msg">
                <div class="ygpo-discount-item">
                  <div class="ygpo-discount--tag">
                    <span class="ygpo-discount--tag__name">${payload.code.toUpperCase()}</span>
                    <a href="" class="ygpo-discount---tag__remove" onClick="YGPRODUCTOPTIONS.cart.events.removeDiscount(event, this);">×</a>
                  </div>
                    <div class="ygpo-discount-amount ygpo-discount-amount--discounted">${YGPRODUCTOPTIONS.utils.formatMoney(json.discount.totalDiscount).amount_with_symbol}</div>
                </div>
                <div class="ygpo-discount-item">
                    <span class="ygpo-discount-label">Total</span>
                    <div class="ygpo-discount-amount">${YGPRODUCTOPTIONS.utils.formatMoney(totalPrice).amount_with_symbol}</div>
                </div>
              </div>`;

              YGPRODUCTOPTIONS.cart.dt = json.token;

              input.value = '';
            }

            container.insertAdjacentHTML("beforeend", html);


          })
          .catch(function(err){
              console.error("YGPO - ", err);
          })
          .finally(function(){

            submitBtn.classList.remove('ygpo--loading');
            submitBtn.removeAttribute('aria-disabled');

          });


        },

        removeDiscount(e, self){
          e.preventDefault();
          self.closest('.ygpo-discount-msg')?.remove();

          YGPRODUCTOPTIONS.cart.dt = null;
        },

        processOrder(submitBtn){

          // Generate a payload


          submitBtn.setAttribute('aria-disabled', true);
          submitBtn.classList.add('ygpo--loading');

          var payload = {

            shop:Shopify.shop,
            cart: YGPRODUCTOPTIONS.cartData,
            items: YGPRODUCTOPTIONS.cart_items.map(function(item){

              var rawProps = [];
              var cartItem = YGPRODUCTOPTIONS.cartData.items.find(function(i){return i.key === item.key});

              if(typeof cartItem === 'undefined') console.error("YGPO - Cart Item not found against key="+item.key);


              if(!!cartItem && !!cartItem.properties){
                Object.keys(cartItem.properties).forEach(function(key){
                    if(key.indexOf('_ygpooption') == -1)  rawProps.push({key: key, value: cartItem.properties[key]});
                })
              }

              return {
                id: item.id,
                key: item.key,
                raw_props: rawProps,
                title: item.product_title,
                quantity: item.quantity,
                value_ids: item.options.map(function(op){return op.value_id})
              };
            })

          }

          if(typeof YGPRODUCTOPTIONS.customer_id !== "undefined" && !!YGPRODUCTOPTIONS.customer_id)payload.customer_id = YGPRODUCTOPTIONS.customer_id;

          if(typeof YGPRODUCTOPTIONS.cart.dt !== "undefined" && !!YGPRODUCTOPTIONS.cart.dt)payload.dt = YGPRODUCTOPTIONS.cart.dt;

          var self = this;
          YGPRODUCTOPTIONS.utils.sendRequest('/po/generate', 'POST', payload)
          .then((response) => response.json()) // we will received HTML
          .then(function(json){

            if(!!json.redirect_url){
              window.location.href = json.redirect_url;
            }
            else {
              window.location.href = '/checkout';
            }

          })
          .catch(function(err){
              console.error("YGPO - ", err);
          })
          .finally(function(){

            submitBtn.classList.remove('ygpo--loading');
            submitBtn.removeAttribute('aria-disabled');

          });



        }
      }

    }
  }()



// --------------------------------------------------
//    WINDOW LOAD EVENT (TRIGGER EVENTS HERE)
// --------------------------------------------------

!function(a,b,c){var f,d=0,e=["ms","moz","webkit","o"];for(f=0;f<e.length&&!a[b];++f)a[b]=a[e[f]+"RequestAnimationFrame"],a[c]=a[e[f]+"CancelAnimationFrame"]||a[e[f]+"CancelRequestAnimationFrame"];a[b]||(a[b]=function(b){var c=(new Date).getTime(),e=Math.max(0,16-(c-d)),f=a.setTimeout(function(){b(c+e)},e);return d=c+e,f}),a[c]||(a[c]=function(b){a.clearTimeout(b)})}(this,"requestAnimationFrame","cancelAnimationFrame");


var ready = function () {


  if (document.body) {

    // Init code here
    YGPRODUCTOPTIONS.cart.init();


    // Return so that we don't call requestAnimationFrame() again
    return;
  }

  // If the body element isn't found, run ready() again at the next pain
  window.requestAnimationFrame(ready);
};

// Initialize our ready() function
window.requestAnimationFrame(ready);


})(window.YGPRODUCTOPTIONS = window.YGPRODUCTOPTIONS || {})
