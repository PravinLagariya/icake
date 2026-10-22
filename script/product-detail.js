/* ========================================================
   iCakes Product Detail Interactive Engine — script/product-detail.js
======================================================== */

$(document).ready(function () {

  // 1. Product Image Slider + Live Canvas Base Sync
  const $mainGalleryImg = $('#mainGalleryImg');
  const $layerCakeBase = $('#layerCakeBase');

  $('.thumb-img').on('click', function () {
    $('.thumb-img').removeClass('active');
    $(this).addClass('active');
    const newSrc = $(this).data('img') || $(this).find('img').attr('src');
    
    // Update main image display
    $mainGalleryImg.attr('src', newSrc);
    // Update live canvas base cake background image!
    $layerCakeBase.attr('src', newSrc);
  });

  // 2. Photo Cake Live Canvas — Shape Toggle (Heart vs Round)
  const $shapeBtns = $('.shape-btn');
  const $layerPhoto = $('#layerPhoto');
  const $heartBorderPath = $('#heartBorderPath');
  const $frameCutoutPath = $('#frameCutoutPath');

  const heartClipPath = "path('M 150 260 C 15 170, 15 65, 95 40 C 130 27, 150 60, 150 60 C 150 60, 170 27, 205 40 C 285 65, 285 170, 150 260 Z')";
  const roundClipPath = "circle(115px at 150px 150px)";

  const heartPathD = "M 150 260 C 15 170, 15 65, 95 40 C 130 27, 150 60, 150 60 C 150 60, 170 27, 205 40 C 285 65, 285 170, 150 260 Z";
  const roundPathD = "M 150 35 A 115 115 0 1 1 149.9 35 Z";

  $shapeBtns.on('click', function () {
    $shapeBtns.removeClass('active');
    $(this).addClass('active');
    
    const shape = $(this).data('shape');
    if (shape === 'round') {
      $layerCakeBase.css('clip-path', roundClipPath);
      $layerPhoto.css('clip-path', roundClipPath);
      $heartBorderPath.attr('d', roundPathD);
      $frameCutoutPath.attr('d', roundPathD);
    } else {
      $layerCakeBase.css('clip-path', heartClipPath);
      $layerPhoto.css('clip-path', heartClipPath);
      $heartBorderPath.attr('d', heartPathD);
      $frameCutoutPath.attr('d', heartPathD);
    }
  });

  // 3. Customer Photo Upload & Remove (Overlays on selected cake in canvas)
  const $photoInput = $('#photoUpload');
  const $fileNameBadge = $('#fileNameBadge');
  const $btnRemovePhoto = $('#btnRemovePhoto');

  $photoInput.on('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        $layerPhoto.attr('src', evt.target.result).fadeIn();
        $fileNameBadge.html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Uploaded: <strong>' + file.name + '</strong></span>').css('display', 'inline-flex').hide().fadeIn();
        $btnRemovePhoto.css('display', 'inline-flex').hide().fadeIn();
      };
      reader.readAsDataURL(file);
    }
  });

  $btnRemovePhoto.on('click', function () {
    $photoInput.val('');
    $layerPhoto.attr('src', '').fadeOut();
    $fileNameBadge.fadeOut();
    $btnRemovePhoto.fadeOut();
  });

  // 4. Cake Border Color Live Switcher
  const $swatches = $('.swatch-btn:not(.piping-color-btn)');

  $swatches.on('click', function () {
    $swatches.removeClass('active');
    $(this).addClass('active');

    const hexColor = $(this).data('hex') || '#FF1493';
    const colorName = $(this).data('colorname') || $(this).attr('title') || 'Selected';
    
    // Update SVG border stroke color
    $heartBorderPath.css('stroke', hexColor);
    $('#selectedBorderLabel').text(colorName);
  });

  // 5. Live Piping Text & Text Color Overlay
  const $pipingInput = $('#pipingMessage');
  const $layerPiping = $('#layerPiping');
  const $pipingColorBtns = $('.piping-color-btn');

  $pipingInput.on('input', function () {
    const text = $(this).val();
    $layerPiping.text(text.trim() ? text : 'Happy Birthday!');
  });

  $pipingColorBtns.on('click', function () {
    $pipingColorBtns.removeClass('active');
    $(this).addClass('active');
    const hex = $(this).data('hex') || '#ffffff';
    $layerPiping.css('color', hex);
  });

  // 6. Dynamic Price Calculator
  const $sizeSelect = $('#cakeSize');
  const $dietarySelect = $('#dietaryOpt');
  const $priceDisplay = $('#priceDisplay');
  const $stickyPrice = $('#stickyPrice');
  const $qtyInput = $('#qtyInput');

  function calculatePrice() {
    let basePrice = parseFloat($sizeSelect.find(':selected').data('price')) || 81.00;
    let extraDiet = parseFloat($dietarySelect.find(':selected').data('extra')) || 0.00;
    let qty = parseInt($qtyInput.val(), 10) || 1;

    let singleUnitPrice = basePrice + extraDiet;
    let totalPrice = singleUnitPrice * qty;

    const formattedPrice = '$' + totalPrice.toFixed(2) + ' CAD';
    $priceDisplay.text(formattedPrice);
    $stickyPrice.text(formattedPrice);
  }

  $sizeSelect.on('change', calculatePrice);
  $dietarySelect.on('change', calculatePrice);

  // 7. Quantity Counter Controls
  $('#btnQtyDec').on('click', function () {
    let currentVal = parseInt($qtyInput.val(), 10) || 1;
    if (currentVal > 1) {
      $qtyInput.val(currentVal - 1);
      calculatePrice();
    }
  });

  $('#btnQtyInc').on('click', function () {
    let currentVal = parseInt($qtyInput.val(), 10) || 1;
    $qtyInput.val(currentVal + 1);
    calculatePrice();
  });

  $qtyInput.on('change', function () {
    let val = parseInt($(this).val(), 10);
    if (isNaN(val) || val < 1) $(this).val(1);
    calculatePrice();
  });

  // 8. Tabs Navigation
  $('.pd-tab-btn').on('click', function () {
    $('.pd-tab-btn').removeClass('active');
    $('.pd-tab-content').removeClass('active');
    
    $(this).addClass('active');
    const targetTab = $(this).data('tab');
    $('#' + targetTab).addClass('active');
  });

  // 9. Add to Cart Action Modal Popup
  const $cartModalOverlay = $('#pdCartModalOverlay');
  const $btnCloseCartModal = $('.btnCloseCartModal');
  const $btnContinueShopping = $('#btnContinueShopping');

  $('.pd-add-cart-btn').on('click', function () {
    const sizeName = $sizeSelect.find(':selected').text();
    const selectedFlavorRadio = $('input[name="cakeFlavor"]:checked');
    const flavorName = selectedFlavorRadio.length ? selectedFlavorRadio.val() : ($('#cakeFlavor').val() || 'Eggless Black Forest');
    const qty = $qtyInput.val();
    const message = $pipingInput.val() || 'Happy Birthday!';
    const currentImgSrc = $mainGalleryImg.attr('src');
    const currentPriceText = $priceDisplay.text();

    $('#modalProductImg').attr('src', currentImgSrc);
    $('#modalQty').text(qty);
    $('#modalTotalPrice').text(currentPriceText);

    let metaHtml = `
      <div>Size: <strong>${sizeName}</strong></div>
      <div>Flavour: <strong>${flavorName}</strong></div>
      <div>Piping Message: <strong>"${message}"</strong></div>
    `;

    $('#modalProductMeta').html(metaHtml);
    $cartModalOverlay.css('display', 'flex').hide().fadeIn(250);
  });

  const $cartModalOverlaySuccess = $('#pdCartModalOverlaySuccess');
  $('#btnConfirmCart').click(function() {
    closeCartModal();
    $cartModalOverlaySuccess.css('display', 'flex').hide().fadeIn(250);
  });

  $('#btnCloseSuccessModal').click(function() {
    $cartModalOverlaySuccess.fadeOut(200);
  })

  function closeCartModal() {
    $cartModalOverlay.fadeOut(200);
  }

  $btnCloseCartModal.on('click', closeCartModal);
  $btnContinueShopping.on('click', closeCartModal);
  $cartModalOverlay.on('click', function (e) {
    if ($(e.target).is($cartModalOverlay)) {
      closeCartModal();
    }
  });

  // Initial calculation & setup
  calculatePrice();

  document.querySelectorAll('input[name="dietaryOpt"]').forEach(function(radio){
    radio.addEventListener('change', function(){
      var hidden = document.getElementById('dietaryOpt');
      hidden.value = this.value;
      hidden.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  $('#otherTextColor').click(function() {
    $('#textColor').css('display','block');
  })

  $('.text-decor-color').click(function() {
    $('#textColor').css('display','none');
  })

  $('.decor-color').click(function() {
    $('#decorColor').css('display','none');
  })

  $('#otherDecorColor').click(function() {
    $('#decorColor').css('display','block');
    $('#selectedBorderLabel').text(" ");
  });

  // Dynamic Urgency Countdown Timer
  let totalSeconds = 3 * 3600 + 15 * 60;
  const $urgencyTimer = $('#urgencyTimer');
  
  if ($urgencyTimer.length) {
    setInterval(function () {
      if (totalSeconds > 0) {
        totalSeconds--;
      } else {
        totalSeconds = 4 * 3600; // reset timer loop
      }
      const hrs = Math.floor(totalSeconds / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;
      $urgencyTimer.text(`${hrs} hrs ${mins} mins ${secs < 10 ? '0' : ''}${secs}s`);
    }, 1000);
  }


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
