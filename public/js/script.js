// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})();


const taxSwitch = document.querySelector("#switchCheckDefault");

if (taxSwitch) {

    taxSwitch.addEventListener("change", () => {

        const normalPrices = document.querySelectorAll(".price");
        const taxPrices = document.querySelectorAll(".tax-price");
        const taxInfo = document.querySelectorAll(".tax-info");

        normalPrices.forEach(price => {
            price.style.display = taxSwitch.checked ? "none" : "inline";
        });

        taxPrices.forEach(price => {
            price.style.display = taxSwitch.checked ? "inline" : "none";
        });

        taxInfo.forEach(info => {
            info.style.display = taxSwitch.checked ? "inline" : "none";
        });

    });

}

