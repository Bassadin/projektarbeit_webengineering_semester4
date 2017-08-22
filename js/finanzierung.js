let interestRate = 0.0155;
let paymentTable;

$(document).ready(function() {
    //https://datatables.net/
    paymentTable = $('#paymentTable').DataTable({
        paging: false,
        searching: false,
        ordering: false,
        info: false
    });
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
    let paybackPeriod = $("#paybackPeriod").val() || 20; //Fallback to 20
    let interestFactorWithPaybackPeriod = Math.pow(1 + interestRate, paybackPeriod);

    $("#monthlyRate").text((loanAmount * (interestFactorWithPaybackPeriod * interestRate / (interestFactorWithPaybackPeriod - 1))).toFixed(2) + "€");

    let todayDate = new Date();
    let todayDay = todayDate.getDate();
    let todayMonth = todayDate.getMonth();
    let targetMonth = todayMonth + 1;
    let todayYear = todayDate.getFullYear();
    let targetYear = todayYear + parseInt(paybackPeriod) - 1;

    if (todayDay < 10) {
        todayDay = '0' + todayDay;
    }

    if (targetMonth < 10) {
        targetMonth = '0' + targetMonth;
    }

    //Set the date string
    $("#dateOfLastRate").text(todayDay + '.' + targetMonth + '.' + targetYear);

    // Real annuity cost calculation
    // let annuityCosts = (loanAmount * (Math.pow((1 + interestRate), paybackPeriod) * interestRate) / (Math.pow((1 + interestRate), paybackPeriod) - 1)).toFixed(2);
    let annuityCosts = loanAmount * ($('#annuity').val() / 100);
    let leftLoanAmount = loanAmount;
    let rateAmount, repayment;

    //Clear table and then fill it
    paymentTable.clear();
    for (i = todayYear; i <= targetYear; i++) {
        rateAmount = (leftLoanAmount * interestRate).toFixed(2);
        repayment = (annuityCosts - rateAmount).toFixed(2);

        paymentTable.row.add([
            todayDay + '.' + todayMonth + '.' + i,
            annuityCosts,
            rateAmount,
            repayment,
            "-" + leftLoanAmount
        ]);
        leftLoanAmount = (leftLoanAmount - repayment).toFixed(2);
    }
    //Redraw the table so that the changes get visible
    paymentTable.draw();
    $('#openPayment').text(leftLoanAmount);
}