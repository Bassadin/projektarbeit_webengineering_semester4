$(document).ready(function() {
    updateAllCosts();
    document.getElementById("buildingCost").oninput = function() {
        updateAllCosts();
    };
    document.getElementById("ownCapital").oninput = function() {
        updateAllCosts();
    };
    document.getElementById("estateCost").oninput = function() {
        updateAllCosts();
    };
});

function updateAllCosts() {
    let estateCostValue = parseInt($("#estateCost").val() + 1 * 0); //+ 1 * 0 -> hack for empty field, removes possibility of NaN output

    let agentsFee = estateCostValue * 0.047;
    let notaryFee = estateCostValue * 0.02;
    let realEstateTransferTax = estateCostValue * 0.05;
    let sumOfAllAdditionalBuildingCosts = agentsFee + notaryFee + realEstateTransferTax;

    $("#agentsFee").text(agentsFee.toFixed(2));
    $("#notaryFee").text(notaryFee.toFixed(2));
    $("#realEstateTransferTax").text(realEstateTransferTax.toFixed(2));

    $("#sumOfAdditonalBuildingCosts").text(sumOfAllAdditionalBuildingCosts.toFixed(2));

    $("#loanAmount").text((parseInt($("#buildingCost").val() + 1 * 0) +
        estateCostValue +
        sumOfAllAdditionalBuildingCosts -
        parseInt($("#ownCapital").val() + 1 * 0)).toFixed(2));
}