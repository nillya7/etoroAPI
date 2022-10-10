// things to fix:
// callback functions and restructure the code
// remove stocks from being an optuin (or find a solution that won't crash the browser)


// things to add:
// loader while the results are loading
// on re-clicking: clear the results and create new one
// infographic of all insturments and how many etoro has to offer (stocks 5000, indices 21 etc...)



const xhr = new XMLHttpRequest();

// get all html elements
const divDataArea = document.getElementById('data-area')
const divCountInstruments = document.getElementById('divCountInstruments')
const spanInstToInvestNum = document.getElementById('spanInstToInvestNum')
const divCountInstrumentTypes = document.getElementById('divCountInstrumentTypes')
const spanInvestTypeNum = document.getElementById('spanInvestTypeNum')
const selectAreaDiv = document.getElementById('selectAreaDiv')
const selectDiv = document.getElementById('selectDiv')
const selectInstType = document.getElementById('selectInstType')
const showInstrumentListBtn = document.getElementById('showInstrumentListBtn')

// an object of Instrument Types
const instTypeObj = [
    {
        instType: 1,
        instTypeName: "Currencies"
    },
    {
        instType: 2,
        instTypeName: "Commodities"
    },
    {
        instType: 4,
        instTypeName: "Indices"
    },
    {
        instType: 5,
        instTypeName: "Stocks"
    },
    {
        instType: 6,
        instTypeName: "ETFs"
    },
    {
        instType: 10,
        instTypeName: "Crypto currencies"
    },
];


// Create the data function
function createEtoroSummary(data, uniqueInstTypesArray) {
    
    // count of instruments
    spanInstToInvestNum.innerText = data.length
        
    // count of instrument types
    spanInvestTypeNum.innerText = uniqueInstTypesArray.length
      
    
    // select the instrument type and show all instruments  
    createSelectOptions();
 
    //alert before choose Stocks
    selectInstType.addEventListener ('change', function() {
        let checkStocks = selectInstType.options[selectInstType.selectedIndex].value;
            if(checkStocks === "Stocks") {
            alert("this is going to crash!")
            }
    })
    

    showInstrumentListBtn.addEventListener ('click', getInstrumentsBasedOnType);
    
    function getInstrumentsBasedOnType() {
        
        // loader
        // const loaderDiv = document.createElement('div');
        // loaderDiv.innerText = "loading";
        // document.body.appendChild(loaderDiv)


        // get the instrument display name
        let selectedInstTypeValue = selectInstType.options[selectInstType.selectedIndex].value;
        
        // replace Instrument Type name the user selected to Intrument Type value
        //getInstrumentTypeName();
        for (let i=0; i<instTypeObj.length; i++) {
            if(instTypeObj[i].instTypeName === selectedInstTypeValue) {
                var instTypeValue = instTypeObj[i].instType                 // the instrument type value the user selcted
            }
        }

        // create listOfInst Array -- includes the Instrument Display Name (based on the instrument type the user selected)
        // createLisfOfInstArray(data, instTypeValue);
        for (let i=0; i<data.length; i++) {
            if(data[i].InstrumentTypeID === instTypeValue) {
                var listOfInst = data
                .filter(listOfInst => listOfInst.InstrumentTypeID === instTypeValue)
                .map(listOfInst => listOfInst.InstrumentDisplayName)
            }
        }

        //create the results area
        //createResultsAres(listOfInst, selectedInstTypeValue)
        const divResults = document.createElement('div');
        divResults.id = "divResults";

        const divCount = document.createElement('div');
        divCount.id = "divCount"
        divCount.innerText = listOfInst.length + " " + selectedInstTypeValue + " available:"

        document.body.appendChild(divResults);
        divResults.appendChild(divCount);

        const tableOfInst = document.createElement('table');

        const trHeader = document.createElement('tr');
        const th1 = document.createElement('th');
        const th2 = document.createElement('th');
        // th2.innerText = "Sort";
        trHeader.appendChild(th1);
        trHeader.appendChild(th2);
        tableOfInst.appendChild(trHeader)


        //get the SymbolFull (for the link)
        //getSymbolFull(data, instTypeValue);
        for (let i=0; i<data.length; i++) {
            if(data[i].InstrumentTypeID === instTypeValue) {
                var symbolFull = data
                .filter(symbolFull => symbolFull.InstrumentTypeID === instTypeValue)
                .map(symbolFull => symbolFull.SymbolFull);
            };
        };
    
        //get the images
        //getImages(data, instTypeValue);
        let instrumentImageArray = []
        for (let i=0; i<data.length; i++) {
            if(data[i].InstrumentTypeID === instTypeValue) {
                var instrumentImage = Object.values(data[i].Images[0])[3]
                instrumentImageArray.push(instrumentImage)
            }
        }
        
        //create rows in the table based on the user's selection
        //createDynamicTable(listOfInst, data, symbolFull, instrumentImageArray, tableOfInst, divResults)

        for (let i=0; i<listOfInst.length; i++) {
            var tr = document.createElement('tr');
             
            for (let j=0 ; j<data.length ; j++) {
                // create the instrument display name and link
                var aToInst = document.createElement('a');
                aToInst.title = listOfInst[i];
                aToInst.href = "https://www.etoro.com/markets/" + symbolFull[i];
                aToInst.target = "_blank";

                var link = document.createTextNode(listOfInst[i])
                aToInst.appendChild(link)
            
                var tdInstName = document.createElement('td');

                // image of the instument in another cell of the table
                const img = document.createElement('img');
                img.src = instrumentImageArray[i];
                var tdImage = document.createElement('td');
                tdImage.appendChild(img);
            }

            tr.appendChild(tdImage);
            tdInstName.appendChild(aToInst)
            tr.appendChild(tdInstName);
            tableOfInst.appendChild(tr)
            divResults.appendChild(tableOfInst);
        }
    }    
}

function createArray(data, callback) {
    let instTypes = data.map(instTypes => instTypes.InstrumentTypeID)
    let instTypesArray = [];
    instTypesArray.push(instTypes);
    let uniqueInstTypesArray = [...new Set(instTypesArray[0])];
    callback(data, uniqueInstTypesArray);
}

function createSelectOptions() {
    for (let i=0; i<instTypeObj.length; i++) {
        const optionInstType = document.createElement('option');
        optionInstType.innerText = instTypeObj[i].instTypeName
        selectInstType.appendChild(optionInstType);
    }
}




// Get the data from eToro API
xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let pardedResponse = JSON.parse(this.responseText);                  // object of the data
        let data = Object.values(pardedResponse)[0]                         // Array of the data
        .filter(countInst => countInst.IsInternalInstrument === false)       //filter to only external instruments
         
        console.log(data) 
        // console.log(data[1]) // specific instrument
        // console.log(data[1].SymbolFull)
        // console.log(data[1].InstrumentTypeID) // 1 = currency | 2 Commodities |  3 | 4 Indices | 5 Stocks | 10 Crypto
        // console.log(data[1].InstrumentDisplayName)
        // console.log(data[1].IsInternalInstrument) // should be false
        // console.log(Object.values(data[1].Images[0])[3]) // image of specific instrument [1] place

        createArray(data, createEtoroSummary);


    }
}

// API details
xhr.open('get', 'https://meta.etoro.com/v1.1/instruments.json');
xhr.send();



/////////