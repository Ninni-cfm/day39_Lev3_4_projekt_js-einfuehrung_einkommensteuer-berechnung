let taxTable = [
    year2019 = { year: 2019, max1: 9168, max2: 14254, max3: 55960, max4: 265326, max5: Infinity },
    year2020 = { year: 2020, max1: 9408, max2: 14532, max3: 57051, max4: 270500, max5: Infinity },
    year2021 = { year: 2021, max1: 9744, max2: 14753, max3: 57918, max4: 274612, max5: Infinity },
];

// Greeting from StackOverflow :-)
const varToString = varObj => Object.keys(varObj)[0];

const currency = 'Euro';

const SingleAssessment = false;
const SplitAssessment = !SingleAssessment;

let assessmentType = SingleAssessment;

let gotCmpensation = false;

initialize();


//****************************************************************************

function initialize() {
    changeAssessmentType(SingleAssessment);

    formatInputNumber("txtIncome1");
    formatInputNumber("txtIncome2");

    // disabled until I know how compensation money affects tax calculation
    // checkCompensation();
    // formatInputNumber("txtCompensation");
}

//****************************************************************************

function changeAssessmentType(newAssessmentType) {
    assessmentType = newAssessmentType;

    document.getElementById("lblIncome2").style.display =
        document.getElementById("blkIncome2").style.display =
        assessmentType == SingleAssessment ? "none" : "inherit";
}

// disabled until I know how this money affects tax calculation
// function checkCompensation() {
//     gotCompensation = document.getElementById("chkCompensation").checked;
//     document.getElementById("noCompensation").style.display =
//         gotCompensation ? "none" : "inline-block";

//     document.getElementById("gotCompensation").style.visibility =
//         !gotCompensation ? "hidden" : "visible";
// }

//****************************************************************************

function startTaxCalculation() {

    let year = Number(document.getElementById("yearSelection").value);
    let income = Number(document.getElementById("txtIncome1").value);

    // if income of partner is valuable as well
    if (assessmentType == SplitAssessment) {
        income += Number(document.getElementById("txtIncome2").value);
        income /= 2;
    }

    // only the integer part of the value is used for tax calculation
    income = Math.floor(income);

    let incomeTax = taxCalculation(year, income);
    if (assessmentType == SplitAssessment) {
        incomeTax *= 2;
    }

    let churchTaxRate = document.getElementById("churchTaxSelection").value;
    let churchTax = incomeTax * churchTaxRate / 100;
    let solidarityTax = solidarityTaxCalculation(year, incomeTax);


    setNumberInnerHTML("incomeTax", incomeTax);
    setNumberInnerHTML("churchTax", churchTax);
    setNumberInnerHTML("solidarityTax", solidarityTax);
    setNumberInnerHTML("totalTaxes", incomeTax + churchTax);

}

//----------------------------------------------------------------------------
function taxCalculation(year, income) {

    let taxes = 0;
    switch (year) {
        case 2021:
            taxes = formula2021(income, year2021);
            break;
        case 2020:
            taxes = formula2020(income, year2020);
            break;
        case 2019:
            taxes = formula2019(income, year2019);
            break;
    }
    return taxes;
}

//----------------------------------------------------------------------------
function solidarityTaxCalculation(year, incomeTax) {

    let soli = 0;
    let soliPercentage = 5.5;
    let maxPercentage = year < 2021 ? 20 : 11.9;
    let taxFreeAmount = year < 2021 ? 972 : 16596;

    // double the tax free amount for partners
    if (assessmentType == SplitAssessment) {
        taxFreeAmount *= 2;
    }

    // if tax is more than the tax free amount...
    if (incomeTax > taxFreeAmount) {

        soli = incomeTax * soliPercentage / 100;
        let maxSoliTax = (incomeTax - taxFreeAmount) * maxPercentage / 100;
        soli = Math.min(maxSoliTax, soli);
    }

    return soli;
}

//----------------------------------------------------------------------------
function formula2021(income, limits) {

    let chargeableIncome = income;

    // disabled until I know how this money affects tax calculation
    // did we receive some compensation?
    // if (gotCompensation) {
    //     chargeableIncome += Number(document.getElementById("txtCompensation").value) * 2;
    // }

    let taxes = 0;
    switch (true) {
        case chargeableIncome <= limits.max1:
            break;
        case chargeableIncome <= limits.max2:
            taxes = tax2021Formular2(income);
            break;
        case chargeableIncome <= limits.max3:
            taxes = tax2021Formular3(income);
            break;
        case chargeableIncome <= limits.max4:
            taxes = tax2021Formular4(income);
            break;
        default:
            taxes = tax2021Formular5(income);
            break;
    }
    return Math.floor(taxes);
}
function formula2020(income, limits) {

    let taxes = 0;
    switch (true) {
        case income <= limits.max1:
            break;
        case income <= limits.max2:
            taxes = tax2020Formular2(income);
            break;
        case income <= limits.max3:
            taxes = tax2020Formular3(income);
            break;
        case income <= limits.max4:
            taxes = tax2020Formular4(income);
            break;
        default:
            taxes = tax2020Formular5(income);
            break;
    }
    return Math.floor(taxes);
}
function formula2019(income, limits) {

    let taxes = 0;
    switch (true) {
        case income <= limits.max1:
            break;
        case income <= limits.max2:
            taxes = tax2019Formular2(income);
            break;
        case income <= limits.max3:
            taxes = tax2019Formular3(income);
            break;
        case income <= limits.max4:
            taxes = tax2019Formular4(income);
            break;
        default:
            taxes = tax2019Formular5(income);
            break;
    }
    return Math.floor(taxes);
}

//----------------------------------------------------------------------------
// common for all years: no money, no taxes :-)
function taxAllFormular1() {
    return 0;
}

//----------------------------------------------------------------------------
function tax2021Formular2(income) {
    let y = (income - 9744) / 10000;
    let taxes = (995.21 * y + 1400) * y;
    return taxes;
}
function tax2021Formular3(income) {
    let z = (income - 14753) / 10000;
    let taxes = (208.85 * z + 2397) * z + 950.96;
    return taxes;
}
function tax2021Formular4(income) {
    return 0.42 * income - 9136.63;
}
function tax2021Formular5(income) {
    return 0.45 * income - 17374.99;
}

//----------------------------------------------------------------------------
function tax2020Formular2(income) {
    let y = (income - 9408) / 10000;
    let taxes = (972.87 * y + 1400) * y;
    return taxes;
}
function tax2020Formular3(income) {
    let z = (income - 14532) / 10000;
    let taxes = (212.02 * z + 2397) * z + 972.79;
    return taxes;
}
function tax2020Formular4(income) {
    return 0.42 * income - 8963.74;
}
function tax2020Formular5(income) {
    return 0.45 * income - 17078.74;
}

//----------------------------------------------------------------------------
function tax2019Formular2(income) {
    let y = (income - 9168) / 10000;
    let taxes = (972.87 * y + 1400) * y;
    return taxes;
}
function tax2019Formular3(income) {
    let z = (income - 14254) / 10000;
    let taxes = (216.16 * z + 2397) * z + 965.58;
    return taxes;
}
function tax2019Formular4(income) {
    return 0.42 * income - 8780.90;
}
function tax2019Formular5(income) {
    return 0.45 * income - 16740.68;
}


//****************************************************************************
// helper functions

function setNumberInnerHTML(id, value) {

    document.getElementById(id).innerHTML = formatNumber(value, true);
}

function formatInputNumber(id) {

    let income = Number(document.getElementById(id).value);
    document.getElementById(id).value = formatNumber(income, false);
}



//----------------------------------------------------------------------------
// format a number 
function formatNumber(value, showCurrencySymbol = true) {

    let formattedNumber = (Math.floor(value * 100) / 100).toFixed(2);

    if (showCurrencySymbol) {
        formattedNumber += ` ${currency}`;
    }
    return formattedNumber;
}


//----------------------------------------------------------------------------
// Debugging helpers
function debugVar(...expr) {
    console.log(varToString(expr) + ": ", eval(expr));
}