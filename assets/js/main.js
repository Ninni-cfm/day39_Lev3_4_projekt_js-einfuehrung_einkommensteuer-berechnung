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


//****************************************************************************
// initialize user interface
initialize();

function initialize() {
    changeAssessmentType(SingleAssessment);

    formatInputNumber("txtIncome1");
    formatInputNumber("txtIncome2");

    checkCompensation();
    formatInputNumber("txtCompensation");
}

//****************************************************************************
// Single taxpayers are generally assessed individually according to the basic
// tax scale.
// Married taxpayers or registered civil partners can choose between separate
// assessment according to the basic table (Section 26a EStG) and joint 
// assessment according to the splitting table (Section 26b EStG).
// In the case of spouses or civil partners who choose the splitting method,
// income tax is calculated on half of the joint income and then doubled
// (Section 32a (5) EStG).
// Due to the tax progression in Germany, the choice of joint assessment
// usually results in the joint average tax rate being lower than in the case
// of separate assessment. This means that, as a rule, less income tax is paid
// according to the splitting table than in total according to the basic table.
function changeAssessmentType(newAssessmentType) {
    assessmentType = newAssessmentType;

    // if assessment type is set to split show a second input box for the 
    // aditional income.
    document.getElementById("lblIncome2").style.display =
        document.getElementById("blkIncome2").style.display =
        assessmentType == SingleAssessment ? "none" : "inherit";
}


//****************************************************************************

function startTaxCalculation() {

    let year = Number(document.getElementById("yearSelection").value);
    let income = Number(document.getElementById("txtIncome1").value);

    // if the partner's income is also counted
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

    let solidarityTax = solidarityTaxCalculation(year, incomeTax);

    let churchTaxRate = document.getElementById("churchTaxSelection").value;
    let churchTax = incomeTax * churchTaxRate / 100;

    setNumberInnerHTML("incomeTax", Math.floor(incomeTax));
    setNumberInnerHTML("solidarityTax", solidarityTax);
    setNumberInnerHTML("churchTax", churchTax);
    setNumberInnerHTML("totalTaxes", incomeTax + solidarityTax + churchTax);
}

//----------------------------------------------------------------------------
function taxCalculation(year, income) {

    let chargeableIncome = income;

    // did we receive some compensation?
    if (gotCompensation) {
        chargeableIncome += Number(document.getElementById("txtCompensation").value);
    }

    let taxes = 0;
    switch (year) {
        case 2021:
            taxes = calculateTaxFor2021(chargeableIncome, year2021);
            break;
        case 2020:
            taxes = calculateTaxFor2020(chargeableIncome, year2020);
            break;
        case 2019:
            taxes = calculateTaxFor2019(chargeableIncome, year2019);
            break;
    }

    if (gotCompensation) {
        taxes = taxes / chargeableIncome * income;
    }

    return taxes;
}
//----------------------------------------------------------------------------
function calculateTaxFor2021(income, limits) {

    let taxes = 0;
    switch (true) {
        case income <= limits.max1:
            break;
        case income <= limits.max2:
            taxes = tax2021Formular2(income);
            break;
        case income <= limits.max3:
            taxes = tax2021Formular3(income);
            break;
        case income <= limits.max4:
            taxes = tax2021Formular4(income);
            break;
        default:
            taxes = tax2021Formular5(income);
            break;
    }

    return taxes;
    //----------------------------------------------------------------------------
    function tax2021Formular2(income) {
        let y = (income - 9744) / 10000;
        return (995.21 * y + 1400) * y;
    }
    function tax2021Formular3(income) {
        let z = (income - 14753) / 10000;
        return (208.85 * z + 2397) * z + 950.96;
    }
    function tax2021Formular4(income) {
        return 0.42 * income - 9136.63;
    }
    function tax2021Formular5(income) {
        return 0.45 * income - 17374.99;
    }
}
function calculateTaxFor2020(income, limits) {

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
    return taxes;

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
}
function calculateTaxFor2019(income, limits) {

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
    return taxes;

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
}


//****************************************************************************
// The solidarity surcharge is levied as a supplementary tax to income tax and
// is therefore also taken into account in this income tax calculator. 
// According to the Solidarity Surcharge Act (Solidaritätszuschlaggesetz, 
// SolzG), it amounts to 5.5% of the income tax if this exceeds a certain 
// exemption limit.
// Until 2020, this exemption limit was an income tax of 972€ for single
// persons or 1944€ for married couples assessed jointly.
// These exemption limits were sharply increased with the law on the 
// repatriation of the solidarity surcharge in 1995, which was passed at the 
// end of 2019. From 2021, an exemption limit of 16,956€ will apply in the
// case of single assessment and an exemption limit of 33,912€ in the case of
// joint assessment.
// In addition, the solidarity surcharge is capped. From 2021, it will amount
// to a maximum of 11.9% of the difference between the income tax and the
// exemption limit in accordance with section 4 of the SolzG. Until 2020,
// this percentage was 20%.
function solidarityTaxCalculation(year, incomeTax) {

    let soli = 0;
    let soliPercentage = 5.5;
    let maxPercentage = year < 2021 ? 20 : 11.9;
    let taxFreeAmount = year < 2021 ? 972 : 16956;

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

//****************************************************************************
// Many income replacement benefits (formerly wage replacement benefits) are
// subject to the progression proviso in accordance with Section 32b of the
// German Income Tax Act (EStG). These include parental allowance, sickness
// benefit, unemployment benefit I, maternity benefit, short-time allowance
// and insolvency benefit.
// On the one hand, the above-mentioned income replacement benefits are not
// taxed. This means that no taxes are paid on sick pay or parental allowance,
// for example. However, these benefits are used to calculate the relevant tax
// rate for the remaining taxable income earned in the same year. As a result, 
// you end up paying slightly more tax again.
function checkCompensation() {
    gotCompensation = document.getElementById("chkCompensation").checked;

    // if compensation money is checked show a aditional input box for the 
    // compensation money
    document.getElementById("noCompensation").style.display =
        gotCompensation ? "none" : "unset";

    document.getElementById("gotCompensation").style.visibility =
        !gotCompensation ? "hidden" : "visible";
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


//****************************************************************************
// Debugging helpers
function debugVar(expr) {

    console.log(varToString(expr) + ": ", eval(expr));
}

//****************************************************************************
