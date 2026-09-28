(function () {
  "use strict";

  // Hard-coded conversion rates: PKR per 1 unit of the target currency.
  // No rate API — these are fixed for this assessment.
  var RATES = {
    PKR: 1,
    USD: 278.5,
    GBP: 355.0
  };

  var CURRENCY_LABEL = {
    PKR: "Pakistani Rupees",
    USD: "US Dollars",
    GBP: "British Pounds"
  };

  var STORAGE_KEYS = {
    billing: "pkhosting_billing",
    currency: "pkhosting_currency"
  };

  var planCards = Array.prototype.slice.call(document.querySelectorAll(".plan-card"));
  var billingInputs = Array.prototype.slice.call(document.querySelectorAll('input[name="billing"]'));
  var currencySelect = document.getElementById("currency");
  var statusEl = document.getElementById("price-status");

  // Format a PKR amount into the target currency's display string.
  // PKR is shown as a whole number; USD/GBP always show two decimals.
  function formatMoney(pkrAmount, currency) {
    if (currency === "PKR") {
      return "Rs " + Math.round(pkrAmount).toLocaleString("en-US");
    }
    var rate = RATES[currency];
    var converted = pkrAmount / rate;
    var symbol = currency === "USD" ? "$" : "£";
    return symbol + converted.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Annual billing charges 10 months for 12.
  // Per-month figure shown = (monthly * 10) / 12.
  // Savings badge is derived, never hand-typed.
  function computeAnnual(monthlyPkr) {
    var perMonth = (monthlyPkr * 10) / 12;
    var annualTotal = monthlyPkr * 10;
    var fullPriceTotal = monthlyPkr * 12;
    var savingsAmount = fullPriceTotal - annualTotal;
    var savingsPercent = Math.round((savingsAmount / fullPriceTotal) * 100);
    return {
      perMonth: perMonth,
      annualTotal: annualTotal,
      savingsAmount: savingsAmount,
      savingsPercent: savingsPercent
    };
  }

  function getBillingPeriod() {
    var checked = billingInputs.filter(function (input) {
      return input.checked;
    })[0];
    return checked ? checked.value : "monthly";
  }

  function render() {
    var billing = getBillingPeriod();
    var currency = currencySelect.value;

    planCards.forEach(function (card) {
      var monthlyPkr = parseFloat(card.getAttribute("data-monthly-pkr"));
      var figureEl = card.querySelector(".price-figure");
      var unitEl = card.querySelector(".price-unit");
      var detailEl = card.querySelector(".plan-annual-detail");

      if (billing === "monthly") {
        figureEl.textContent = formatMoney(monthlyPkr, currency);
        unitEl.textContent = "/mo";
        detailEl.hidden = true;
        detailEl.textContent = "";
      } else {
        var a = computeAnnual(monthlyPkr);
        figureEl.textContent = formatMoney(a.perMonth, currency);
        unitEl.textContent = "/mo, billed annually";
        detailEl.hidden = false;
        detailEl.innerHTML =
          formatMoney(a.annualTotal, currency) +
          " billed once a year &middot; " +
          '<span class="save-badge">Save ' +
          a.savingsPercent +
          "% (" +
          formatMoney(a.savingsAmount, currency) +
          "/yr)</span>";
      }
    });

    if (statusEl) {
      var billingLabel = billing === "monthly" ? "monthly" : "annual";
      statusEl.textContent =
        "Prices updated to " + billingLabel + " billing in " + CURRENCY_LABEL[currency] + ".";
    }

    try {
      localStorage.setItem(STORAGE_KEYS.billing, billing);
      localStorage.setItem(STORAGE_KEYS.currency, currency);
    } catch (e) {
      // localStorage can be unavailable (private browsing, storage disabled).
      // Prices still render correctly; only persistence across reloads is lost.
    }
  }

  function restoreSavedState() {
    try {
      var savedBilling = localStorage.getItem(STORAGE_KEYS.billing);
      var savedCurrency = localStorage.getItem(STORAGE_KEYS.currency);

      if (savedBilling) {
        var radio = billingInputs.filter(function (input) {
          return input.value === savedBilling;
        })[0];
        if (radio) radio.checked = true;
      }

      if (savedCurrency && RATES.hasOwnProperty(savedCurrency)) {
        currencySelect.value = savedCurrency;
      }
    } catch (e) {
      // No saved state available; defaults from the HTML stand as-is.
    }
  }

  function initDeployButtons() {
    var buttons = document.querySelectorAll(".btn-card");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest(".plan-card");
        var planName = card ? card.getAttribute("data-plan") : "This plan";
        if (statusEl) {
          statusEl.textContent =
            planName + " selected. This is a demo page — checkout is not connected.";
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    restoreSavedState();
    render();

    billingInputs.forEach(function (input) {
      input.addEventListener("change", render);
    });
    currencySelect.addEventListener("change", render);

    initDeployButtons();
  });
})();
