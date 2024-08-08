
/**
 * @fileoverview Rendered in product page
 *   - To minify, use: https://t.ly/k3cQZ
 *
 * @auther https://github.com/yahyaizhar
 *
 * @version 1.0
 */


var SWATCHES_THRESHOLD = 5;

YGPRODUCTOPTIONS.product.condition_processed_ids = {};

// Product Utils
YGPRODUCTOPTIONS.product._Core = {

  resetOption: function(el){
      return;

    var selects = el.querySelectorAll('select');
    var radios_checkbox = el.querySelectorAll('[type=radio], [type=checkbox]');

    // Create the event
    var event = new CustomEvent("custom_change", { "detail": "" });
    var self = this;
    if(selects.length > 0){
        selects.forEach(function(item){
            item.selectedIndex = -1;
             // Dispatch/Trigger/Fire the event
            // item.dispatchEvent(event);

            self.listenChange(item);
        })
    }

    // if(radios_checkbox.length > 0){
    //     radios_checkbox.forEach(function(item){
    //         item.checked = false;
    //          // Dispatch/Trigger/Fire the event
    //         item.dispatchEvent(event);

    //         // item.trigger('change');
    //     })
    // }

  },
  getSelector: function (selector) {
    if (!!selector && selector != "") {
      var oSelector = selector.split("@");
      return {
        name: oSelector[0],
        placement: !!oSelector[1] ? oSelector[1] : null,
      };
    }
    return null;
  },
  renderOptions: function (from_conditions = false) {
    // This will render options

    if (YGPRODUCTOPTIONS.product.options.length > 0) {


      var html = "";

      // Generating HTML
      YGPRODUCTOPTIONS.product.options.forEach(function (option) {

        // check if already append
        var opEl = document.querySelector('.ygpo-option__container[data-option-id="'+option.id+'"]');
        if(!opEl){

          switch (option.type) {

            // SINGLE SELECTION
            case "dropdown":
              html += optionHTML_Dropdown(option);
              break;
            case "swatches":
              html += optionHTML_Swatches(option);
              break;
            case "radio":
              html += optionHTML_Radio(option);
              break;
            case "button":
              html += optionHTML_Button(option);
              break;
            case "color_image_dropdown":
              html += optionHTML_ColorImage(option);
              break;

            // MULTIPLE SELECTION
            case "swatches_multiple":
              html += optionHTML_SwatchesMultiple(option);
              break;
            case "dropdown_multiple":
              html += optionHTML_DropdownMultiple(option);
              break;
            case "checkbox":
              html += optionHTML_Checkbox(option);
              break;

            // TEXT INPUT
            case "short_text":
            case "short":
              html += optionHTML_ShortText(option);
              break;
            case "long_text":
            case "long":
              html += optionHTML_LongText(option);
              break;
            case "email":
              html += optionHTML_Email(option);
              break;
            case "phone_number":
              html += optionHTML_Phone(option);
              break;
            case "hidden":
              html += optionHTML_Hidden(option);
              break;
            case "number_field":
              html += optionHTML_Number(option);
              break;

            // OTHERS
            case "file_upload":
              html += optionHTML_File(option);
              break;
            case "date_picker":
              html += optionHTML_DatePicker(option);
              break;
            case "color_picker":
              html += optionHTML_ColorPicker(option);
              break;
            case "popup":
              html += optionHTML_Popup(option);
              break;
            case "information":
              html += optionHTML_Information(option);
              break;
            case "time_picker":
              html += optionHTML_TimePicker(option);
              break;

            default:
              break;
          }
        }
      });

      // Appending HTML
      var oSelector = YGPRODUCTOPTIONS.product._Core.getSelector(
        YGPRODUCTOPTIONS.product.selectors.option
      );

      var el = document.querySelector(oSelector.name);
      if (el) {
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
      } else {
        console.error("YGPO - ELEMENT NOT FOUND");
      }

      // Attaching Events
      this.attachEvents();

       // Default select
       this.handleDefaultSelection();

      // Init Conditions
      this.initConditions();

      // Trigger Custom event
      this.triggerEvent('option-rendered');



      // Calling plugin functions
      ALGO_SELECBOX();
      createSelect();

      // Event to handle required elements
      this.eventTohandleRequired();
    }
  },

  handleDefaultSelection(){

    var ops = YGPRODUCTOPTIONS.product.options.filter( x => x.values.some(y=>y.default_selected==1) );
    if(ops.length > 0){
        ops.forEach(function(option){
            // check if already append
            var opEl = document.querySelector('.ygpo-option__container[data-option-id="'+option.id+'"]');
            if(opEl){
                var values = option.values.filter(function(x){return x.default_selected == 1});
                if( values.length > 0 ){
                    values.forEach(function(value){
                        if(["dropdown", "dropdown_multiple"].includes(option.type)){
                            var valueEl = opEl.querySelector('.alg-list li a[data-value="'+value.id+'"]');
                            if(valueEl){

                                var event = new CustomEvent("click", { "detail": "noshow" });
                                valueEl.dispatchEvent(event);

                            }
                        }
                        else if(["color_image_dropdown"].includes(option.type)){
                            var valueEl = opEl.querySelector('.select-dropdown__list-item[data-value="'+value.id+'"]');
                            if(valueEl){

                                var event = new CustomEvent("click", { "detail": "noshow" });
                                valueEl.dispatchEvent(event);

                            }
                        }
                        else{
                            var checkableEls = opEl.querySelectorAll('input[type="radio"][value="'+value.id+'"], input[type="checkbox"][value="'+value.id+'"]');
                            if(checkableEls.length > 0){
                                checkableEls.forEach(function(el){
                                    var allow = true;
                                    if( option.type === "swatches" && option.name.toLowerCase().replace(/\s+/g, '') === "tartanswatch" ){
                                        var urlParams = new URLSearchParams(window.location.search);
                                        var tartanValue = urlParams.get('tartan') || null;
                                        if(tartanValue) allow = false;
                                    }

                                    if(allow){
                                       el.checked = true;
                                        el.trigger('change')
                                    }

                                })
                            }

                        }
                    })

                }

            }
        });
    }



   },

  triggerEvent(name, data=null){
    var e = new CustomEvent("ygpo:"+name, {
      detail: data,
    });

    document.dispatchEvent(e);
  },

  eventTohandleRequired(){
    var requiredOps = YGPRODUCTOPTIONS.product.options.filter(function(op){return op.required === 1});

    if(YGPRODUCTOPTIONS.product.selectors.add_to_cart && requiredOps.length > 0){
        var btnEl = document.querySelectorAll(YGPRODUCTOPTIONS.product.selectors.add_to_cart);
        
        if(btnEl.length > 0){
            btnEl.forEach(function(el){
                el.addEventListener('click', function(e){
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    var self = this;
                    var selectedQty =  document.querySelectorAll('#add-to-cart-form input[name=quantity]')[0].value;
                  //   console.log('selected Qty',selectedQty);
                  
                    var els = document.querySelectorAll('.ygpo-option__container');
                    if(els.length > 0){
                        els.forEach(function(el){ el.classList.remove('ygpo-option__container--required') })
                    }


                    // Check for Required options
                    var error = false;
                    var firstEl = null;
                  
                    var selectProductTitle = document.querySelector('.product-shop .product-title span').innerText;

                    requiredOps.forEach(function(op){
                        var elFound = document.querySelector('.ygpo-option__container:not(.ygpo-condition--hide)[data-option-id="'+op.id+'"]');
                        if(elFound){

                            var isSelected = false;
                            var isMinQtySelected = false;
                          
                          
                            if(elFound.querySelector('.ygpo_properties_input.ygpo_properties_input_value[data-self]')){
                                isSelected = !!elFound.querySelector('.ygpo_properties_input.ygpo_properties_input_value') && !!elFound.querySelector('.ygpo_properties_input.ygpo_properties_input_value').value;
                            }
                            else{
                                isSelected = !!elFound.querySelector('.ygpo_properties_input.ygpo_properties_input_value');
                              
                                  if(elFound.querySelector('.ygpo_properties_input.ygpo_properties_input_value')){
                                    var selOpEle = elFound.querySelector('.ygpo_properties_input.ygpo_properties_input_value').value.split('|');
                                      var selMinQty = (!!selOpEle[3] ? parseInt(selOpEle[3]) : 1);
                                    isMinQtySelected = !(selectedQty < selMinQty);
                                      // console.log(selectedQty,selMinQty,!(selectedQty < selMinQty));
                                    if(!isMinQtySelected){
                                      //alert('Min Qty. required for current selection '+selMinQty);
                                      
                                     YGPRODUCTOPTIONS.product._Core.optionMsgPopUp(selectProductTitle+': current selection required min Qty :'+selMinQty);
                                    }
                                  }
                               // console.log(!!elFound.querySelector('.ygpo_properties_input.ygpo_properties_input_value'));
                            }


                            if(!isSelected){
                                // Highlight this option container
                                error = true;

                                if(!firstEl) firstEl = elFound;

                                elFound.classList.add('ygpo-option__container--required');


                            }

                          if(!isMinQtySelected){
                            error = true;
                          }
                        }
                    });

                    if(error){

                        // Scroll to first error element
                        if(firstEl){
                            firstEl.scrollIntoView();
                        }

                    }
                    else{
                        // Remove hidden options
                        var els = document.querySelectorAll('.ygpo-option__container.ygpo-condition--hide');
                        if(els.length > 0){
                            els.forEach(function(el){ el.remove(); })
                        }



                        // submit form
                        self.closest('form').submit();

                    }


                });
            })

        }
    }
  },

  attachEvents: function(){
    let els = document.querySelectorAll('.ygpo-option-element:not(.ygpo-option-element--initialized)');
    let self = this;
    els.forEach(function(elem){

        elem.addEventListener('change', function(){self.listenChange(this);}, false);
      // if(elem.tagName === "INPUT" && (elem.getAttribute('type') !== "radio" && elem.getAttribute('type') !== "checkbox")){
      //   elem.addEventListener('input', self.listenChange, false);
      // }

      elem.classList.add('ygpo-option-element--initialized');
    });


    // close modals on background click
    document.addEventListener('click', event => {
        if (event.target.classList.contains('ygpo-modal')) {
            self.closeModal();
        }
    });

    document.addEventListener('click', event => {
        if (event.target.classList.contains('ygpo-option-p-bg')) {
            self.optionMsgClosePopup();
        }
     });
    
  },

  initConditions(){
    if(!!YGPRODUCTOPTIONS.product.conditions && YGPRODUCTOPTIONS.product.conditions.length > 0){
        var optionSetRequired =  YGPRODUCTOPTIONS.product.conditions.some(function(y){
            return y.actions.some(function(x){
                return x.by === "option_set" && typeof x.optionset === "undefined"
            });
        });
        if(optionSetRequired){

          var fetchOptionSets = function(payload){

            if(payload.length === 0)return;

            var item = payload.shift();


            // we have some condition that require showing option sets
            YGPRODUCTOPTIONS.utils.sendRequest('/option-sets/'+item.id+'/options', 'get')
            .then((response) => response.json()) // we will received HTML
            .then(function(json){


                YGPRODUCTOPTIONS.product.conditions.forEach(function(condition, condition_index){
                  condition.actions.forEach(function(action, action_index){
                    if(action.by === "option_set" && action.optionSetId && action.optionSetId === item.id){
                      YGPRODUCTOPTIONS.product.conditions[condition_index].actions[action_index].optionset = json;
                    }
                  })
                })

              fetchOptionSets(payload);
            })
            .catch(function(err){
              console.error("YGPO - ", err);
            });
          }

          var optionSetIds = [];
            YGPRODUCTOPTIONS.product.conditions.forEach(function(condition, conditionIndex){

                condition.actions.forEach(function(item, i){
                    if(item.by === "option_set"){
                      if(!optionSetIds.some(function(x){return x.id == item.optionSetId})){
                          optionSetIds.push({
                            index: i,
                            id: item.optionSetId
                          });
                      }
                    }
                  })

            });

          fetchOptionSets(optionSetIds);
        }
    }
  },

  processConditions(){

    if(!YGPRODUCTOPTIONS.product.conditions || YGPRODUCTOPTIONS.product.conditions.length === 0)return;

    var conditions = JSON.parse(JSON.stringify(YGPRODUCTOPTIONS.product.conditions));

    var selected_options = [];

    // get all selected values of options
    var selectedEls = document.querySelectorAll('.ygpo_properties_input.ygpo_properties_input_value');
    if(selectedEls.length > 0){
      selectedEls.forEach(function(el){
        if(!!el.value){
          var value = el.value.split('|');

          var o = {};

          o.id = value[2];
          o.charge = !!value[1] ? parseFloat(value[1]) : 0;
          o.value_id = value[0];

          selected_options.push(o);

        }

      })
    }

    conditions.forEach(function(condition, condition_index){

      // Check on each condition rules, and generate boolean expression
      condition.rules.map(function(rule){

        rule.valid = false;

        switch(rule.condition){
          case 'chargable':
            rule.valid = selected_options.some(function(op){return op.id == rule.optionId && op.charge > 0});
            break;
          case 'equal_to':
            rule.valid = selected_options.some(function(op){return op.id == rule.optionId && op.value_id == rule.valueId});
            break;
          case 'not_equal_to':
            rule.valid = selected_options.some(function(op){return op.id == rule.optionId && op.value_id != rule.valueId});
            break;

          default:
            break;
        }

        return rule;

      });




      // Check when to do actions
      var doAction = false;
      if(condition.rules_apply_on === "any"){
        // If any rule is valid
        doAction = condition.rules.some(function(rule){return rule.valid});
      }
      else{
        // If all rules are valid
        doAction = condition.rules.every(function(rule){return rule.valid});
      }

      // if(!doAction) return true;

      var isProcessed = !!YGPRODUCTOPTIONS.product.condition_processed_ids[condition.id];

      if(conditions.length === 1 || doAction ){ // && isProcessed


        // reset all

        var els = document.querySelectorAll('.ygpo-option__container');
        if(els.length > 0){
            els.forEach(function(el){
                el.classList.remove('ygpo-condition--show');
                el.classList.remove('ygpo-condition--hide');
            });
        }


        YGPRODUCTOPTIONS.product.options
        .forEach(function(op){
          if(!!op.from && op.from === "condition"){
            var el = document.querySelector('.ygpo-option__container[data-option-id="'+op.id+'"]');
            if(el){
                el.remove();
            }
          }
        });

        YGPRODUCTOPTIONS.product.condition_processed_ids[condition.id] = false;

      }

      if(doAction){ // && !isProcessed

        var tmpOptions = JSON.parse(JSON.stringify(YGPRODUCTOPTIONS.product.options))
        .filter(function(op){return !(!!op.from && op.from === "condition")});


        var option_set_processed = false;

        condition.actions
        .filter(function(action){return action.by === "option_set"})
        .forEach(function(action){

            if(action.type === "show"){
                if(action.optionset.length > 0){
                    var options = JSON.parse(JSON.stringify(action.optionset))
                    .filter(function(op){return !tmpOptions.some(function(to){return to.id == op.id}) });

                    if(options.length > 0) option_set_processed = true;

                    options.forEach(function(op){ tmpOptions.push(op); });

                }
            }

        });

        // Re-render options
        if(option_set_processed){
            YGPRODUCTOPTIONS.product.options = tmpOptions;
            YGPRODUCTOPTIONS.product._Core.renderOptions(true);
        }

        condition.actions
        .filter(function(action){return action.by === "option"})
        .forEach(function(action){

            var els = document.querySelectorAll('.ygpo-option__container[data-option-id="'+action.optionId+'"]');
            if(els.length > 0){
                els.forEach(function(el){
                    if(action.type === "show")el.classList.add('ygpo-condition--show');
                    else if(action.type === "hide"){
                        el.classList.add('ygpo-condition--hide');

                        // Reset Option
                        YGPRODUCTOPTIONS.product._Core.resetOption(el);

                    }
                });
            }

        });

        YGPRODUCTOPTIONS.product.condition_processed_ids[condition.id] = true;
      }

    })
  },


  calculateCharge(){
    var charge = 0;

    // get all selected values of options
    var selectedEls = document.querySelectorAll('.ygpo_properties_input.ygpo_properties_input_value');
    if(selectedEls.length > 0){
      selectedEls.forEach(function(el){
        if(!!el.value){
          var value = el.value.split('|');
          charge += (!!value[1] ? parseFloat(value[1]) : 0);
        }

      })
    }

    var propsEls = document.querySelectorAll('.ygpo_selection_total_charge');
    if(propsEls.length > 0)propsEls.forEach(function(el){el.remove()});

    if(charge > 0){
      var items = document.querySelectorAll('.ygpo-option__container');
      var lastItem = items[items.length -1];

      var html = `
        <div class="ygpo_selection_total_charge">
          Selection will add
            <span>${YGPRODUCTOPTIONS.utils.formatMoney(charge).amount_with_symbol}</span>
          to the price
        </div>
      `;

      lastItem.insertAdjacentHTML( 'afterend', html );
    }


        var selectedQty =  document.querySelectorAll('#add-to-cart-form input[name=quantity]')[0].value;
    
         var minQty = 0;

        if(selectedEls.length > 0){
          selectedEls.forEach(function(el){
            if(!!el.value){
              var value = el.value.split('|');
              minQty = (!!value[3] ? parseInt(value[3]) : 1);
            }
          })
        }

        //console.log('option selections',parseInt(selectedQty),minQty,parseInt(selectedQty) >= minQty);

        var propsEls1 = document.querySelectorAll('.ygpo_selection_min_qty');

        if(propsEls1.length > 0)propsEls1.forEach(function(el){el.remove()});

        if(parseInt(selectedQty) < minQty){

          var items = document.querySelectorAll('.ygpo-option__container');
          var lastItem = items[items.length -1];

          var html = `
          <div class="ygpo_selection_min_qty">
            Selection is required min qty
              <span>${minQty}</span>
          </div>
        `;
  
        lastItem.insertAdjacentHTML( 'afterend', html );
        }


    // Update price

    // Appending HTML
    var oSelector = YGPRODUCTOPTIONS.product._Core.getSelector(
      YGPRODUCTOPTIONS.product.selectors.price
    );

    var el = document.querySelector(oSelector.name);

    if (el) {
      var p = parseFloat(el.innerText.replace(/[^0-9.]/g, '')) || null;
      if(p){
        if(!YGPRODUCTOPTIONS.product.price){
          YGPRODUCTOPTIONS.product.price = p;
        }
        else{
          p = YGPRODUCTOPTIONS.product.price;
        }
        html = YGPRODUCTOPTIONS.utils.formatMoney(p + charge).amount_with_symbol
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
      }
    } else {
      console.error("YGPO - ELEMENT NOT FOUND");
    }


  },


  chargeFoundInCart(optionId, valueId){

    var chargeFound = false;
    // Check if charge already added against this option value
    if(!!YGPRODUCTOPTIONS.cart_items){
      chargeFound = YGPRODUCTOPTIONS.cart_items.some(function(item){

          return item.options.some(function(o){
            return o.id == optionId && o.value_id == valueId && o.charge > 0;
          });

      });

    }

    return chargeFound;

  },

  listenChange: function(el){
    if(el instanceof Event) el = el.currentTarget;

    let container = el.closest('.ygpo-option__container');
    if(container){

      container.classList.remove('ygpo-option__container--required');

      var propsEls = container.querySelectorAll('.ygpo_properties_input');
      if(propsEls.length > 0)propsEls.forEach(function(el){el.remove()});

      var textArr = [];
      // Check if this is select
      if(el.tagName === "SELECT"){
          var selectedOps = Array.from(el.selectedOptions);
          selectedOps.forEach(function(selectedOp){
             var o = {
                text: '',
                charge:0,
                value_id: selectedOp.value,
                minQty:1,
              };
              if(selectedOp.hasAttribute('data-text')){
                o.text = selectedOp.getAttribute('data-text');
              }
              if(selectedOp.hasAttribute('data-charge')){
                o.charge = parseFloat(selectedOp.getAttribute('data-charge')) || 0;
              }
              if(selectedOp.hasAttribute('data-minQty')){
                o.minQty = parseFloat(selectedOp.getAttribute('data-minQty')) || 0;
              }
             textArr.push(o);
          });
      }

      else{

        // get name of this elem, loop through all elem with same name, generate a text outof that
        var name = el.getAttribute('name');

          var nameEls = document.querySelectorAll('[name="'+name+'"]')

        if(el.tagName === "INPUT" && (el.getAttribute('type') === "radio" || el.getAttribute('type') === "checkbox")){
          nameEls = document.querySelectorAll('[name="'+name+'"]:checked');
        }
        else if(el.tagName === "INPUT" || el.tagName === "TEXTAREA"){
          nameEls = Array.from(document.querySelectorAll('[name="'+name+'"]')).filter(x=>!!x.value);
        }
        nameEls.forEach(function(el){
             var o = {
              text: '',
              charge:0,
              value_id: el.value,
              minQty:1,
            };
            if(el.hasAttribute('data-value-id')){
                o.value_id = el.getAttribute('data-value-id');
            }
            if(el.hasAttribute('data-text')){
              o.text = el.getAttribute('data-text');
            }
            if(el.hasAttribute('data-minQty')){
              o.minQty = el.getAttribute('data-minQty');
            }
            else{
              // value in value attr
              o.text = el.value;
            }
            if(el.hasAttribute('data-charge')){
              o.charge = parseFloat(el.getAttribute('data-charge')) || 0;
            }
            if(el.hasAttribute('data-minQty')){
              o.minQty = parseFloat(el.getAttribute('data-minQty')) || 0;
            }
             textArr.push(o);
        })
      }

      // Clear Selected
      let valueLabelEl = container.querySelector('.ygpo-option__label--selected');
      if(valueLabelEl){
        valueLabelEl.innerHTML = ``;
      }


      if(textArr.length > 0 && container.hasAttribute('data-option-id')){

        var optionId = container.getAttribute('data-option-id');
        var optionTitle = container.getAttribute('data-option-title');

        var texts = [];
        var values = [];
        textArr.forEach(function(item){

          var text = item.text;
          var charge = item.charge;
          var value_id = item.value_id;
          var minQty = item.minQty;


          if(YGPRODUCTOPTIONS.product._Core.chargeFoundInCart(optionId, value_id)) charge = 0;

          if(charge > 0) text += ` [ ${YGPRODUCTOPTIONS.utils.formatMoney(charge).amount_with_symbol} ]`;

          texts.push(text);
          values.push(`<input type="hidden" name="properties[_ygpooption|${optionId}|${value_id}]" value="${value_id}|${charge}|${optionId}|${minQty}" class="ygpo_properties_input ygpo_properties_input_value">`);


        });

        var appendProps = true;
        if(el.hasAttribute('data-self')){
          appendProps = false;
        }

        // Add value to Line Item Properties
        var html = `
          ${appendProps ? `<input type="hidden" name="properties[${optionTitle}]" value="${texts.join(', ')}" class="ygpo_properties_input ygpo_properties_input_label">` : ''}
          ${values.join('')}
        `;
        container.insertAdjacentHTML( 'beforeend', html );


        let valueLabelEl = container.querySelector('.ygpo-option__label--selected');
        if(valueLabelEl){
          valueLabelEl.innerHTML = `
            <span>${texts.join(', ')}</span>
          `;
        }

      }

      var optionId = container.getAttribute('data-option-id');

        if(textArr.length > 0 && YGPRODUCTOPTIONS.product.options.some(function(op){return op.id == optionId && op.type === "swatches" && op.name.toLowerCase().replace(/\s+/g, '') === "tartanswatch" })){
            YGPRODUCTOPTIONS.product._Core.updateUrlParem('tartan', textArr[0].text);
        }

      if(YGPRODUCTOPTIONS.product.options.some(function(op){return op.id == optionId && op.from !== "condition"})){

        // process any conditions
        YGPRODUCTOPTIONS.product._Core.processConditions();
      }

    }



    YGPRODUCTOPTIONS.product._Core.calculateCharge();
  },

  updateUrlParem:function(param, paramVal){
        var url = window.location.href;
        var newAdditionalURL = "";
        var tempArray = url.split("?");
        var baseURL = tempArray[0];
        var additionalURL = tempArray[1];
        var temp = "";
        if (additionalURL) {
            tempArray = additionalURL.split("&");
            for (var i=0; i<tempArray.length; i++){
                if(tempArray[i].split('=')[0] != param){
                    newAdditionalURL += temp + tempArray[i];
                    temp = "&";
                }
            }
        }

        var rows_txt = temp + "" + param + "=" + paramVal;
        var updated_url = baseURL + "?" + newAdditionalURL + rows_txt;

        /* Update the url */
        window.history.pushState({path:updated_url},'',updated_url);

        return updated_url;
    },

  // open modal by id
  showMoreOptions( event, optionId ) {
    event.preventDefault();

    var option = YGPRODUCTOPTIONS.product.options.find(function(x){return x.id == optionId});

    var optionTitle = "Option";

    if(typeof option !== "undefined" && option){
      optionTitle = option.title;
    }
    var optionHelpText = `These ${optionTitle.toLowerCase()} are hand-picked by us since they are high in demand`;
    if(typeof option.swatch_tab1_helptext !== "undefined" && option.swatch_tab1_helptext && option.swatch_tab1_helptext.trim() !== ''){
      optionHelpText = option.swatch_tab1_helptext;

    }


    var modalHtml = `
      <div id="ygpo-swatch-modal-${optionId}" class="ygpo-modal ygpo--open">
          <div class="ygpo-modal-body">

              <button onclick="YGPRODUCTOPTIONS.product._Core.closeModal()" class="ygpo-modal-btnclose">

                  <span class="hidden md:inline-block">Close</span>
                  <svg  width="15" height="15" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" ><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" class=""></path></svg>

              </button>

              <div class="ygpo-modal-leftbody">
                <h2>
                  <span>Find Your ${optionTitle}</span>
                </h2>

                <div class="ygpo-tabset">
                  <!-- Tab 1 -->
                  <input type="radio" name="ygpo-tabset" id="tab1" aria-controls="ygpo-tab-fav" checked value="fav">
                  <label for="tab1">Favourites</label>
                  <!-- Tab 2 -->
                  <input type="radio" name="ygpo-tabset" id="tab2" aria-controls="ygpo-tab-search" value="search">
                  <label for="tab2">Search</label>
                  <!-- Tab 3 -->
                  <input type="radio" name="ygpo-tabset" id="tab3" aria-controls="ygpo-tab-az" value="az">
                  <label for="tab3">A-Z</label>

                  <div class="ygpo-tab-panels">
                    <section id="ygpo-tab-fav" class="ygpo-tab-panel">

                      <p style="white-space: pre-line;">${optionHelpText}</p>

                    </section>
                    <section id="ygpo-tab-search" class="ygpo-tab-panel">

                      <div class="ygpo-search__container">
                        <input type="text" placeholder="Enter Name" name="ygpo-search">

                        <div class="ygpo-search-icon-container">
                            <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="15" width="15"><path fill="currentColor" d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z" class=""></path></svg>
                        </div>

                      </div>
                    </section>
                    <section id="ygpo-tab-az" class="ygpo-tab-panel">
                      <div class="ygpo-az-items">
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-a" type="radio" name="ygpo-azinput" value="a" checked>
                         <label for="ygpo-azinput-a">A</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-b" type="radio" name="ygpo-azinput" value="b">
                         <label for="ygpo-azinput-b">B</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-c" type="radio" name="ygpo-azinput" value="c">
                         <label for="ygpo-azinput-c">C</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-d" type="radio" name="ygpo-azinput" value="d">
                         <label for="ygpo-azinput-d">D</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-e" type="radio" name="ygpo-azinput" value="e">
                         <label for="ygpo-azinput-e">E</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-f" type="radio" name="ygpo-azinput" value="f">
                         <label for="ygpo-azinput-f">F</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-g" type="radio" name="ygpo-azinput" value="g">
                         <label for="ygpo-azinput-g">G</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-h" type="radio" name="ygpo-azinput" value="h">
                         <label for="ygpo-azinput-h">H</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-i" type="radio" name="ygpo-azinput" value="i">
                         <label for="ygpo-azinput-i">I</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-j" type="radio" name="ygpo-azinput" value="j">
                         <label for="ygpo-azinput-j">J</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-k" type="radio" name="ygpo-azinput" value="k">
                         <label for="ygpo-azinput-k">K</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-l" type="radio" name="ygpo-azinput" value="l">
                         <label for="ygpo-azinput-l">L</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-m" type="radio" name="ygpo-azinput" value="m">
                         <label for="ygpo-azinput-m">M</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-n" type="radio" name="ygpo-azinput" value="n">
                         <label for="ygpo-azinput-n">N</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-o" type="radio" name="ygpo-azinput" value="o">
                         <label for="ygpo-azinput-o">O</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-p" type="radio" name="ygpo-azinput" value="p">
                         <label for="ygpo-azinput-p">P</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-q" type="radio" name="ygpo-azinput" value="q">
                         <label for="ygpo-azinput-q">Q</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-r" type="radio" name="ygpo-azinput" value="r">
                         <label for="ygpo-azinput-r">R</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-s" type="radio" name="ygpo-azinput" value="s">
                         <label for="ygpo-azinput-s">S</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-t" type="radio" name="ygpo-azinput" value="t">
                         <label for="ygpo-azinput-t">T</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-u" type="radio" name="ygpo-azinput" value="u">
                         <label for="ygpo-azinput-u">U</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-v" type="radio" name="ygpo-azinput" value="v">
                         <label for="ygpo-azinput-v">V</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-w" type="radio" name="ygpo-azinput" value="w">
                         <label for="ygpo-azinput-w">W</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-x" type="radio" name="ygpo-azinput" value="x">
                         <label for="ygpo-azinput-x">X</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-y" type="radio" name="ygpo-azinput" value="y">
                         <label for="ygpo-azinput-y">Y</label>
                        </div>
                        <div class="ygpo-az-item">
                         <input id="ygpo-azinput-z" type="radio" name="ygpo-azinput" value="z">
                         <label for="ygpo-azinput-z">Z</label>
                        </div>
                      </div>
                    </section>
                  </div>

                </div>

              </div>
              <div class="ygpo-modal-centerbody">
                <div class="ygpo-modal-centerbody__content" data-title="${optionTitle}"></div>
              </div>


              <div class="ygpo-overlay" style="display:none;">
                  <div class="ygpo-overlay__inner">
                      <div class="ygpo-overlay__content"><span class="ygpo-spinner"></span></div>
                  </div>
              </div>

          </div>
      </div>
    `;

    document.body.insertAdjacentHTML( 'beforeend', modalHtml );
    document.body.classList.add('ygpo-modal-open');

    this.loadSwatchesValues(optionId);


    var el = document.getElementById(`ygpo-swatch-modal-${optionId}`);
    var self = this;

    // Event on search input
    var searchEl = el.querySelector('[name="ygpo-search"]');
    if(searchEl){
      searchEl.addEventListener('keyup', function (e) {

        if (e.key === "Enter") {
          // Do work
          e.preventDefault();
          self.loadSwatchesValues(optionId);
        }

      }, false);
    }


    // Event on search icon click
    var searchIconEl = el.querySelector('.ygpo-search-icon-container');
    if(searchIconEl){
      searchIconEl.addEventListener('click', function (e) {
         // Do work
          e.preventDefault();
          self.loadSwatchesValues(optionId);
      }, false);
    }

    var azEls = el.querySelectorAll('.ygpo-az-items .ygpo-az-item input, [name="ygpo-tabset"]');
    azEls.forEach(function(elem){

        elem.addEventListener('change', function (e) {

            self.loadSwatchesValues(optionId);

        }, false);

    });


  },

  // close currently open modal
  closeModal() {
    var openModalEl = document.querySelector('.ygpo-modal.ygpo--open');
    if(openModalEl){

      //data-remove
      if(openModalEl.hasAttribute('data-remove') && openModalEl.getAttribute('data-remove') == 0) document.querySelector('.ygpo-modal.ygpo--open').classList.remove('ygpo--open');
      else document.querySelector('.ygpo-modal.ygpo--open').remove();
      document.body.classList.remove('ygpo-modal-open');

    }
  },

  // close currently open modal
  openPopup(event, self) {
    event.preventDefault();
    var popupEl = self.closest('.ygpo-popup-container');
    if(popupEl){
      popupEl.querySelector('.ygpo-modal').classList.add('ygpo--open');
      document.body.classList.add('ygpo-modal-open');
    }
  },

  attachEventToPagination(optionId){

    var self = this;
    // Attach event to pagination links
    var el = document.getElementById(`ygpo-swatch-modal-${optionId}`);
    if(el){

      // EVENTS on pagination links
      var aEl = el.querySelectorAll('.ygpo-page-link');
      aEl.forEach(function(elem){

          elem.addEventListener('click', function (e) {
            e.preventDefault();

            var url = new URL(this.getAttribute('href'));
            self.loadSwatchesValues(optionId, Object.fromEntries(url.searchParams));

          }, false);

      });

    }

    // Attach event to swatch changes

    var swatchEls = el.querySelectorAll('.ygpo-swatch .ygpo-swatch-element input');
    swatchEls.forEach(function(elem){

        elem.addEventListener('change', function (e) {
          // Select this swatch and close modal

          var valueId = this.value;

          var masterOptionContainer = document.querySelector('.ygpo-swatch-master[data-option="'+optionId+'"]');
          if(masterOptionContainer){
            var tmpSwatchContainer = masterOptionContainer.querySelector('.ygpo-swatch-element-tmp');

            // clear tmp swatch
            tmpSwatchContainer.innerHTML = '';

            var valueFound = masterOptionContainer.querySelector('input.ygpo-option-element[value="'+valueId+'"]');
            if(!valueFound){
              // append a temp swatch

              var currentValueParent = this.closest('.ygpo-swatch-element.ygpo-swatch-element--lg');
              if(currentValueParent){
                var newEl = currentValueParent.cloneNode(true);

                // clean el a bit
                newEl.querySelector('label span').remove();
                newEl.classList.remove('ygpo-swatch-element--lg');
                var newElName = newEl.querySelector('input').getAttribute('name');
                newElName = newElName.replace("-lg", '');
                newEl.querySelector('input').setAttribute('name', newElName);
                newEl.querySelector('input').checked = false;

                if(tmpSwatchContainer){
                  tmpSwatchContainer.append(newEl);

                  // Add event lister to this newly appended element
                  tmpSwatchContainer.querySelector('input').addEventListener('change', function(){self.listenChange(this);}, false);


                }

              }
            }


            // Select new swatch
            var newSwatch = document.querySelector('.ygpo-swatch-master[data-option="'+optionId+'"] input.ygpo-option-element[value="'+valueId+'"]');
            setTimeout(function(){
              newSwatch.trigger('click');
              newSwatch.click();
            }, 5)

            // Close Modal

            self.closeModal();
          }

        }, false);

    });


  },

  toggleOverlay(optionId, s="none"){
    var modalEl = document.getElementById(`ygpo-swatch-modal-${optionId}`);

    var overlayEl = modalEl.querySelector('.ygpo-overlay');
    if(overlayEl) overlayEl.style.display = s;
  },

  loadSwatchesValues(optionId, params = null){

    var modalEl = document.getElementById(`ygpo-swatch-modal-${optionId}`);
    if(!modalEl)return;

    var urlParams = new URLSearchParams();
    if(!!params){
      Object.keys(params).forEach(function(key){
        urlParams.append(key, params[key]);
      });
    }

    var selectedTab = modalEl.querySelector('[name="ygpo-tabset"]:checked').value;

    if(selectedTab === "fav"){
      urlParams.append("fav_only", 1);
    }
    else if(selectedTab === "search"){
      var searchValue = modalEl.querySelector('[name="ygpo-search"]').value;
      if(!!searchValue) urlParams.append("q", searchValue.trim());
    }
    else if(selectedTab === "az"){
      var azEl = modalEl.querySelector('.ygpo-az-items .ygpo-az-item input:checked');
      if(azEl){
        var searchValue = azEl.value;
        if(!!searchValue) urlParams.append("by_letter", searchValue);
      }
    }

    urlParams = urlParams.toString();
    if(!!urlParams)urlParams = '?'+urlParams;


    this.toggleOverlay(optionId, 'block');


    var self = this;
    // Get values against option
    YGPRODUCTOPTIONS.utils.sendRequest('/options/'+optionId+'/values'+urlParams, 'get')
    .then((response) => response.text()) // we will received HTML
    .then(function(html){
      modalEl = document.getElementById(`ygpo-swatch-modal-${optionId}`);
      if(!modalEl)return;

      var bodyEl = modalEl.querySelector('.ygpo-modal-centerbody .ygpo-modal-centerbody__content');
      if(bodyEl){
        bodyEl.innerHTML = html;
        var optionTitle = bodyEl.getAttribute('data-title');
        var tEl = bodyEl.querySelector('.ygpo-dn-option-title');
        if(tEl)tEl.innerText = optionTitle;
        self.attachEventToPagination(optionId);

        // adjust tabs
        if(typeof adjustTabs === "function") adjustTabs();

      }

    })
    .catch(function(err){
        console.error("YGPO - ", err);
    })
    .finally(function(){
        self.toggleOverlay(optionId, 'none');
    });


  },

  optionMsgPopUp(content = "none"){

        var mHtml = `<div class="ygpo-option-p-wrap">
    	<div>
    	 <div role="dialog" aria-modal="true" aria-live="assertive" tabindex="1" class="ygpo-option-p ygpo-option-a">
    	   <button title="Close (Esc)" onclick="YGPRODUCTOPTIONS.product._Core.optionMsgClosePopup()" type="button" class="ygpo-option-close" aria-label="Close">×</button>
    	
        	   <ul><li>${content}</li></ul>
    		   <div>
    			 <button class="ygpo-option-ok" onclick="YGPRODUCTOPTIONS.product._Core.optionMsgClosePopup()"></button>
    			 <div style="display:table;clear:both;"></div>
    		   </div>
    	 </div>
    	</div>
    </div>
    <div class="ygpo-option-p-bg ygpo-option-a"></div>`;
    //alert('ssssssssssssssssssssss');
     document.body.insertAdjacentHTML('beforeend', mHtml);
  },

  optionMsgClosePopup(){
     var openModalEl = document.querySelector('.ygpo-option-p-wrap');
    if(openModalEl){
       document.querySelector('.ygpo-option-p-wrap').remove();
       document.querySelector('.ygpo-option-p-bg.ygpo-option-a').remove()
    }
  }
  

};

// SIZE Chart Event
document.addEventListener('alg-sizeguide', function(e){
    var detail = e.detail;

  if(detail.option_id){
    var option = YGPRODUCTOPTIONS.product.options.find(function(x){return x.id == detail.option_id});
      if(option && typeof option.sizechart !== "undefined" && option.sizechart && option.sizechart !== ""){
        // show size chart modal

        var modalHtml = `
          <div class="ygpo-dialog ygpo-dialog--right ygpo-dialog--open">
              <div class="ygpo-dialog__body">
                  <div class="ygpo-dialog__header">
                      <h4>Size Chart</h4>
                      <button class="ygpo-dialog__close" onclick="this.closest('.ygpo-dialog').remove()">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                      </button>
                  </div>
                  <div class="ygpo-dialog__content">
                      ${option.sizechart}
                  </div>
              </div>
          </div>
        `;

        document.body.insertAdjacentHTML( 'beforeend', modalHtml );

      }

  }
}, false);


// --------------------------------------------------
//    OptionRender: {type} specefic functions
//        purpose of this is to make mutations easy
// --------------------------------------------------

var optionHTML_Dropdown = function (option) {
  var isRequired = false;
  if(option.required){
    isRequired = true;
  }
  var showOptional = true;
  if(option.title.toLowerCase().indexOf('(optional)') > -1){
    showOptional = false;
  }

  // Helptext & tooltip
  var helptextHtml = '', tooltipHtml = '';

  if(typeof option.helptext !== "undefined" && option.helptext){
    helptextHtml = `
      <p class="ygpo-option__helptext">${option.helptext}</p>
    `;
  }
  if(typeof option.tooltip !== "undefined" && option.tooltip){
    tooltipHtml = `
      <span class="ygpo-option__tooltip" data-tooltip="${option.tooltip}">
        <svg fill="#000000" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.536 29.536" xml:space="preserve"> <g> <path d="M14.768,0C6.611,0,0,6.609,0,14.768c0,8.155,6.611,14.767,14.768,14.767s14.768-6.612,14.768-14.767 C29.535,6.609,22.924,0,14.768,0z M14.768,27.126c-6.828,0-12.361-5.532-12.361-12.359c0-6.828,5.533-12.362,12.361-12.362 c6.826,0,12.359,5.535,12.359,12.362C27.127,21.594,21.594,27.126,14.768,27.126z"/> <path d="M14.385,19.337c-1.338,0-2.289,0.951-2.289,2.34c0,1.336,0.926,2.339,2.289,2.339c1.414,0,2.314-1.003,2.314-2.339 C16.672,20.288,15.771,19.337,14.385,19.337z"/> <path d="M14.742,6.092c-1.824,0-3.34,0.513-4.293,1.053l0.875,2.804c0.668-0.462,1.697-0.772,2.545-0.772 c1.285,0.027,1.879,0.644,1.879,1.543c0,0.85-0.67,1.697-1.494,2.701c-1.156,1.364-1.594,2.701-1.516,4.012l0.025,0.669h3.42 v-0.463c-0.025-1.158,0.387-2.162,1.311-3.215c0.979-1.08,2.211-2.366,2.211-4.321C19.705,7.968,18.139,6.092,14.742,6.092z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </svg>
      </span>
    `;
  }


  return `
    <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">

      <div class="ygpo-option__label">
        <span> ${option.title} ${tooltipHtml} </span>
        <span class="ygpo-option__label--required">${isRequired ? '*' : (showOptional ? '(Optional)' : '')}</span>
      </div>
      ${helptextHtml}
      <select class="ygpo-option-element ygpo-selectbox" ${typeof option.sizechart !== "undefined" && !!option.sizechart ? `data-showsizeguide=""` : ''} data-payload="option_id:${option.id}" data-placeholder="Select ${option.title}">

        ${option.values
          .map(function (value) {
            var charge = 0;
            if(!!value.charge_value){
              if(value.charge_action === "fixed_charge"){
                charge = value.charge_value;
              }
              else{
                 // charge = Number((variantPrice - ((variantPrice / 100) * vb.price)).toFixed(2));
              }
            }

            var minQty = 1;
            if(!!value.min_qty){
              minQty = value.min_qty;
            }
            

            if(YGPRODUCTOPTIONS.product._Core.chargeFoundInCart(option.id, value.id)) charge = 0;

            var title = `${value.title}${charge > 0 ? ` (+${YGPRODUCTOPTIONS.utils.formatMoney(charge).amount_with_symbol})` : ''}`;
            return `
              <option data-text="${value.title}" data-minQty="${minQty}" data-charge="${charge}" value="${value.id}">${title}</option>
            `;
          })
          .join("")}

      </select>

      </div>
    `;
};

var optionHTML_Swatches = function (option) {
  option = JSON.parse(JSON.stringify(option));
  var total_values = option.values.length;
  var isRequired = false;
  if(option.required){
    isRequired = true;
  }
  var showOptional = true;
  if(option.title.toLowerCase().indexOf('(optional)') > -1){
    showOptional = false;
  }
  // Helptext & tooltip
  var helptextHtml = '', tooltipHtml = '';

  if(typeof option.helptext !== "undefined" && option.helptext){
    helptextHtml = `
      <p class="ygpo-option__helptext">${option.helptext}</p>
    `;
  }
  if(typeof option.tooltip !== "undefined" && option.tooltip){
    tooltipHtml = `
      <span class="ygpo-option__tooltip" data-tooltip="${option.tooltip}">
        <svg fill="#000000" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.536 29.536" xml:space="preserve"> <g> <path d="M14.768,0C6.611,0,0,6.609,0,14.768c0,8.155,6.611,14.767,14.768,14.767s14.768-6.612,14.768-14.767 C29.535,6.609,22.924,0,14.768,0z M14.768,27.126c-6.828,0-12.361-5.532-12.361-12.359c0-6.828,5.533-12.362,12.361-12.362 c6.826,0,12.359,5.535,12.359,12.362C27.127,21.594,21.594,27.126,14.768,27.126z"/> <path d="M14.385,19.337c-1.338,0-2.289,0.951-2.289,2.34c0,1.336,0.926,2.339,2.289,2.339c1.414,0,2.314-1.003,2.314-2.339 C16.672,20.288,15.771,19.337,14.385,19.337z"/> <path d="M14.742,6.092c-1.824,0-3.34,0.513-4.293,1.053l0.875,2.804c0.668-0.462,1.697-0.772,2.545-0.772 c1.285,0.027,1.879,0.644,1.879,1.543c0,0.85-0.67,1.697-1.494,2.701c-1.156,1.364-1.594,2.701-1.516,4.012l0.025,0.669h3.42 v-0.463c-0.025-1.158,0.387-2.162,1.311-3.215c0.979-1.08,2.211-2.366,2.211-4.321C19.705,7.968,18.139,6.092,14.742,6.092z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </svg>
      </span>
    `;
  }

  return `
    <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">

      <div class="ygpo-option__label">
        <span> ${option.title} ${tooltipHtml} </span>
        <span class="ygpo-option__label--required">${isRequired ? '*' : (showOptional ? '(Optional)' : '')}</span>
        <div class="ygpo-option__label--selected"></div>
      </div>
      ${helptextHtml}
      <div class="ygpo-option__value-container ygpo-swatch-master ygpo-swatch clearfix" data-option="${option.id}">
        ${option.values
        .slice(0, SWATCHES_THRESHOLD)
        .map(function (value, index) {
          var charge = 0;
         
          if(!!value.charge_value){
            if(value.charge_action === "fixed_charge"){
              charge = value.charge_value;
            }
            else{
               // charge = Number((variantPrice - ((variantPrice / 100) * vb.price)).toFixed(2));
            }
          }
          var minQty = 1;
          if(!!value.min_qty){
            minQty = value.min_qty;
          }


          if(YGPRODUCTOPTIONS.product._Core.chargeFoundInCart(option.id, value.id)) charge = 0;

          var id = `ygpo-swatch-${option.id}-${value.id}`;
          var name = `ygpo-option-${option.id}`;

          var style = '';
          if(value.swatch_color_type === "image"){
            style = `background-image: url(${value.swatch_color_image})`;
          }
          else if(value.swatch_color_type === "one"){
            style = `background-color: rgba(${value.color1_picker_rgb.r},${value.color1_picker_rgb.g},${value.color1_picker_rgb.b},${value.color1_picker_rgb.a})`;
          }
          else if(value.swatch_color_type === "two"){
            style = `background: linear-gradient( to top, rgb(${value.color2_picker_rgb}) 0%, rgb(${value.color2_picker_rgb}) 50%, rgb(${value.color1_picker_rgb}) 50%, rgb(${value.color1_picker_rgb}) 100% );`;
          }

          var title = `${value.title}${charge > 0 ? ` (+${YGPRODUCTOPTIONS.utils.formatMoney(charge).amount_with_symbol})` : ''}`;

          return `
            <div data-value="${value.title}" class="ygpo-swatch-element">

              <input id="${id}" type="radio" data-charge="${charge}" data-minQty="${minQty}" data-text="${value.title}" class="ygpo-option-element" name="${name}" value="${value.id}">
              <label for="${id}" style="background-color: #fff; ${style}">

              </label>

            </div>
          `;
        })
        .join("")}

        ${total_values > SWATCHES_THRESHOLD ?
        `
          <div class="ygpo-swatch-element-tmp"></div>
          <div class="ygpo-swatch-element ygpo-more">

              <label>
                <a href="#" onclick="YGPRODUCTOPTIONS.product._Core.showMoreOptions(event, ${option.id})">More</a>
              </label>

          </div>

        `
        :''}


      </div>

    </div>


    `;
};

var optionHTML_Radio = function (option){
    var isRequired = false;
    if(option.required){
        isRequired = true;
    }
    var showOptional = true;
    if(option.title.toLowerCase().indexOf('(optional)') > -1){
        showOptional = false;
    }
    // Helptext & tooltip
    var helptextHtml = '', tooltipHtml = '';

    if(typeof option.helptext !== "undefined" && option.helptext){
      helptextHtml = `
        <p class="ygpo-option__helptext">${option.helptext}</p>
      `;
    }
    if(typeof option.tooltip !== "undefined" && option.tooltip){
      tooltipHtml = `
        <span class="ygpo-option__tooltip" data-tooltip="${option.tooltip}">
          <svg fill="#000000" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.536 29.536" xml:space="preserve"> <g> <path d="M14.768,0C6.611,0,0,6.609,0,14.768c0,8.155,6.611,14.767,14.768,14.767s14.768-6.612,14.768-14.767 C29.535,6.609,22.924,0,14.768,0z M14.768,27.126c-6.828,0-12.361-5.532-12.361-12.359c0-6.828,5.533-12.362,12.361-12.362 c6.826,0,12.359,5.535,12.359,12.362C27.127,21.594,21.594,27.126,14.768,27.126z"/> <path d="M14.385,19.337c-1.338,0-2.289,0.951-2.289,2.34c0,1.336,0.926,2.339,2.289,2.339c1.414,0,2.314-1.003,2.314-2.339 C16.672,20.288,15.771,19.337,14.385,19.337z"/> <path d="M14.742,6.092c-1.824,0-3.34,0.513-4.293,1.053l0.875,2.804c0.668-0.462,1.697-0.772,2.545-0.772 c1.285,0.027,1.879,0.644,1.879,1.543c0,0.85-0.67,1.697-1.494,2.701c-1.156,1.364-1.594,2.701-1.516,4.012l0.025,0.669h3.42 v-0.463c-0.025-1.158,0.387-2.162,1.311-3.215c0.979-1.08,2.211-2.366,2.211-4.321C19.705,7.968,18.139,6.092,14.742,6.092z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </svg>
        </span>
      `;
    }
    return `
       <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">
            <div class="ygpo-option__label">
                <span> ${option.title} ${tooltipHtml} </span>
                <span class="ygpo-option__label--required">${isRequired ? '*' : (showOptional ? '(Optional)' : '')}</span>
            </div>
            ${helptextHtml}

            ${option.values
            .map(function (value) {
              var id = `ygpo-option-${option.id}-${value.id}`;
              var name = `ygpo-option-${option.id}`;


              var charge = 0;
              if(!!value.charge_value){
                if(value.charge_action === "fixed_charge"){
                  charge = value.charge_value;
                }
                else{
                   // charge = Number((variantPrice - ((variantPrice / 100) * vb.price)).toFixed(2));
                }
              }

              var minQty = 1;
              if(!!value.min_qty){
                minQty = value.min_qty;
              }

              if(YGPRODUCTOPTIONS.product._Core.chargeFoundInCart(option.id, value.id)) charge = 0;

              var title = `${value.title}${charge > 0 ? ` (+${YGPRODUCTOPTIONS.utils.formatMoney(charge).amount_with_symbol})` : ''}`;

              return `
                <div class="ygpo-custom-checkbox">
                  <input class="ygpo-option-element" data-minQty="${minQty}" data-charge="${charge}" data-text="${value.title}" id="${id}" type="radio" name="${name}" value="${value.id}">
                  <label for="${id}">${title}</label>
                </div>
              `
            }).join("")}

        </div>
    `;
}

var optionHTML_Button = function (option){
    var isRequired = false;
    if(option.required){
        isRequired = true;
    }
    var showOptional = true;
    if(option.title.toLowerCase().indexOf('(optional)') > -1){
        showOptional = false;
    }
    // Helptext & tooltip
    var helptextHtml = '', tooltipHtml = '';

    if(typeof option.helptext !== "undefined" && option.helptext){
      helptextHtml = `
        <p class="ygpo-option__helptext">${option.helptext}</p>
      `;
    }
    if(typeof option.tooltip !== "undefined" && option.tooltip){
      tooltipHtml = `
        <span class="ygpo-option__tooltip" data-tooltip="${option.tooltip}">
          <svg fill="#000000" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.536 29.536" xml:space="preserve"> <g> <path d="M14.768,0C6.611,0,0,6.609,0,14.768c0,8.155,6.611,14.767,14.768,14.767s14.768-6.612,14.768-14.767 C29.535,6.609,22.924,0,14.768,0z M14.768,27.126c-6.828,0-12.361-5.532-12.361-12.359c0-6.828,5.533-12.362,12.361-12.362 c6.826,0,12.359,5.535,12.359,12.362C27.127,21.594,21.594,27.126,14.768,27.126z"/> <path d="M14.385,19.337c-1.338,0-2.289,0.951-2.289,2.34c0,1.336,0.926,2.339,2.289,2.339c1.414,0,2.314-1.003,2.314-2.339 C16.672,20.288,15.771,19.337,14.385,19.337z"/> <path d="M14.742,6.092c-1.824,0-3.34,0.513-4.293,1.053l0.875,2.804c0.668-0.462,1.697-0.772,2.545-0.772 c1.285,0.027,1.879,0.644,1.879,1.543c0,0.85-0.67,1.697-1.494,2.701c-1.156,1.364-1.594,2.701-1.516,4.012l0.025,0.669h3.42 v-0.463c-0.025-1.158,0.387-2.162,1.311-3.215c0.979-1.08,2.211-2.366,2.211-4.321C19.705,7.968,18.139,6.092,14.742,6.092z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </svg>
        </span>
      `;
    }
    return `
        <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">
            <div class="ygpo-option__label">
                <span> ${option.title} ${tooltipHtml} </span>
                <span class="ygpo-option__label--required">${isRequired ? '*' : (showOptional ? '(Optional)' : '')}</span>
            </div>
            ${helptextHtml}

            <div class="ygpo-option__value-container ygpo-swatch-master ygpo-swatch clearfix ygpo-swatch-button" data-option="${option.id}">
              ${option.values
              .slice(0, SWATCHES_THRESHOLD)
              .map(function (value, index) {
                var charge = 0;
                if(!!value.charge_value){
                  if(value.charge_action === "fixed_charge"){
                    charge = value.charge_value;
                  }
                  else{
                     // charge = Number((variantPrice - ((variantPrice / 100) * vb.price)).toFixed(2));
                  }
                }
                var minQty = 1;
                if(!!value.min_qty){
                  minQty = value.min_qty;
                }

                if(YGPRODUCTOPTIONS.product._Core.chargeFoundInCart(option.id, value.id)) charge = 0;

                var id = `ygpo-swatch-${option.id}-${value.id}`;
                var name = `ygpo-option-${option.id}`;

                var title = `${value.title}${charge > 0 ? ` (+${YGPRODUCTOPTIONS.utils.formatMoney(charge).amount_with_symbol})` : ''}`;

                return `
                  <div data-value="${value.title}" class="ygpo-swatch-element">

                    <input id="${id}" type="radio" data-minQty="${minQty}" data-charge="${charge}" data-text="${value.title}" class="ygpo-option-element" name="${name}" value="${value.id}">
                    <label for="${id}" style="background-color: #fff;">
                        ${value.title}
                    </label>

                  </div>
                `;
              })
              .join("")}
            </div>

        </div>
    `;
}

var optionHTML_ColorImage = function (option){
    var isRequired = false;
    if(option.required){
        isRequired = true;
    }
    var showOptional = true;
    if(option.title.toLowerCase().indexOf('(optional)') > -1){
        showOptional = false;
    }
    // Helptext & tooltip
    var helptextHtml = '', tooltipHtml = '';

    if(typeof option.helptext !== "undefined" && option.helptext){
      helptextHtml = `
        <p class="ygpo-option__helptext">${option.helptext}</p>
      `;
    }
    if(typeof option.tooltip !== "undefined" && option.tooltip){
      tooltipHtml = `
        <span class="ygpo-option__tooltip" data-tooltip="${option.tooltip}">
          <svg fill="#000000" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.536 29.536" xml:space="preserve"> <g> <path d="M14.768,0C6.611,0,0,6.609,0,14.768c0,8.155,6.611,14.767,14.768,14.767s14.768-6.612,14.768-14.767 C29.535,6.609,22.924,0,14.768,0z M14.768,27.126c-6.828,0-12.361-5.532-12.361-12.359c0-6.828,5.533-12.362,12.361-12.362 c6.826,0,12.359,5.535,12.359,12.362C27.127,21.594,21.594,27.126,14.768,27.126z"/> <path d="M14.385,19.337c-1.338,0-2.289,0.951-2.289,2.34c0,1.336,0.926,2.339,2.289,2.339c1.414,0,2.314-1.003,2.314-2.339 C16.672,20.288,15.771,19.337,14.385,19.337z"/> <path d="M14.742,6.092c-1.824,0-3.34,0.513-4.293,1.053l0.875,2.804c0.668-0.462,1.697-0.772,2.545-0.772 c1.285,0.027,1.879,0.644,1.879,1.543c0,0.85-0.67,1.697-1.494,2.701c-1.156,1.364-1.594,2.701-1.516,4.012l0.025,0.669h3.42 v-0.463c-0.025-1.158,0.387-2.162,1.311-3.215c0.979-1.08,2.211-2.366,2.211-4.321C19.705,7.968,18.139,6.092,14.742,6.092z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </svg>
        </span>
      `;
    }
    return `
        <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">
            <div class="ygpo-option__label">
                <span> ${option.title} ${tooltipHtml} </span>
                <span class="ygpo-option__label--required">${isRequired ? '*' : (showOptional ? '(Optional)' : '')}</span>
            </div>
            ${helptextHtml}

            <select class="ygpo-option-element ygpo-color-dropdown" id="ygpo-color-dropdown-${option.id}" data-placeholder="Select ${option.title}">

              ${option.values
                .map(function (value) {
                  var charge = 0;
                  if(!!value.charge_value){
                    if(value.charge_action === "fixed_charge"){
                      charge = value.charge_value;
                    }
                    else{
                       // charge = Number((variantPrice - ((variantPrice / 100) * vb.price)).toFixed(2));
                    }
                  }

                  var minQty = 1;
                  if(!!value.min_qty){
                    minQty = value.min_qty;
                  }

                  if(YGPRODUCTOPTIONS.product._Core.chargeFoundInCart(option.id, value.id)) charge = 0;

                  var title = `${value.title}${charge > 0 ? ` (+${YGPRODUCTOPTIONS.utils.formatMoney(charge).amount_with_symbol})` : ''}`;
                  return `
                    <option data-text="${value.title}" data-minQty="${minQty}" data-charge="${charge}" value="${value.id}" ${value.swatch_color_type == "image" ? 'data-image="'+value.swatch_color_image+'"' : 'data-rgb="'+value.color1_picker_rgb+'"'}  >${title}</option>
                  `;
                })
                .join("")}

            </select>

        </div>
    `;
}

// --------

var optionHTML_SwatchesMultiple = function (option){
  option = JSON.parse(JSON.stringify(option));
  var total_values = option.values.length;
    var isRequired = false;
    if(option.required){
        isRequired = true;
    }
    var showOptional = true;
    if(option.title.toLowerCase().indexOf('(optional)') > -1){
        showOptional = false;
    }
    // Helptext & tooltip
    var helptextHtml = '', tooltipHtml = '';

    if(typeof option.helptext !== "undefined" && option.helptext){
      helptextHtml = `
        <p class="ygpo-option__helptext">${option.helptext}</p>
      `;
    }
    if(typeof option.tooltip !== "undefined" && option.tooltip){
      tooltipHtml = `
        <span class="ygpo-option__tooltip" data-tooltip="${option.tooltip}">
          <svg fill="#000000" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.536 29.536" xml:space="preserve"> <g> <path d="M14.768,0C6.611,0,0,6.609,0,14.768c0,8.155,6.611,14.767,14.768,14.767s14.768-6.612,14.768-14.767 C29.535,6.609,22.924,0,14.768,0z M14.768,27.126c-6.828,0-12.361-5.532-12.361-12.359c0-6.828,5.533-12.362,12.361-12.362 c6.826,0,12.359,5.535,12.359,12.362C27.127,21.594,21.594,27.126,14.768,27.126z"/> <path d="M14.385,19.337c-1.338,0-2.289,0.951-2.289,2.34c0,1.336,0.926,2.339,2.289,2.339c1.414,0,2.314-1.003,2.314-2.339 C16.672,20.288,15.771,19.337,14.385,19.337z"/> <path d="M14.742,6.092c-1.824,0-3.34,0.513-4.293,1.053l0.875,2.804c0.668-0.462,1.697-0.772,2.545-0.772 c1.285,0.027,1.879,0.644,1.879,1.543c0,0.85-0.67,1.697-1.494,2.701c-1.156,1.364-1.594,2.701-1.516,4.012l0.025,0.669h3.42 v-0.463c-0.025-1.158,0.387-2.162,1.311-3.215c0.979-1.08,2.211-2.366,2.211-4.321C19.705,7.968,18.139,6.092,14.742,6.092z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </svg>
        </span>
      `;
    }
    return `
    <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">

      <div class="ygpo-option__label">
        <span> ${option.title} ${tooltipHtml} </span>
        <span class="ygpo-option__label--required">${isRequired ? '*' : (showOptional ? '(Optional)' : '')}</span>
        <div class="ygpo-option__label--selected"></div>
      </div>
      ${helptextHtml}
      <div class="ygpo-option__value-container ygpo-swatch-master ygpo-swatch clearfix" data-option="${option.id}">
        ${option.values
        .slice(0, SWATCHES_THRESHOLD)
        .map(function (value, index) {
          var charge = 0;
          if(!!value.charge_value){
            if(value.charge_action === "fixed_charge"){
              charge = value.charge_value;
            }
            else{
               // charge = Number((variantPrice - ((variantPrice / 100) * vb.price)).toFixed(2));
            }
          }

          var minQty = 1;
          if(!!value.min_qty){
            minQty = value.min_qty;
          }

          if(YGPRODUCTOPTIONS.product._Core.chargeFoundInCart(option.id, value.id)) charge = 0;

          var id = `ygpo-swatch-${option.id}-${value.id}`;
          var name = `ygpo-option-${option.id}`;

          var style = '';
          if(value.swatch_color_type === "image"){
            style = `background-image: url(${value.swatch_color_image})`;
          }
          else if(value.swatch_color_type === "one"){
            style = `background-color: rgb(${value.color1_picker_rgb})`;
          }
          else if(value.swatch_color_type === "two"){
            style = `background: linear-gradient( to top, rgb(${value.color2_picker_rgb}) 0%, rgb(${value.color2_picker_rgb}) 50%, rgb(${value.color1_picker_rgb}) 50%, rgb(${value.color1_picker_rgb}) 100% );`;
          }

          var title = `${value.title}${charge > 0 ? ` (+${YGPRODUCTOPTIONS.utils.formatMoney(charge).amount_with_symbol})` : ''}`;

          return `
            <div data-value="${value.title}" class="ygpo-swatch-element">

              <input id="${id}" type="checkbox" data-minQty="${minQty}" data-charge="${charge}" data-text="${value.title}" class="ygpo-option-element" name="${name}" value="${value.id}">
              <label for="${id}" style="background-color: #fff; ${style}">

              </label>

            </div>
          `;
        })
        .join("")}

        ${total_values > SWATCHES_THRESHOLD ?
        `
          <div class="ygpo-swatch-element-tmp"></div>
          <div class="ygpo-swatch-element ygpo-more">

              <label>
                <a href="#" onclick="YGPRODUCTOPTIONS.product._Core.showMoreOptions(event, ${option.id})">More</a>
              </label>

          </div>

        `
        :''}


      </div>

    </div>


    `;
}

var optionHTML_DropdownMultiple = function (option){
    var isRequired = false;
    if(option.required){
        isRequired = true;
    }
    var showOptional = true;
    if(option.title.toLowerCase().indexOf('(optional)') > -1){
        showOptional = false;
    }
    // Helptext & tooltip
    var helptextHtml = '', tooltipHtml = '';

    if(typeof option.helptext !== "undefined" && option.helptext){
      helptextHtml = `
        <p class="ygpo-option__helptext">${option.helptext}</p>
      `;
    }
    if(typeof option.tooltip !== "undefined" && option.tooltip){
      tooltipHtml = `
        <span class="ygpo-option__tooltip" data-tooltip="${option.tooltip}">
          <svg fill="#000000" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.536 29.536" xml:space="preserve"> <g> <path d="M14.768,0C6.611,0,0,6.609,0,14.768c0,8.155,6.611,14.767,14.768,14.767s14.768-6.612,14.768-14.767 C29.535,6.609,22.924,0,14.768,0z M14.768,27.126c-6.828,0-12.361-5.532-12.361-12.359c0-6.828,5.533-12.362,12.361-12.362 c6.826,0,12.359,5.535,12.359,12.362C27.127,21.594,21.594,27.126,14.768,27.126z"/> <path d="M14.385,19.337c-1.338,0-2.289,0.951-2.289,2.34c0,1.336,0.926,2.339,2.289,2.339c1.414,0,2.314-1.003,2.314-2.339 C16.672,20.288,15.771,19.337,14.385,19.337z"/> <path d="M14.742,6.092c-1.824,0-3.34,0.513-4.293,1.053l0.875,2.804c0.668-0.462,1.697-0.772,2.545-0.772 c1.285,0.027,1.879,0.644,1.879,1.543c0,0.85-0.67,1.697-1.494,2.701c-1.156,1.364-1.594,2.701-1.516,4.012l0.025,0.669h3.42 v-0.463c-0.025-1.158,0.387-2.162,1.311-3.215c0.979-1.08,2.211-2.366,2.211-4.321C19.705,7.968,18.139,6.092,14.742,6.092z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </svg>
        </span>
      `;
    }
    return `
        <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">
            <div class="ygpo-option__label">
                <span> ${option.title} ${tooltipHtml} </span>
                <span class="ygpo-option__label--required">${isRequired ? '*' : (showOptional ? '(Optional)' : '')}</span>
            </div>
            ${helptextHtml}

            <select class="ygpo-option-element ygpo-selectbox" multiple ${typeof option.sizechart !== "undefined" && !!option.sizechart ? `data-showsizeguide=""` : ''} data-payload="option_id:${option.id}" data-placeholder="Select ${option.title}">

            ${option.values
              .map(function (value) {
                var charge = 0;
                if(!!value.charge_value){
                  if(value.charge_action === "fixed_charge"){
                    charge = value.charge_value;
                  }
                  else{
                     // charge = Number((variantPrice - ((variantPrice / 100) * vb.price)).toFixed(2));
                  }
                }
                var minQty = 1;
                if(!!value.min_qty){
                  minQty = value.min_qty;
                }

                if(YGPRODUCTOPTIONS.product._Core.chargeFoundInCart(option.id, value.id)) charge = 0;

                var title = `${value.title}${charge > 0 ? ` (+${YGPRODUCTOPTIONS.utils.formatMoney(charge).amount_with_symbol})` : ''}`;
                return `
                  <option data-text="${value.title}" data-minQty="${minQty}" data-charge="${charge}" value="${value.id}">${title}</option>
                `;
              })
              .join("")}

          </select>

      </div>
    `;
}

var optionHTML_Checkbox = function (option){
    var isRequired = false;
    if(option.required){
        isRequired = true;
    }
    var showOptional = true;
    if(option.title.toLowerCase().indexOf('(optional)') > -1){
        showOptional = false;
    }
    // Helptext & tooltip
    var helptextHtml = '', tooltipHtml = '';

    if(typeof option.helptext !== "undefined" && option.helptext){
      helptextHtml = `
        <p class="ygpo-option__helptext">${option.helptext}</p>
      `;
    }
    if(typeof option.tooltip !== "undefined" && option.tooltip){
      tooltipHtml = `
        <span class="ygpo-option__tooltip" data-tooltip="${option.tooltip}">
          <svg fill="#000000" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.536 29.536" xml:space="preserve"> <g> <path d="M14.768,0C6.611,0,0,6.609,0,14.768c0,8.155,6.611,14.767,14.768,14.767s14.768-6.612,14.768-14.767 C29.535,6.609,22.924,0,14.768,0z M14.768,27.126c-6.828,0-12.361-5.532-12.361-12.359c0-6.828,5.533-12.362,12.361-12.362 c6.826,0,12.359,5.535,12.359,12.362C27.127,21.594,21.594,27.126,14.768,27.126z"/> <path d="M14.385,19.337c-1.338,0-2.289,0.951-2.289,2.34c0,1.336,0.926,2.339,2.289,2.339c1.414,0,2.314-1.003,2.314-2.339 C16.672,20.288,15.771,19.337,14.385,19.337z"/> <path d="M14.742,6.092c-1.824,0-3.34,0.513-4.293,1.053l0.875,2.804c0.668-0.462,1.697-0.772,2.545-0.772 c1.285,0.027,1.879,0.644,1.879,1.543c0,0.85-0.67,1.697-1.494,2.701c-1.156,1.364-1.594,2.701-1.516,4.012l0.025,0.669h3.42 v-0.463c-0.025-1.158,0.387-2.162,1.311-3.215c0.979-1.08,2.211-2.366,2.211-4.321C19.705,7.968,18.139,6.092,14.742,6.092z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </svg>
        </span>
      `;
    }
    return `
        <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">
            <div class="ygpo-option__label">
                <span> ${option.title} ${tooltipHtml} </span>
                <span class="ygpo-option__label--required">${isRequired ? '*' : (showOptional ? '(Optional)' : '')}</span>
            </div>
            ${helptextHtml}


            ${option.values
            .map(function (value) {
              var id = `ygpo-option-${option.id}-${value.id}`;
              var name = `ygpo-option-${option.id}`;


              var charge = 0;
              if(!!value.charge_value){
                if(value.charge_action === "fixed_charge"){
                  charge = value.charge_value;
                }
                else{
                   // charge = Number((variantPrice - ((variantPrice / 100) * vb.price)).toFixed(2));
                }
              }

              var minQty = 1;
              if(!!value.min_qty){
                minQty = value.min_qty;
              }

              if(YGPRODUCTOPTIONS.product._Core.chargeFoundInCart(option.id, value.id)) charge = 0;

              var title = `${value.title}${charge > 0 ? ` (+${YGPRODUCTOPTIONS.utils.formatMoney(charge).amount_with_symbol})` : ''}`;

              return `
                <div class="ygpo-custom-checkbox">
                  <input class="ygpo-option-element" data-minQty="${minQty}" data-charge="${charge}" data-text="${value.title}" id="${id}" type="checkbox" name="${name}" value="${value.id}">
                  <label for="${id}">${title}</label>
                </div>
              `
            }).join("")}

        </div>
    `;
}

// --------

var optionHTML_ShortText = function (option){
    var isRequired = false;
    if(option.required){
        isRequired = true;
    }
    var showOptional = true;
    if(option.title.toLowerCase().indexOf('(optional)') > -1){
        showOptional = false;
    }
    // Helptext & tooltip
    var helptextHtml = '', tooltipHtml = '';

    if(typeof option.helptext !== "undefined" && option.helptext){
      helptextHtml = `
        <p class="ygpo-option__helptext">${option.helptext}</p>
      `;
    }
    if(typeof option.tooltip !== "undefined" && option.tooltip){
      tooltipHtml = `
        <span class="ygpo-option__tooltip" data-tooltip="${option.tooltip}">
          <svg fill="#000000" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.536 29.536" xml:space="preserve"> <g> <path d="M14.768,0C6.611,0,0,6.609,0,14.768c0,8.155,6.611,14.767,14.768,14.767s14.768-6.612,14.768-14.767 C29.535,6.609,22.924,0,14.768,0z M14.768,27.126c-6.828,0-12.361-5.532-12.361-12.359c0-6.828,5.533-12.362,12.361-12.362 c6.826,0,12.359,5.535,12.359,12.362C27.127,21.594,21.594,27.126,14.768,27.126z"/> <path d="M14.385,19.337c-1.338,0-2.289,0.951-2.289,2.34c0,1.336,0.926,2.339,2.289,2.339c1.414,0,2.314-1.003,2.314-2.339 C16.672,20.288,15.771,19.337,14.385,19.337z"/> <path d="M14.742,6.092c-1.824,0-3.34,0.513-4.293,1.053l0.875,2.804c0.668-0.462,1.697-0.772,2.545-0.772 c1.285,0.027,1.879,0.644,1.879,1.543c0,0.85-0.67,1.697-1.494,2.701c-1.156,1.364-1.594,2.701-1.516,4.012l0.025,0.669h3.42 v-0.463c-0.025-1.158,0.387-2.162,1.311-3.215c0.979-1.08,2.211-2.366,2.211-4.321C19.705,7.968,18.139,6.092,14.742,6.092z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </svg>
        </span>
      `;
    }
    return `
        <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">
            <div class="ygpo-option__label">
                <span> ${option.title} ${tooltipHtml} </span>
                <span class="ygpo-option__label--required">${isRequired ? '*' : (showOptional ? '(Optional)' : '')}</span>
            </div>
            ${helptextHtml}

            ${option.values
            .slice(0, 1) // Take 1 value only
            .map(function (value) {
              var id = `ygpo-option-${option.id}-${value.id}`;
              var name = `ygpo-option-${option.id}`;


              var charge = 0;
              if(!!value.charge_value){
                if(value.charge_action === "fixed_charge"){
                  charge = value.charge_value;
                }
                else{
                   // charge = Number((variantPrice - ((variantPrice / 100) * vb.price)).toFixed(2));
                }
              }

              var minQty = 1;
              if(!!value.min_qty){
                minQty = value.min_qty;
              }

              if(YGPRODUCTOPTIONS.product._Core.chargeFoundInCart(option.id, value.id)) charge = 0;

              var title = `${value.title}${charge > 0 ? ` (+${YGPRODUCTOPTIONS.utils.formatMoney(charge).amount_with_symbol})` : ''}`;

              return `
                <input data-value-id="${value.id}" data-minQty="${minQty}" class="ygpo-option-element" data-charge="${charge}" ${value.text_limit ? 'data-max="'+value.text_limit+'"' : ''} ${option.placeholder ? 'placeholder="'+option.placeholder+'"' : ''} id="${id}" type="text" name="${name}" />
              `
            }).join("")}

        </div>
    `;
}

var optionHTML_LongText = function (option){
    var isRequired = false;
    if(option.required){
        isRequired = true;
    }
    var showOptional = true;
    if(option.title.toLowerCase().indexOf('(optional)') > -1){
        showOptional = false;
    }
    // Helptext & tooltip
    var helptextHtml = '', tooltipHtml = '';

    if(typeof option.helptext !== "undefined" && option.helptext){
      helptextHtml = `
        <p class="ygpo-option__helptext">${option.helptext}</p>
      `;
    }
    if(typeof option.tooltip !== "undefined" && option.tooltip){
      tooltipHtml = `
        <span class="ygpo-option__tooltip" data-tooltip="${option.tooltip}">
          <svg fill="#000000" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.536 29.536" xml:space="preserve"> <g> <path d="M14.768,0C6.611,0,0,6.609,0,14.768c0,8.155,6.611,14.767,14.768,14.767s14.768-6.612,14.768-14.767 C29.535,6.609,22.924,0,14.768,0z M14.768,27.126c-6.828,0-12.361-5.532-12.361-12.359c0-6.828,5.533-12.362,12.361-12.362 c6.826,0,12.359,5.535,12.359,12.362C27.127,21.594,21.594,27.126,14.768,27.126z"/> <path d="M14.385,19.337c-1.338,0-2.289,0.951-2.289,2.34c0,1.336,0.926,2.339,2.289,2.339c1.414,0,2.314-1.003,2.314-2.339 C16.672,20.288,15.771,19.337,14.385,19.337z"/> <path d="M14.742,6.092c-1.824,0-3.34,0.513-4.293,1.053l0.875,2.804c0.668-0.462,1.697-0.772,2.545-0.772 c1.285,0.027,1.879,0.644,1.879,1.543c0,0.85-0.67,1.697-1.494,2.701c-1.156,1.364-1.594,2.701-1.516,4.012l0.025,0.669h3.42 v-0.463c-0.025-1.158,0.387-2.162,1.311-3.215c0.979-1.08,2.211-2.366,2.211-4.321C19.705,7.968,18.139,6.092,14.742,6.092z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </svg>
        </span>
      `;
    }
    return `
        <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">
            <div class="ygpo-option__label">
                <span> ${option.title} ${tooltipHtml} </span>
                <span class="ygpo-option__label--required">${isRequired ? '*' : (showOptional ? '(Optional)' : '')}</span>
            </div>
            ${helptextHtml}

            ${option.values
            .slice(0, 1) // Take 1 value only
            .map(function (value) {
              var id = `ygpo-option-${option.id}-${value.id}`;
              var name = `ygpo-option-${option.id}`;


              var charge = 0;
              if(!!value.charge_value){
                if(value.charge_action === "fixed_charge"){
                  charge = value.charge_value;
                }
                else{
                   // charge = Number((variantPrice - ((variantPrice / 100) * vb.price)).toFixed(2));
                }
              }

              var minQty = 1;
              if(!!value.min_qty){
                minQty = value.min_qty;
              }

              if(YGPRODUCTOPTIONS.product._Core.chargeFoundInCart(option.id, value.id)) charge = 0;

              var title = `${value.title}${charge > 0 ? ` (+${YGPRODUCTOPTIONS.utils.formatMoney(charge).amount_with_symbol})` : ''}`;

              return `
                <textarea data-value-id="${value.id}" rows="3" class="ygpo-option-element" data-minQty="${minQty}" data-charge="${charge}" ${value.text_limit ? 'data-max="'+value.text_limit+'"' : ''} ${option.placeholder ? 'placeholder="'+option.placeholder+'"' : ''} id="${id}" name="${name}"></textarea>
              `
            }).join("")}

        </div>
    `;
}

var optionHTML_Email = function (option){
    var isRequired = false;
    if(option.required){
        isRequired = true;
    }
    var showOptional = true;
    if(option.title.toLowerCase().indexOf('(optional)') > -1){
        showOptional = false;
    }
    // Helptext & tooltip
    var helptextHtml = '', tooltipHtml = '';

    if(typeof option.helptext !== "undefined" && option.helptext){
      helptextHtml = `
        <p class="ygpo-option__helptext">${option.helptext}</p>
      `;
    }
    if(typeof option.tooltip !== "undefined" && option.tooltip){
      tooltipHtml = `
        <span class="ygpo-option__tooltip" data-tooltip="${option.tooltip}">
          <svg fill="#000000" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.536 29.536" xml:space="preserve"> <g> <path d="M14.768,0C6.611,0,0,6.609,0,14.768c0,8.155,6.611,14.767,14.768,14.767s14.768-6.612,14.768-14.767 C29.535,6.609,22.924,0,14.768,0z M14.768,27.126c-6.828,0-12.361-5.532-12.361-12.359c0-6.828,5.533-12.362,12.361-12.362 c6.826,0,12.359,5.535,12.359,12.362C27.127,21.594,21.594,27.126,14.768,27.126z"/> <path d="M14.385,19.337c-1.338,0-2.289,0.951-2.289,2.34c0,1.336,0.926,2.339,2.289,2.339c1.414,0,2.314-1.003,2.314-2.339 C16.672,20.288,15.771,19.337,14.385,19.337z"/> <path d="M14.742,6.092c-1.824,0-3.34,0.513-4.293,1.053l0.875,2.804c0.668-0.462,1.697-0.772,2.545-0.772 c1.285,0.027,1.879,0.644,1.879,1.543c0,0.85-0.67,1.697-1.494,2.701c-1.156,1.364-1.594,2.701-1.516,4.012l0.025,0.669h3.42 v-0.463c-0.025-1.158,0.387-2.162,1.311-3.215c0.979-1.08,2.211-2.366,2.211-4.321C19.705,7.968,18.139,6.092,14.742,6.092z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </svg>
        </span>
      `;
    }
    return `
        <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">
            <div class="ygpo-option__label">
                <span> ${option.title} ${tooltipHtml} </span>
                <span class="ygpo-option__label--required">${isRequired ? '*' : (showOptional ? '(Optional)' : '')}</span>
            </div>
            ${helptextHtml}

            ${option.values
            .slice(0, 1) // Take 1 value only
            .map(function (value) {
              var id = `ygpo-option-${option.id}-${value.id}`;
              var name = `ygpo-option-${option.id}`;


              var charge = 0;
              if(!!value.charge_value){
                if(value.charge_action === "fixed_charge"){
                  charge = value.charge_value;
                }
                else{
                   // charge = Number((variantPrice - ((variantPrice / 100) * vb.price)).toFixed(2));
                }
              }
              var minQty = 1;
              if(!!value.min_qty){
                minQty = value.min_qty;
              }

              if(YGPRODUCTOPTIONS.product._Core.chargeFoundInCart(option.id, value.id)) charge = 0;

              var title = `${value.title}${charge > 0 ? ` (+${YGPRODUCTOPTIONS.utils.formatMoney(charge).amount_with_symbol})` : ''}`;

              return `
                <input data-value-id="${value.id}" class="ygpo-option-element" data-minQty="${minQty}" data-charge="${charge}" ${value.text_limit ? 'data-max="'+value.text_limit+'"' : ''} ${option.placeholder ? 'placeholder="'+option.placeholder+'"' : ''} id="${id}" type="email" name="${name}" />
              `
            }).join("")}

        </div>
    `;
}

var optionHTML_Phone = function (option){
    var isRequired = false;
    if(option.required){
        isRequired = true;
    }
    var showOptional = true;
    if(option.title.toLowerCase().indexOf('(optional)') > -1){
        showOptional = false;
    }
    // Helptext & tooltip
    var helptextHtml = '', tooltipHtml = '';

    if(typeof option.helptext !== "undefined" && option.helptext){
      helptextHtml = `
        <p class="ygpo-option__helptext">${option.helptext}</p>
      `;
    }
    if(typeof option.tooltip !== "undefined" && option.tooltip){
      tooltipHtml = `
        <span class="ygpo-option__tooltip" data-tooltip="${option.tooltip}">
          <svg fill="#000000" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.536 29.536" xml:space="preserve"> <g> <path d="M14.768,0C6.611,0,0,6.609,0,14.768c0,8.155,6.611,14.767,14.768,14.767s14.768-6.612,14.768-14.767 C29.535,6.609,22.924,0,14.768,0z M14.768,27.126c-6.828,0-12.361-5.532-12.361-12.359c0-6.828,5.533-12.362,12.361-12.362 c6.826,0,12.359,5.535,12.359,12.362C27.127,21.594,21.594,27.126,14.768,27.126z"/> <path d="M14.385,19.337c-1.338,0-2.289,0.951-2.289,2.34c0,1.336,0.926,2.339,2.289,2.339c1.414,0,2.314-1.003,2.314-2.339 C16.672,20.288,15.771,19.337,14.385,19.337z"/> <path d="M14.742,6.092c-1.824,0-3.34,0.513-4.293,1.053l0.875,2.804c0.668-0.462,1.697-0.772,2.545-0.772 c1.285,0.027,1.879,0.644,1.879,1.543c0,0.85-0.67,1.697-1.494,2.701c-1.156,1.364-1.594,2.701-1.516,4.012l0.025,0.669h3.42 v-0.463c-0.025-1.158,0.387-2.162,1.311-3.215c0.979-1.08,2.211-2.366,2.211-4.321C19.705,7.968,18.139,6.092,14.742,6.092z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </svg>
        </span>
      `;
    }
    return `
        <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">
            <div class="ygpo-option__label">
                <span> ${option.title} ${tooltipHtml} </span>
                <span class="ygpo-option__label--required">${isRequired ? '*' : (showOptional ? '(Optional)' : '')}</span>
            </div>
            ${helptextHtml}

            ${option.values
            .slice(0, 1) // Take 1 value only
            .map(function (value) {
              var id = `ygpo-option-${option.id}-${value.id}`;
              var name = `ygpo-option-${option.id}`;


              var charge = 0;
              if(!!value.charge_value){
                if(value.charge_action === "fixed_charge"){
                  charge = value.charge_value;
                }
                else{
                   // charge = Number((variantPrice - ((variantPrice / 100) * vb.price)).toFixed(2));
                }
              }

              var minQty = 1;
              if(!!value.min_qty){
                minQty = value.min_qty;
              }

              if(YGPRODUCTOPTIONS.product._Core.chargeFoundInCart(option.id, value.id)) charge = 0;

              var title = `${value.title}${charge > 0 ? ` (+${YGPRODUCTOPTIONS.utils.formatMoney(charge).amount_with_symbol})` : ''}`;

              return `
                <input data-value-id="${value.id}" class="ygpo-option-element" data-minQty="${minQty}"  data-charge="${charge}" ${value.text_limit ? 'data-max="'+value.text_limit+'"' : ''} ${option.placeholder ? 'placeholder="'+option.placeholder+'"' : ''} id="${id}" type="tel" name="${name}" />
              `
            }).join("")}

        </div>
    `;
}

var optionHTML_Hidden = function (option){
    var isRequired = false;
    if(option.required){
        isRequired = true;
    }
    var showOptional = true;
    if(option.title.toLowerCase().indexOf('(optional)') > -1){
        showOptional = false;
    }
    // Helptext & tooltip
    var helptextHtml = '', tooltipHtml = '';

    if(typeof option.helptext !== "undefined" && option.helptext){
      helptextHtml = `
        <p class="ygpo-option__helptext">${option.helptext}</p>
      `;
    }
    if(typeof option.tooltip !== "undefined" && option.tooltip){
      tooltipHtml = `
        <span class="ygpo-option__tooltip" data-tooltip="${option.tooltip}">
          <svg fill="#000000" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.536 29.536" xml:space="preserve"> <g> <path d="M14.768,0C6.611,0,0,6.609,0,14.768c0,8.155,6.611,14.767,14.768,14.767s14.768-6.612,14.768-14.767 C29.535,6.609,22.924,0,14.768,0z M14.768,27.126c-6.828,0-12.361-5.532-12.361-12.359c0-6.828,5.533-12.362,12.361-12.362 c6.826,0,12.359,5.535,12.359,12.362C27.127,21.594,21.594,27.126,14.768,27.126z"/> <path d="M14.385,19.337c-1.338,0-2.289,0.951-2.289,2.34c0,1.336,0.926,2.339,2.289,2.339c1.414,0,2.314-1.003,2.314-2.339 C16.672,20.288,15.771,19.337,14.385,19.337z"/> <path d="M14.742,6.092c-1.824,0-3.34,0.513-4.293,1.053l0.875,2.804c0.668-0.462,1.697-0.772,2.545-0.772 c1.285,0.027,1.879,0.644,1.879,1.543c0,0.85-0.67,1.697-1.494,2.701c-1.156,1.364-1.594,2.701-1.516,4.012l0.025,0.669h3.42 v-0.463c-0.025-1.158,0.387-2.162,1.311-3.215c0.979-1.08,2.211-2.366,2.211-4.321C19.705,7.968,18.139,6.092,14.742,6.092z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </svg>
        </span>
      `;
    }

    return `
        <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">
            <div class="ygpo-option__label">
                <span> ${option.title} ${tooltipHtml} </span>
                <span class="ygpo-option__label--required">${isRequired ? '*' : (showOptional ? '(Optional)' : '')}</span>
            </div>
            ${helptextHtml}

            ${option.values
            .slice(0, 1) // Take 1 value only
            .map(function (value) {
              var id = `ygpo-option-${option.id}-${value.id}`;
              var name = `ygpo-option-${option.id}`;

              return `
                <input data-value-id="${value.id}" class="ygpo-option-element" id="${id}" type="hidden" value=${value.title} name="${name}" />
              `
            }).join("")}

        </div>
    `;
}

var optionHTML_Number = function (option){
    var isRequired = false;
    if(option.required){
        isRequired = true;
    }
    var showOptional = true;
    if(option.title.toLowerCase().indexOf('(optional)') > -1){
        showOptional = false;
    }
    // Helptext & tooltip
    var helptextHtml = '', tooltipHtml = '';

    if(typeof option.helptext !== "undefined" && option.helptext){
      helptextHtml = `
        <p class="ygpo-option__helptext">${option.helptext}</p>
      `;
    }
    if(typeof option.tooltip !== "undefined" && option.tooltip){
      tooltipHtml = `
        <span class="ygpo-option__tooltip" data-tooltip="${option.tooltip}">
          <svg fill="#000000" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.536 29.536" xml:space="preserve"> <g> <path d="M14.768,0C6.611,0,0,6.609,0,14.768c0,8.155,6.611,14.767,14.768,14.767s14.768-6.612,14.768-14.767 C29.535,6.609,22.924,0,14.768,0z M14.768,27.126c-6.828,0-12.361-5.532-12.361-12.359c0-6.828,5.533-12.362,12.361-12.362 c6.826,0,12.359,5.535,12.359,12.362C27.127,21.594,21.594,27.126,14.768,27.126z"/> <path d="M14.385,19.337c-1.338,0-2.289,0.951-2.289,2.34c0,1.336,0.926,2.339,2.289,2.339c1.414,0,2.314-1.003,2.314-2.339 C16.672,20.288,15.771,19.337,14.385,19.337z"/> <path d="M14.742,6.092c-1.824,0-3.34,0.513-4.293,1.053l0.875,2.804c0.668-0.462,1.697-0.772,2.545-0.772 c1.285,0.027,1.879,0.644,1.879,1.543c0,0.85-0.67,1.697-1.494,2.701c-1.156,1.364-1.594,2.701-1.516,4.012l0.025,0.669h3.42 v-0.463c-0.025-1.158,0.387-2.162,1.311-3.215c0.979-1.08,2.211-2.366,2.211-4.321C19.705,7.968,18.139,6.092,14.742,6.092z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </svg>
        </span>
      `;
    }
    return `
        <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">
            <div class="ygpo-option__label">
                <span> ${option.title} ${tooltipHtml} </span>
                <span class="ygpo-option__label--required">${isRequired ? '*' : (showOptional ? '(Optional)' : '')}</span>
            </div>
            ${helptextHtml}

            ${option.values
            .slice(0, 1) // Take 1 value only
            .map(function (value) {
              var id = `ygpo-option-${option.id}-${value.id}`;
              var name = `ygpo-option-${option.id}`;


              var charge = 0;
              if(!!value.charge_value){
                if(value.charge_action === "fixed_charge"){
                  charge = value.charge_value;
                }
                else{
                   // charge = Number((variantPrice - ((variantPrice / 100) * vb.price)).toFixed(2));
                }
              }
              var minQty = 1;
              if(!!value.min_qty){
                minQty = value.min_qty;
              }
              
              if(YGPRODUCTOPTIONS.product._Core.chargeFoundInCart(option.id, value.id)) charge = 0;

              var title = `${value.title}${charge > 0 ? ` (+${YGPRODUCTOPTIONS.utils.formatMoney(charge).amount_with_symbol})` : ''}`;

              return `
                <input data-value-id="${value.id}" data-minQty="${minQty}" class="ygpo-option-element" data-charge="${charge}" ${value.text_limit ? 'data-max="'+value.text_limit+'"' : ''} ${option.placeholder ? 'placeholder="'+option.placeholder+'"' : ''} id="${id}" type="number" name="${name}" />
              `
            }).join("")}

        </div>
    `;
}

// --------

var optionHTML_File = function (option){
    var isRequired = false;
    if(option.required){
        isRequired = true;
    }
    var showOptional = true;
    if(option.title.toLowerCase().indexOf('(optional)') > -1){
        showOptional = false;
    }
    // Helptext & tooltip
    var helptextHtml = '', tooltipHtml = '';

    if(typeof option.helptext !== "undefined" && option.helptext){
      helptextHtml = `
        <p class="ygpo-option__helptext">${option.helptext}</p>
      `;
    }
    if(typeof option.tooltip !== "undefined" && option.tooltip){
      tooltipHtml = `
        <span class="ygpo-option__tooltip" data-tooltip="${option.tooltip}">
          <svg fill="#000000" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.536 29.536" xml:space="preserve"> <g> <path d="M14.768,0C6.611,0,0,6.609,0,14.768c0,8.155,6.611,14.767,14.768,14.767s14.768-6.612,14.768-14.767 C29.535,6.609,22.924,0,14.768,0z M14.768,27.126c-6.828,0-12.361-5.532-12.361-12.359c0-6.828,5.533-12.362,12.361-12.362 c6.826,0,12.359,5.535,12.359,12.362C27.127,21.594,21.594,27.126,14.768,27.126z"/> <path d="M14.385,19.337c-1.338,0-2.289,0.951-2.289,2.34c0,1.336,0.926,2.339,2.289,2.339c1.414,0,2.314-1.003,2.314-2.339 C16.672,20.288,15.771,19.337,14.385,19.337z"/> <path d="M14.742,6.092c-1.824,0-3.34,0.513-4.293,1.053l0.875,2.804c0.668-0.462,1.697-0.772,2.545-0.772 c1.285,0.027,1.879,0.644,1.879,1.543c0,0.85-0.67,1.697-1.494,2.701c-1.156,1.364-1.594,2.701-1.516,4.012l0.025,0.669h3.42 v-0.463c-0.025-1.158,0.387-2.162,1.311-3.215c0.979-1.08,2.211-2.366,2.211-4.321C19.705,7.968,18.139,6.092,14.742,6.092z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </svg>
        </span>
      `;
    }
    return `
        <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">
            <div class="ygpo-option__label">
                <span> ${option.title} ${tooltipHtml} </span>
                <span class="ygpo-option__label--required">${isRequired ? '*' : (showOptional ? '(Optional)' : '')}</span>
            </div>
            ${helptextHtml}

            ${option.values
            .slice(0, 1) // Take 1 value only
            .map(function (value) {
              var id = `ygpo-option-${option.id}-${value.id}`;

              return `
                <input data-value-id="${value.id}" data-self="1" id="${id}" type="file" name="properties[${option.title}]" class="ygpo_properties_input ygpo_properties_input_value" />
              `
            }).join("")}

        </div>
    `;
}

var optionHTML_DatePicker = function (option){
    var isRequired = false;
    if(option.required){
        isRequired = true;
    }
    var showOptional = true;
    if(option.title.toLowerCase().indexOf('(optional)') > -1){
        showOptional = false;
    }
    // Helptext & tooltip
    var helptextHtml = '', tooltipHtml = '';

    if(typeof option.helptext !== "undefined" && option.helptext){
      helptextHtml = `
        <p class="ygpo-option__helptext">${option.helptext}</p>
      `;
    }
    if(typeof option.tooltip !== "undefined" && option.tooltip){
      tooltipHtml = `
        <span class="ygpo-option__tooltip" data-tooltip="${option.tooltip}">
          <svg fill="#000000" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.536 29.536" xml:space="preserve"> <g> <path d="M14.768,0C6.611,0,0,6.609,0,14.768c0,8.155,6.611,14.767,14.768,14.767s14.768-6.612,14.768-14.767 C29.535,6.609,22.924,0,14.768,0z M14.768,27.126c-6.828,0-12.361-5.532-12.361-12.359c0-6.828,5.533-12.362,12.361-12.362 c6.826,0,12.359,5.535,12.359,12.362C27.127,21.594,21.594,27.126,14.768,27.126z"/> <path d="M14.385,19.337c-1.338,0-2.289,0.951-2.289,2.34c0,1.336,0.926,2.339,2.289,2.339c1.414,0,2.314-1.003,2.314-2.339 C16.672,20.288,15.771,19.337,14.385,19.337z"/> <path d="M14.742,6.092c-1.824,0-3.34,0.513-4.293,1.053l0.875,2.804c0.668-0.462,1.697-0.772,2.545-0.772 c1.285,0.027,1.879,0.644,1.879,1.543c0,0.85-0.67,1.697-1.494,2.701c-1.156,1.364-1.594,2.701-1.516,4.012l0.025,0.669h3.42 v-0.463c-0.025-1.158,0.387-2.162,1.311-3.215c0.979-1.08,2.211-2.366,2.211-4.321C19.705,7.968,18.139,6.092,14.742,6.092z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </svg>
        </span>
      `;
    }
    return `
        <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">
            <div class="ygpo-option__label">
                <span> ${option.title} ${tooltipHtml} </span>
                <span class="ygpo-option__label--required">${isRequired ? '*' : (showOptional ? '(Optional)' : '')}</span>
            </div>
            ${helptextHtml}

            ${option.values
            .slice(0, 1) // Take 1 value only
            .map(function (value) {
              var id = `ygpo-option-${option.id}-${value.id}`;
              var name = `ygpo-option-${option.id}`;


              var charge = 0;
              if(!!value.charge_value){
                if(value.charge_action === "fixed_charge"){
                  charge = value.charge_value;
                }
                else{
                   // charge = Number((variantPrice - ((variantPrice / 100) * vb.price)).toFixed(2));
                }
              }

              var minQty = 1;
              if(!!value.min_qty){
                minQty = value.min_qty;
              }

              if(YGPRODUCTOPTIONS.product._Core.chargeFoundInCart(option.id, value.id)) charge = 0;

              var title = `${value.title}${charge > 0 ? ` (+${YGPRODUCTOPTIONS.utils.formatMoney(charge).amount_with_symbol})` : ''}`;

              return `


                <input data-value-id="${value.id}" class="ygpo-option-element" data-minQty="${minQty}" data-charge="${charge}" id="${id}" type="date" name="${name}" />
              `
            }).join("")}

        </div>
    `;
}

var optionHTML_ColorPicker = function (option){
    var isRequired = false;
    if(option.required){
        isRequired = true;
    }
    var showOptional = true;
    if(option.title.toLowerCase().indexOf('(optional)') > -1){
        showOptional = false;
    }
    // Helptext & tooltip
    var helptextHtml = '', tooltipHtml = '';

    if(typeof option.helptext !== "undefined" && option.helptext){
      helptextHtml = `
        <p class="ygpo-option__helptext">${option.helptext}</p>
      `;
    }
    if(typeof option.tooltip !== "undefined" && option.tooltip){
      tooltipHtml = `
        <span class="ygpo-option__tooltip" data-tooltip="${option.tooltip}">
          <svg fill="#000000" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.536 29.536" xml:space="preserve"> <g> <path d="M14.768,0C6.611,0,0,6.609,0,14.768c0,8.155,6.611,14.767,14.768,14.767s14.768-6.612,14.768-14.767 C29.535,6.609,22.924,0,14.768,0z M14.768,27.126c-6.828,0-12.361-5.532-12.361-12.359c0-6.828,5.533-12.362,12.361-12.362 c6.826,0,12.359,5.535,12.359,12.362C27.127,21.594,21.594,27.126,14.768,27.126z"/> <path d="M14.385,19.337c-1.338,0-2.289,0.951-2.289,2.34c0,1.336,0.926,2.339,2.289,2.339c1.414,0,2.314-1.003,2.314-2.339 C16.672,20.288,15.771,19.337,14.385,19.337z"/> <path d="M14.742,6.092c-1.824,0-3.34,0.513-4.293,1.053l0.875,2.804c0.668-0.462,1.697-0.772,2.545-0.772 c1.285,0.027,1.879,0.644,1.879,1.543c0,0.85-0.67,1.697-1.494,2.701c-1.156,1.364-1.594,2.701-1.516,4.012l0.025,0.669h3.42 v-0.463c-0.025-1.158,0.387-2.162,1.311-3.215c0.979-1.08,2.211-2.366,2.211-4.321C19.705,7.968,18.139,6.092,14.742,6.092z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </svg>
        </span>
      `;
    }
    return `
        <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">
            <div class="ygpo-option__label">
                <span> ${option.title} ${tooltipHtml} </span>
                <span class="ygpo-option__label--required">${isRequired ? '*' : (showOptional ? '(Optional)' : '')}</span>
            </div>
            ${helptextHtml}

            ${option.values
            .slice(0, 1) // Take 1 value only
            .map(function (value) {
              var id = `ygpo-option-${option.id}-${value.id}`;
              var name = `ygpo-option-${option.id}`;


              var charge = 0;
              if(!!value.charge_value){
                if(value.charge_action === "fixed_charge"){
                  charge = value.charge_value;
                }
                else{
                   // charge = Number((variantPrice - ((variantPrice / 100) * vb.price)).toFixed(2));
                }
              }

              var minQty = 1;
              if(!!value.min_qty){
                minQty = value.min_qty;
              }

              if(YGPRODUCTOPTIONS.product._Core.chargeFoundInCart(option.id, value.id)) charge = 0;

              var title = `${value.title}${charge > 0 ? ` (+${YGPRODUCTOPTIONS.utils.formatMoney(charge).amount_with_symbol})` : ''}`;

              return `


                <input data-value-id="${value.id}" class="ygpo-option-element" data-minQty="${minQty}" data-charge="${charge}" id="${id}" type="color" value="#ff0000" name="${name}" />
              `
            }).join("")}

        </div>
    `;
}

var optionHTML_Popup = function (option){
    var isRequired = false;
    if(option.required){
        isRequired = true;
    }
    var showOptional = true;
    if(option.title.toLowerCase().indexOf('(optional)') > -1){
        showOptional = false;
    }

    // Helptext & tooltip
    var helptextHtml = '', tooltipHtml = '';

    if(typeof option.helptext !== "undefined" && option.helptext){
      helptextHtml = `
        <p class="ygpo-option__helptext">${option.helptext}</p>
      `;
    }
    if(typeof option.tooltip !== "undefined" && option.tooltip){
      tooltipHtml = `
        <span class="ygpo-option__tooltip" data-tooltip="${option.tooltip}">
          <svg fill="#000000" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.536 29.536" xml:space="preserve"> <g> <path d="M14.768,0C6.611,0,0,6.609,0,14.768c0,8.155,6.611,14.767,14.768,14.767s14.768-6.612,14.768-14.767 C29.535,6.609,22.924,0,14.768,0z M14.768,27.126c-6.828,0-12.361-5.532-12.361-12.359c0-6.828,5.533-12.362,12.361-12.362 c6.826,0,12.359,5.535,12.359,12.362C27.127,21.594,21.594,27.126,14.768,27.126z"/> <path d="M14.385,19.337c-1.338,0-2.289,0.951-2.289,2.34c0,1.336,0.926,2.339,2.289,2.339c1.414,0,2.314-1.003,2.314-2.339 C16.672,20.288,15.771,19.337,14.385,19.337z"/> <path d="M14.742,6.092c-1.824,0-3.34,0.513-4.293,1.053l0.875,2.804c0.668-0.462,1.697-0.772,2.545-0.772 c1.285,0.027,1.879,0.644,1.879,1.543c0,0.85-0.67,1.697-1.494,2.701c-1.156,1.364-1.594,2.701-1.516,4.012l0.025,0.669h3.42 v-0.463c-0.025-1.158,0.387-2.162,1.311-3.215c0.979-1.08,2.211-2.366,2.211-4.321C19.705,7.968,18.139,6.092,14.742,6.092z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </svg>
        </span>
      `;
    }

    return `
        <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">
            <div class="ygpo-option__label">
                <span> ${option.title} ${tooltipHtml} </span>
                <span class="ygpo-option__label--required">${isRequired ? '*' : (showOptional ? '(Optional)' : '')}</span>
            </div>
            ${helptextHtml}

            ${option.values
            .slice(0, 1) // Take 1 value only
            .map(function (value) {
              var id = `ygpo-option-${option.id}-${value.id}`;

              return `
                <div class="ygpo-popup-container">
                  ${value.popup_icon_image ? `<img src="${value.popup_icon_image}" style="width:24px" />` : ''}

                  <label>
                    <a href="#" onclick="YGPRODUCTOPTIONS.product._Core.openPopup(event, this)">${value.popup_link_text}</a>
                  </label>

                  <div id="ygpo-swatch-modal-${option.id}" class="ygpo-modal" data-remove="0">
                      <div class="ygpo-modal-body">

                          <button onclick="YGPRODUCTOPTIONS.product._Core.closeModal()" class="ygpo-modal-btnclose">

                              <span class="hidden md:inline-block">Close</span>
                              <svg  width="15" height="15" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" ><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" class=""></path></svg>

                          </button>


                          <div class="ygpo-modal-centerbody">
                          ${value.popup_description}
                          </div>


                      </div>
                  </div>

                </div>

              `
            }).join("")}

        </div>
    `;
}

var optionHTML_Information = function (option){
    var isRequired = false;
    if(option.required){
        isRequired = true;
    }
    var showOptional = true;
    if(option.title.toLowerCase().indexOf('(optional)') > -1){
        showOptional = false;
    }
    return `
        <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">


            ${option.values
            .slice(0, 1) // Take 1 value only
            .map(function (value) {
              var id = `ygpo-option-${option.id}-${value.id}`;

              return `
                ${value.popup_description}
              `
            }).join("")}

        </div>
    `;
}

var optionHTML_TimePicker = function (option){
    var isRequired = false;
    if(option.required){
        isRequired = true;
    }
    var showOptional = true;
    if(option.title.toLowerCase().indexOf('(optional)') > -1){
        showOptional = false;
    }
    // Helptext & tooltip
    var helptextHtml = '', tooltipHtml = '';

    if(typeof option.helptext !== "undefined" && option.helptext){
      helptextHtml = `
        <p class="ygpo-option__helptext">${option.helptext}</p>
      `;
    }
    if(typeof option.tooltip !== "undefined" && option.tooltip){
      tooltipHtml = `
        <span class="ygpo-option__tooltip" data-tooltip="${option.tooltip}">
          <svg fill="#000000" height="12" width="12" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.536 29.536" xml:space="preserve"> <g> <path d="M14.768,0C6.611,0,0,6.609,0,14.768c0,8.155,6.611,14.767,14.768,14.767s14.768-6.612,14.768-14.767 C29.535,6.609,22.924,0,14.768,0z M14.768,27.126c-6.828,0-12.361-5.532-12.361-12.359c0-6.828,5.533-12.362,12.361-12.362 c6.826,0,12.359,5.535,12.359,12.362C27.127,21.594,21.594,27.126,14.768,27.126z"/> <path d="M14.385,19.337c-1.338,0-2.289,0.951-2.289,2.34c0,1.336,0.926,2.339,2.289,2.339c1.414,0,2.314-1.003,2.314-2.339 C16.672,20.288,15.771,19.337,14.385,19.337z"/> <path d="M14.742,6.092c-1.824,0-3.34,0.513-4.293,1.053l0.875,2.804c0.668-0.462,1.697-0.772,2.545-0.772 c1.285,0.027,1.879,0.644,1.879,1.543c0,0.85-0.67,1.697-1.494,2.701c-1.156,1.364-1.594,2.701-1.516,4.012l0.025,0.669h3.42 v-0.463c-0.025-1.158,0.387-2.162,1.311-3.215c0.979-1.08,2.211-2.366,2.211-4.321C19.705,7.968,18.139,6.092,14.742,6.092z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </svg>
        </span>
      `;
    }
    return `
        <div class="ygpo-option__container" data-option-id="${option.id}" data-option-title="${option.title}">
            <div class="ygpo-option__label">
                <span> ${option.title} ${tooltipHtml} </span>
                <span class="ygpo-option__label--required">${isRequired ? '*' : (showOptional ? '(Optional)' : '')}</span>
            </div>
            ${helptextHtml}

            ${option.values
            .slice(0, 1) // Take 1 value only
            .map(function (value) {
              var id = `ygpo-option-${option.id}-${value.id}`;
              var name = `ygpo-option-${option.id}`;


              var charge = 0;
              if(!!value.charge_value){
                if(value.charge_action === "fixed_charge"){
                  charge = value.charge_value;
                }
                else{
                   // charge = Number((variantPrice - ((variantPrice / 100) * vb.price)).toFixed(2));
                }
              }

              var minQty = 1;
              if(!!value.min_qty){
                minQty = value.min_qty;
              }

              if(YGPRODUCTOPTIONS.product._Core.chargeFoundInCart(option.id, value.id)) charge = 0;

              var title = `${value.title}${charge > 0 ? ` (+${YGPRODUCTOPTIONS.utils.formatMoney(charge).amount_with_symbol})` : ''}`;

              return `


                <input data-value-id="${value.id}" class="ygpo-option-element" data-minQty="${minQty}" data-charge="${charge}" id="${id}" type="time" name="${name}" />
              `
            }).join("")}

        </div>
    `;
}



var ALGO_SELECBOX = function () {
  // ----------------------------
  // Variables (Change at ease)
  // ----------------------------

  var SELECTOR = ".ygpo-selectbox";
  window.ALGO_COUNT = window.ALGO_COUNT || 0;
  var CLASS_PREFIX = "alg";


  function resizeElementHeight(element) {
    var height = 0;
    var body = window.document.body;
    if (window.innerHeight) {
        height = window.innerHeight;
    } else if (body.parentElement.clientHeight) {
        height = body.parentElement.clientHeight;
    } else if (body && body.clientHeight) {
        height = body.clientHeight;
    }
    element.style.height = ((height - element.getBoundingClientRect().top - 0) + "px");
  }

  // Event Listerner
  var EVENT_SELECTBOX_CLICK = function (e) {
    e.preventDefault();

    var el = e.currentTarget;


    if (e.target.closest("."+CLASS_PREFIX+"-sizeguide")) {
      if(el.hasAttribute('data-payload')){
        var o = {};
        var dataPayload = el.getAttribute('data-payload')
        .split('|')
        .forEach(function(x){
            var s = x.split(':');
            o[s[0]] = s[1];
        });
        const event = new CustomEvent(CLASS_PREFIX+"-sizeguide", { detail: o });
        document.dispatchEvent(event);
      }

      return;
    }
    if (e.target.closest("li.disabled")) return;

    this.classList.toggle("is-active");
    document.body.classList.toggle(CLASS_PREFIX + "-overlay-active");

    if( this.classList.contains('is-active')){
      var listContainer = el.querySelector('.alg-list__container');
      if(listContainer){
        resizeElementHeight(listContainer);
      }
    }
  };
  var EVENT_OPTION_CLICK = function (e) {
    e.preventDefault();


    var el = e.currentTarget;
    var text = el.textContent;
    var value = el.getAttribute("data-value");

    var container = this.closest(`.${CLASS_PREFIX}-wrapper`);
    var span = container.querySelector(`.${CLASS_PREFIX}-placeholder`);
    var selectId = container.getAttribute("id");
    var selectEl = document.querySelector('[data-linker="' + selectId + '"]');

    var opEl = selectEl.querySelector('option[value="'+value+'"]');
    opEl.selected = !opEl.selected;

    var selectedOps = Array.from(selectEl.selectedOptions);
    var selectText = selectedOps.map(option => option.textContent);


    span.innerHTML = selectText.length > 0 ? selectText.join(', ') : span.getAttribute('data-text');

    container.querySelectorAll("ul li a").forEach(function (liEl) {
      liEl.classList.remove("active");
    });

    selectedOps.forEach(function(oEl){
        var v = oEl.value;
        var tEl = container.querySelector("ul li a[data-value='"+v+"']");
        if(tEl) tEl.classList.add("active");

        console.log(v);
    });

    selectEl.trigger('change');
  };

  var EVENT_SELECT_CHANGE = function(e){

    var selectedOps = Array.from(this.selectedOptions);
      if(selectedOps.length === 0){

          var container = this.nextElementSibling;
            var span = container.querySelector(`.${CLASS_PREFIX}-placeholder`);

        span.innerHTML = this.getAttribute('data-placeholder');

        container.querySelectorAll("ul li a").forEach(function (liEl) {
          liEl.classList.remove("active");
        });
      }
  }
  // ------------------------
  //    Start Appending UI
  // ------------------------

  var els = document.querySelectorAll(SELECTOR);
  if (els.length > 0) {
    document.querySelectorAll(SELECTOR).forEach(function (el) {
      // Skip if empty select
      if (el.options.length == 0) return;
      // Skip if already done
      if (el.classList.contains(CLASS_PREFIX + "--initialized")) return;

      var placeholder = "Select an option";
      if (el.hasAttribute("data-placeholder")) {
        placeholder = el.getAttribute("data-placeholder");
      }


      var payload = "";
      if (el.hasAttribute("data-payload")) {
        payload = `data-payload="${el.getAttribute("data-payload")}"`;
      }

      var optionsHtml = "";

      for (var i = 0; i < el.options.length; i++) {
        var op = el.options.item(i);
        optionsHtml += `<li ${
          op.disabled ? 'class="disabled"' : ""
        }><a data-value="${op.value}" href="#">${op.innerHTML}</a></li>`;
      }

      var id = `alg-selectbox-${window.ALGO_COUNT++}`;

      var html = `

        <div id="${id}" class="${CLASS_PREFIX}-wrapper" ${payload} tabindex="1">
            <div class="${CLASS_PREFIX}-overlay"></div>

            <div class="${CLASS_PREFIX}-dropdown">
              <span class="${CLASS_PREFIX}-placeholder" data-text="${placeholder}">${placeholder}</span>

              <div class="${CLASS_PREFIX}-list__container">


            <div class="${CLASS_PREFIX}-upper">
                <button type="button" class="${CLASS_PREFIX}-sizeguide ${!el.hasAttribute("data-showsizeguide") ? `${CLASS_PREFIX}-sizeguide--hide` : '' }">
                    <svg height="16" width="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" focusable="false"><path d="M24,8 L24,17 L-1.8189894e-12,17 L-1.8189894e-12,8 L24,8 Z M22,11 L21,11 L21,9 L19,9 L19,13 L18,13 L18,9 L16,9 L16,11 L15,11 L15,9 L13,9 L13,13 L12,13 L12,9 L10,9 L10,11 L9,11 L9,9 L7,9 L7,13 L6,13 L6,9 L4,9 L4,11 L3,11 L3,9 L1,9 L1,16 L23,16 L23,9 L22,9 L22,11 Z" transform="translate(12.000000, 12.500000) rotate(-45.000000) translate(-12.000000, -12.500000) "></path></svg>
                    <span>Size Guide</span>
                  </button>

                <button type="button" class="${CLASS_PREFIX}-close"></button>
            </div>
              <ul class="${CLASS_PREFIX}-list">
                ${optionsHtml}
              </ul>
              </div>
            </div>
        </div>

        `;

      el.insertAdjacentHTML("afterend", html);

      // Hide EL
      el.style.display = "none";
      el.classList.add(`${CLASS_PREFIX}--initialized`);
      el.setAttribute("data-linker", id);

      var selectEl = document.getElementById(id);

      if (selectEl) {
        selectEl.addEventListener("click", EVENT_SELECTBOX_CLICK, false);

        var links = selectEl.querySelectorAll("ul li:not(.disabled) a");

        links.forEach(function (element) {
          element.addEventListener("click", EVENT_OPTION_CLICK, false);
        });
      }

      el.addEventListener('custom_change', EVENT_SELECT_CHANGE, false);
    });
  }
};

function createSelect() {
  var select = document.querySelectorAll("select.ygpo-color-dropdown"),
    liElement,
    ulElement,
    optionValue,
    iElement,
    optionText,
    selectDropdown,
    elementParentSpan;

  for (var select_i = 0, len = select.length; select_i < len; select_i++) {
      if(select[select_i].classList.contains('select-dropdown__button--initialized')) continue;

    select[select_i].style.display = "none";
    wrapElement(
      document.getElementById(select[select_i].id),
      document.createElement("div"),
      select_i,
      select[select_i].getAttribute("data-placeholder")
    );

    for (var i = 0; i < select[select_i].options.length; i++) {
      var opEl = select[select_i].options[i];
      liElement = document.createElement("li");
      optionValue = opEl.value;
      optionText = document.createTextNode(opEl.text);
      liElement.className = "select-dropdown__list-item";
      liElement.setAttribute("data-value", optionValue);

      if (opEl.hasAttribute("data-image")) {
        var divElement = document.createElement("div");
        divElement.className = "select-dropdown__list-item-content";
        divElement.innerHTML =
          '<img src="' +
          opEl.getAttribute("data-image") +
          '" />' +
          "<span>" +
          opEl.text +
          "</span>";

        optionText = divElement;
      }
      else if (opEl.hasAttribute("data-rgb")) {
        var divElement = document.createElement("div");
        divElement.className = "select-dropdown__list-item-content";
        divElement.innerHTML =
          '<div class="select-dropdown__list-item-content-rgb" style="background-color:rgb('+opEl.getAttribute("data-rgb")+')"></div>' +
          "<span>" +
          opEl.text +
          "</span>";

        optionText = divElement;
      }

      liElement.appendChild(optionText);
      ulElement.appendChild(liElement);

      liElement.addEventListener(
        "click",
        function (e) {
          displyUl(this, e);
        },
        false
      );

    }
      select[select_i].classList.add('select-dropdown__button--initialized');
      select[select_i].addEventListener('custom_change', function(e){ON_SELECT_CHANGE(this);}, false);
  }
  function ON_SELECT_CHANGE(el){

    var selectedOps = Array.from(el.selectedOptions);
      if(selectedOps.length === 0){

        var container = el.nextElementSibling;
        var span = container.querySelector(`span`);
        span.innerHTML = el.getAttribute('data-placeholder');

      }
  }

  function wrapElement(el, wrapper, i, placeholder) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);

    document.addEventListener("click", function (e) {
      let clickInside = wrapper.contains(e.target);
      if (!clickInside) {
        let menu = wrapper.getElementsByClassName("select-dropdown__list");
        menu[0].classList.remove("active");
      }
    });

    var buttonElement = document.createElement("button"),
      spanElement = document.createElement("span"),
      spanText = document.createTextNode(placeholder);
    iElement = document.createElement("i");
    ulElement = document.createElement("ul");

    wrapper.className = "select-dropdown select-dropdown--" + i;
    buttonElement.className =
      "select-dropdown__button select-dropdown__button--" + i;
    buttonElement.setAttribute("data-value", "");
    buttonElement.setAttribute("type", "button");

    spanElement.className = "select-dropdown select-dropdown--" + i;
    iElement.className = "zmdi zmdi-chevron-down";
    ulElement.className = "select-dropdown__list select-dropdown__list--" + i;
    ulElement.id = "select-dropdown__list-" + i;

    wrapper.appendChild(buttonElement);
    spanElement.appendChild(spanText);
    buttonElement.appendChild(spanElement);
    buttonElement.appendChild(iElement);
    wrapper.appendChild(ulElement);
  }

  function displyUl(element, event) {
    if (element.tagName == "BUTTON") {
      selectDropdown = element.parentNode.getElementsByTagName("ul");
      //var labelWrapper = document.getElementsByClassName('js-label-wrapper');
      for (var i = 0, len = selectDropdown.length; i < len; i++) {
        selectDropdown[i].classList.toggle("active");
        //var parentNode = $(selectDropdown[i]).closest('.js-label-wrapper');
        //parentNode[0].classList.toggle("active");
      }
    } else if (element.tagName == "LI") {
      var selectId = element.parentNode.parentNode.getElementsByTagName(
        "select"
      )[0];
      selectElement(selectId.id, element.getAttribute("data-value"));
      elementParentSpan = element.parentNode.parentNode.getElementsByTagName(
        "span"
      );
        if(!event || !event.detail || event.detail !== 'noshow'){

          element.parentNode.classList.toggle("active");
        }
      elementParentSpan[0].innerHTML = element.innerHTML;
      elementParentSpan[0].parentNode.setAttribute(
        "data-value",
        element.getAttribute("data-value")
      );
    }
  }
  function selectElement(id, valueToSelect) {
    var element = document.getElementById(id);
    element.value = valueToSelect;
    element.setAttribute("selected", "selected");
    element.trigger('change');
  }
  var buttonSelect = document.getElementsByClassName("select-dropdown__button");
  for (var i = 0, len = buttonSelect.length; i < len; i++) {
    if(buttonSelect[i].classList.contains('select-dropdown__button--initialized')) continue;
    buttonSelect[i].addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        displyUl(this, e);
      },
      false
    );
    buttonSelect[i].classList.add('select-dropdown__button--initialized');
  }
}

var YGPO_TABS_ADJUSTED = false;
var adjustTabs = function(){
  var modal = document.querySelector('.ygpo-modal.ygpo--open');
  if(!modal) return;

  var tabEl = modal.querySelector('.ygpo-tabset')
  if(!tabEl)return;


    if(YGPO_TABS_ADJUSTED) return;
  if(window.outerWidth < 767){
      var contentEl = modal.querySelector('.ygpo-modal-centerbody');
      if(contentEl){
          contentEl.prepend(tabEl);
      }

  }
  else{

      var contentEl = modal.querySelector('.ygpo-modal-leftbody');
      if(contentEl){
          contentEl.append(tabEl);
      }

  }

    YGPO_TABS_ADJUSTED = true;
}



// --------------------------------------------------
//    WINDOW LOAD EVENT (TRIGGER EVENTS HERE)
// --------------------------------------------------

!function(a,b,c){var f,d=0,e=["ms","moz","webkit","o"];for(f=0;f<e.length&&!a[b];++f)a[b]=a[e[f]+"RequestAnimationFrame"],a[c]=a[e[f]+"CancelAnimationFrame"]||a[e[f]+"CancelRequestAnimationFrame"];a[b]||(a[b]=function(b){var c=(new Date).getTime(),e=Math.max(0,16-(c-d)),f=a.setTimeout(function(){b(c+e)},e);return d=c+e,f}),a[c]||(a[c]=function(b){a.clearTimeout(b)})}(this,"requestAnimationFrame","cancelAnimationFrame");


var ready = function () {
  // If the body element exists
  var oSelector = YGPRODUCTOPTIONS.product._Core.getSelector(
    YGPRODUCTOPTIONS.product.selectors.option
  );

  if (document.body && document.querySelector(oSelector.name)) {

    // Init code here
    YGPRODUCTOPTIONS.product._Core.renderOptions();



    window.addEventListener("resize", function() {
      adjustTabs();
    });


    // Return so that we don't call requestAnimationFrame() again
    return;
  }

  // If the body element isn't found, run ready() again at the next pain
  window.requestAnimationFrame(ready);
};

// Initialize our ready() function
window.requestAnimationFrame(ready);
