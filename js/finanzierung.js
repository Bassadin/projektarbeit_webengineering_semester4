let interestRate = 0.0155;

$(document).ready(function() {
    updateAllCosts();
    $("#buildingCost, #ownCapital, #estateCost, #annuity, #paybackPeriod").on("input", function() {
        updateAllCosts();
    });
});

function updateAllCosts() {
    let estateCostValue = parseInt($("#estateCost").val()) || 0;

    let agentsFee = estateCostValue * 0.047;
    let notaryFee = estateCostValue * 0.02;
    let realEstateTransferTax = estateCostValue * 0.05;
    let sumOfAllAdditionalBuildingCosts = agentsFee + notaryFee + realEstateTransferTax;

    $("#agentsFee").text(agentsFee.toFixed(2));
    $("#notaryFee").text(notaryFee.toFixed(2));
    $("#realEstateTransferTax").text(realEstateTransferTax.toFixed(2));

    $("#sumOfAdditonalBuildingCosts").text(sumOfAllAdditionalBuildingCosts.toFixed(2));

    let ownCapital = parseInt($("#ownCapital").val()) || 0;
    let loanAmount = (parseInt($("#buildingCost").val()) || 0) +
        estateCostValue +
        sumOfAllAdditionalBuildingCosts -
        ownCapital;

    let loanAmountText = "";

    if (loanAmount <= 50000000 && loanAmount >= 50000) {
        if (ownCapital >= loanAmount * 0.2) {
            loanAmountText = loanAmount.toFixed(2) + "€";
        } else {
            loanAmountText = "FEHLER: Ihr Eigenkapital reicht nicht aus, um ein Darlehen anzunehmen";
        }
    } else {
        if (loanAmount > 5000000) {
            loanAmountText = "FEHLER: Wir vergeben keine Darlehen über 5.000.000€.";
        } else {
            loanAmountText = "FEHLER: Wir vergeben keine Darlehen unter 50.000€.";
        }
        loanAmountText = loanAmountText + " Mit den aktuellen Werten beträgt dieser " + loanAmount + "€.";
    }


    $("#loanAmount").text(loanAmountText);
    calculateRepaymentData(loanAmount);
}

function calculateRepaymentData(loanAmount) {
    let paybackPeriod = $("paybackPeriod").val() || 20; //Fallback to 20
    let interestFactorWithPaybackPeriod = Math.pow(1 + interestRate, paybackPeriod);

    $("#monthlyRate").text((loanAmount * (interestFactorWithPaybackPeriod * interestRate / (interestFactorWithPaybackPeriod - 1))).toFixed(2) + "€");

    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear() + paybackPeriod - 1;

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    $("#dateOfLastRate").text(dd + '.' + mm + '.' + yyyy);
}