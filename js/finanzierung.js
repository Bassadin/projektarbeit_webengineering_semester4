$(document).ready(function() {
    updateSumOfAdditonalBuildingCosts();
});

function updateSumOfAdditonalBuildingCosts() {
    // console.log("baum");
    $("#agentsFee").text($("#buildingCost").text * 0.047);
};