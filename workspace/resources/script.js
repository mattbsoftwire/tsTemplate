const ENTER_KEYCODE = 13;
let postcode = ""
window.onload = updatePostcode;

function updatePostcode(){
    postcode = document.getElementById("postcodeInput").value;
    getStopData();
}

function postcodeKeypress(event) {
    if(event.keyCode == ENTER_KEYCODE) updatePostcode();
}

function getStopData() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/closestStops?postcode="+postcode, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();

    const response = JSON.parse(xhttp.responseText);
    const stopList = document.getElementById('stopList');

    // Error handling
    if(response.hasOwnProperty("error")){
        stopList.innerHTML =
            `<div class="stopContainer">
               <div class="stopTitle">
                 ERROR: ${response.error.toUpperCase()}
               </div>
             </div>`;
        return;
    }

    stopList.innerHTML = "";
    response.forEach(stop => {

        let arrivalList = '';

        stop.forEach(arrival => {
            const arrivalTime = new Date(arrival.expectedArrival).toLocaleTimeString();

            arrivalList +=
               `<div class="arrival">
                  <div class="lineName">${arrival.lineName}</div>
                  <div class="destinationName">${arrival.destinationName}</div>
                  <div class="arrivalTime">${arrivalTime}</div>
                </div>`
        });
        
        const stopHTML = 
            `<div class="stopContainer">
               <div class="stopTitle">
                 ${stop[0].stationName}
               </div>
               <div class="arrivalList">
                 ${arrivalList}
               </div>
             </div>`

        stopList.innerHTML += stopHTML;
    })

    setTimeout("getStopData()", 30000);
}