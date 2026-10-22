/* ========================================================
   iCakes Cart 2 Interactive Engine — script/cart2.js
======================================================== */

$(document).ready(function () {
  
  let basePrice = 102.00;
  let itemQty = 1;
  let addedTreats = {};

  // 1. Calculate & Render Summary
  function updateOrderSummary() {
    let mainItemTotal = basePrice * itemQty;
    let treatsTotal = 0;
    let treatsHtml = '';

    $.each(addedTreats, function (id, treat) {
      treatsTotal += treat.price;
      treatsHtml += `<div class="cart2-treat-line">
        <span>+ ${treat.name}</span>
        <span>$${treat.price.toFixed(2)}</span>
      </div>`;
    });

    let subtotal = mainItemTotal + treatsTotal;
    let grandTotal = subtotal;

    $('#mainItemTotalDisplay').text('$' + mainItemTotal.toFixed(2));
    $('#subtotalDisplay').text('$' + subtotal.toFixed(2));
    $('#totalDisplay').text('$' + grandTotal.toFixed(2));
    $('#addedTreatsContainer').html(treatsHtml);

    if (Object.keys(addedTreats).length > 0) {
      $('#addedTreatsNote').show();
    } else {
      $('#addedTreatsNote').hide();
    }
  }

  // 2. Quantity Stepper Controls
  $('#btnQtyDec').on('click', function () {
    if (itemQty > 1) {
      itemQty--;
      $('#cartQtyInput').val(itemQty);
      updateOrderSummary();
    }
  });

  $('#btnQtyInc').on('click', function () {
    itemQty++;
    $('#cartQtyInput').val(itemQty);
    updateOrderSummary();
  });

  $('#cartQtyInput').on('change input', function () {
    let val = parseInt($(this).val(), 10);
    if (isNaN(val) || val < 1) val = 1;
    itemQty = val;
    $(this).val(itemQty);
    updateOrderSummary();
  });

  // 3. Remove Main Item
  $('#btnRemoveMainItem').on('click', function () {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      $('#mainItemRow').fadeOut(300, function () {
        $(this).remove();
        basePrice = 0;
        updateOrderSummary();
      });
    }
  });

  // 4. ADD+ Button Handler for Treats Grid
  $('.cart2-addon-btn').on('click', function () {
    const $btn = $(this);
    const treatId = $btn.data('id');
    const treatName = $btn.data('name');
    const treatPrice = parseFloat($btn.data('price')) || 0;
    const hasCriteria = $btn.data('criteria');

    if ($btn.hasClass('added')) {
      delete addedTreats[treatId];
      $btn.removeClass('added').text('ADD+');
      updateOrderSummary();
    } else {
      if (hasCriteria) {
        openCriteriaModal(treatId, treatName, treatPrice, $btn);
      } else {
        addedTreats[treatId] = { name: treatName, price: treatPrice };
        $btn.addClass('added').text('✓ ADDED');
        updateOrderSummary();
      }
    }
  });

  // 5. Open ADD Criteria Modal for Specific Add-on Items
  function openCriteriaModal(id, name, baseP, $btn) {
    $('#criteriaModalTitle').text('Select Options: ' + name);
    $('#criteriaTreatId').val(id);

    let optionsHtml = '';
    if (id === 'cupcakes') {
      optionsHtml = `
        <div class="cart2-modal-field">
          <label>Select Cupcake Flavor :</label>
          <select id="critPackFlavour" class="cart2-modal-select">
            <option value="" selected disabled>Select Cupcake Flavor </option>
            <option value="Vanilla">Vanilla</option>
            <option value="Chocolate">Chocolate</option>
            <option value="Redvelvet">Redvelvet</option>
            <option value="Eggless Vanilla">Eggless Vanilla</option>
          </select>
          <label>Select Pack Size:</label>
          <select id="critPackSize" class="cart2-modal-select">
            <option value="" selected disabled>Select Cupcake Quantity</option>
            <option value="$16">4pc ($16)</option>
            <option value="$22">6pc ($22)</option>
            <option value="$30">8pc ($30)</option>
          </select>
          <label>Select Topping Color:</label>
          <select id="critPackSize" class="cart2-modal-select">
            <option value="" selected disabled>Select Topping Color</option>
            <option value="White">White</option>
            <option value="Red">Red</option>
            <option value="Pink">Pink</option>
            <option value="Blue">Blue</option>
            <option value="Green">Green</option>
            <option value="Orange">Orange</option>
          </select>
          
          <label>Add Ons:</label>
          <select id="critOn" class="cart2-modal-select">
            <option value="" selected disabled>add Ons</option>
            <option value="Silver Balls($0)">Silver Balls($0)</option>
            <option value="Gold Balls($0)">Gold Balls($0)</option>
          </select>
        </div>`;
    } else if (id === 'custom_card') {
      optionsHtml = `
        <div class="cart2-modal-field">
          <label>Upload Greeting Photo (5x7"):</label>
          <input type="file" accept="image/*" class="cart2-modal-input" />
        </div>
        <div class="cart2-modal-field">
          <label>Personal Message Inside Card:</label>
          <textarea class="cart2-modal-input" rows="3" placeholder="Write your personal birthday message..."></textarea>
        </div>`;
    } else if (id === 'number_candles') {
      optionsHtml = `
        <div class="cart2-modal-field">
          <label>Select Number Digit (0-9):</label>
          <select class="cart2-modal-select">
            <option>Digit 1 ($2.00)</option><option>Digit 2 ($2.00)</option><option>Digit 3 ($2.00)</option>
            <option>Digit 4 ($2.00)</option><option>Digit 5 ($2.00)</option><option>Digit 6 ($2.00)</option>
          </select>
        </div>`;
    } else if (id === 'candles') {
      optionsHtml = `
        <div class="cart2-modal-field">
          <label>Select Number Digit (0-9):</label>
          <select class="cart2-modal-select">
            <option>Digit 1 ($2.00)</option><option>Digit 2 ($2.00)</option><option>Digit 3 ($2.00)</option>
            <option>Digit 4 ($2.00)</option><option>Digit 5 ($2.00)</option><option>Digit 6 ($2.00)</option>
          </select>
        </div>`;
    } else {
      optionsHtml = `
        <div class="cart2-modal-field">
          <label>Special Instructions for Treat:</label>
          <input type="text" class="cart2-modal-input" placeholder="e.g. Preferred color or style..." />
        </div>`;
    }

    $('#criteriaOptionsBox').html(optionsHtml);
    $('#criteriaModalOverlay').css('display', 'flex');

    $('#btnConfirmCriteria').off('click').on('click', function () {
      let finalPrice = baseP;
      if (id === 'cupcakes') {
        finalPrice = parseFloat($('#critPackSize').val()) || 16.00;
      }
      addedTreats[id] = { name: name, price: finalPrice };
      $btn.addClass('added').text('✓ ADDED');
      updateOrderSummary();
      closeCriteriaModal();
    });
  }

  function closeCriteriaModal() {
    $('#criteriaModalOverlay').hide();
  }

  $('#btnCloseCriteriaModal').on('click', closeCriteriaModal);

  // 6. EDIT CUSTOM DETAILS Modal
  $('#btnEditCustomDetails').on('click', function () {
    $('#editDetailsModalOverlay').css('display', 'flex');
  });

  $('#btnCloseEditModal').on('click', function () {
    $('#editDetailsModalOverlay').hide();
  });

  $('#btnSaveCustomDetails').on('click', function () {
    const flavor = $('#editFlavor').val();
    const decor = $('#editDecor').val();
    const writing = $('#editWriting').val();
    const inscription = $('#editInscription').val();
    const notes = $('#editNotes').val();

    let listHtml = `
      <div>&bull; Flavour: <strong class="cart2-flavor-tag">${flavor}</strong></div>
      <div style="margin-top:4px;">Customizations (Pre-filled):</div>
      <div style="padding-left:12px;margin-top:2px;">
        <div>&bull; Decor Color: <span class="note-red">${decor}</span></div>
        <div>&bull; Writing Color: <span class="note-red">${writing}</span></div>
        <div>&bull; Inscription: <span class="note-red">'${inscription}'</span></div>
        ${notes ? `<div>&bull; Special Notes: <span class="note-red">'${notes}'</span></div>` : ''}
      </div>`;

    $('#customsListContainer').html(listHtml);
    $('#editDetailsModalOverlay').hide();
    alert('✓ Custom details updated successfully!');
  });

  // Initial Calculation
  updateOrderSummary();

  // 4. Cake Border Color Live Switcher
  const $swatches = $('.decore-color');

  $swatches.on('click', function () {
    $swatches.removeClass('active');
    $(this).addClass('active');

    const hexColor = $(this).data('hex') || '#FF1493';
    const colorName = $(this).data('colorname') || $(this).attr('title') || 'Selected';
    
    // Update SVG border stroke color
    $('#editDecor').val(colorName);
  });

  const $write = $('.write-color');

  $write.on('click', function () {
    $write.removeClass('active');
    $(this).addClass('active');

    const colorName = $(this).data('colorname') || $(this).attr('title') || 'Selected';
    
    // Update SVG border stroke color
    $('#editWriting').val(colorName);
  });
  
  $(document).on('click', '.cupcake-decore-color', function () {
    $('.cupcake-decore-color').removeClass('active');
    $(this).addClass('active');

    const colorName = $(this).data('colorname') || $(this).attr('title') || 'Selected';

    $('#selectedBorderLabelCupcake').text(colorName);
  });

  function setupColorDropdown({ dropdownId, buttonId, optionSelector, selectedTextId, inputId, circleSelector}) {
    const dropdown = document.getElementById(dropdownId);
    const button = document.getElementById(buttonId);
    const options = document.querySelectorAll(optionSelector);
    const selectedText = document.getElementById(selectedTextId);
    const input = document.getElementById(inputId);

    // Open / close dropdown
    button.addEventListener("click", function (event) {
      event.stopPropagation();

      // Close other dropdowns
      document.querySelectorAll(".color-dropdown.open").forEach(item => {
        if (item !== dropdown) {
          item.classList.remove("open");
        }
      });

      dropdown.classList.toggle("open");
    });

    // Select color
    options.forEach(option => {

      option.addEventListener("click", function () {

        const colorName = this.dataset.colorname;
        const colorHex = this.dataset.hex;

        // Update selected text
        selectedText.textContent = colorName;

        // Update selected circle
        const selectedCircle = button.querySelector(circleSelector);

        if (colorHex) {
          selectedCircle.style.background = colorHex;
          selectedCircle.textContent = "";
        } else {
          selectedCircle.style.background = "#fff";
          selectedCircle.textContent = "+";
        }

        // Remove active from all options
        options.forEach(item => {
          item.classList.remove("active");
        });

        // Add active to selected option
        this.classList.add("active");

        // Handle Other Color
        if (colorName === "Other Color") {
          input.value = "";
          input.style.display = "block";
          input.focus();
        } else {
          input.style.display = "none";
          input.value = colorName;
        }
        // Close dropdown
        dropdown.classList.remove("open");
      });

    });

    // Update selected text when typing custom color
    input.addEventListener("input", function () {
      const value = this.value.trim();
      if (value !== "") {
        selectedText.textContent = value;
      }

    });

    return dropdown;
  }

  // ========================================
  // DECORATION COLOR DROPDOWN
  // ========================================

  setupColorDropdown({
    dropdownId: "colorDropdown",
    buttonId: "colorDropdownBtn",
    optionSelector: ".color-option",
    selectedTextId: "selectedColorText",
    inputId: "decorColor",
    circleSelector: ".color-circle"
  });


  // ========================================
  // WRITING COLOR DROPDOWN
  // ========================================

  setupColorDropdown({
    dropdownId: "writtingColorDropdown",
    buttonId: "writtingColorDropdownBtn",
    optionSelector: ".writting-color-option",
    selectedTextId: "writtingSelectedColorText",
    inputId: "writtingColor",
    circleSelector: ".writting-color-circle"
  });


  // ========================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // ========================================

  document.addEventListener("click", function () {

    document.querySelectorAll(".color-dropdown.open").forEach(dropdown => {
      dropdown.classList.remove("open");
    });

  });
});
