const ENTER_KEYCODE = 13;

window.onload = getStopData;

function postcodeKeypress(event) {
    if(event.keyCode == ENTER_KEYCODE) getStopData();
}

function getStopData() {
    const postcode = document.getElementById("postcodeInput").value;
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/closestStops?postcode="+postcode, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    const response = JSON.parse(xhttp.responseText);
    console.log(response);
    const stopList = document.getElementById('stopList');
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