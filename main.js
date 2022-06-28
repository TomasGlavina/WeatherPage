/*
    FETCH API FUNCTIONS
*/
const getData = async function(DATA){
    const response  = await fetch(DATA);
    const data = await  response.json();
    return data;
}

//Gets the data of the hourly average database, by getting the main url, and adding the type and amount of hours
const hourlyAvgData = async function(URL, type, amount) {
    URL += (type + '/' + amount);
    const response = await fetch(URL);
    const data = await response.json();
    return data;
}



/*
    TITLE AND PARAGRAPH MAKERS
*/

//A Title formatter that checks the type from the URL and capitalize them 
const getType = function(type) {
    if(type.toLowerCase().includes('rain')){
        return 'Rain';
    } else if (type.toLowerCase().includes('humidity_out')){
        return'Humidity Outside';
    } else if (type.toLowerCase().includes('wind_speed')){
        return 'Wind Speed';
    } else if (type.toLowerCase().includes('humidity_in')) {
        return 'Humidity Inside';
    } else if(type.toLowerCase().includes('rain')){
        return 'Rain';
    } else if (type.toLowerCase().includes('direction')){
        return 'Wind Direction';
    } else if (type.toLowerCase().includes('temp')){
        return 'Temperature';
    } else if (type.toLowerCase().includes('light')){
        return 'Light';
    } else if (type.toLowerCase().includes('pres')){
        return 'Air Pressure'
    } else {
        return type;
    }
}

const setMainTitle = function(){
    const e  = document.getElementById("title");
    e.innerHTML = `<h1>Latest 30 measurements of all types</h1>
                            <p>Types are: Temperature, Rain, Humidity (Outside & Inside), Wind Speed, Wind Direction, Light and Air Pressure</p>`;
}

const setSpecificTitle= function(type) {
    const e = document.getElementById("title");
    e.innerHTML =`<h1 class="dataHeader">${getType(type)}</h1>
                  <p>These are the latest 20 measurements</p>`;
}


const setViewFiveTitle = function() {
    const e = document.getElementById('title');
    e.innerHTML = `<h1 class="dataHeader">View 5</h1>
                    <p>Please, select a measurement type from the "Data Type" menu.</p>`;
}


//Average View Title maker, calls getType for the H1 And then explains the page
const setAvgTitle = function(type, time, unit) {
    const e  = document.getElementById("title");
    let title = `<h1 class="dataHeader">${getType(type)}</h1>`;
    if (time === 167)
        title += `<p>These are the hourly average measurements for the last week`;
    else 
    title += `<p>These are the hourly average measurements for the last ${time} ${unit}`;
}


/* 
    TABLE MAKERS 
*/

//Main view HTML maker, gets the data and formats it into a tabular form
const dataToHtmlViewOne = function(data, measures) {
    let button = document.getElementById('update');
    button.className = 'view1';
    let htmlString = `
                        <div class="table" id="t1">
                        <table>
                        <tr>
                        <th>Nr.</th> <th>Measurement Type</th><th>Measurement Day</th><th>Measurement Time</th><th>Measurement Value</th>
                        </tr>`;

    for(let i = 0; i < measures; i++){
        let d = data[i];
        let date = d.date_time;
        let measurementDay = date.substring(0, date.indexOf('T'));
        let measurementTime = date.substring(date.indexOf('T')+1, date.indexOf('.'));
        let [year, month, day] = measurementDay.split('-');
        measurementDay = [day, month, year].join('-');
        let measurementType = Object.keys(d.data)[0];
        let measurementValue = Object.values(d.data);
        if (i == 15) {
            htmlString += `</table><table>
                        <tr>
                         <th>Nr.</th> <th>Measurement Type</th><th>Measurement Day</th><th>Measurement Time</th><th>Measurement Value</th>
                        </tr>`;
        }
        htmlString += `
                    <tr>
                        <td>${i+1}</td>
                        <td>${getType(measurementType)}</td>
                        <td>${measurementDay}</td>
                        <td>${measurementTime}</td>
                        <td>${measurementValue}</td>
                    </tr>`;
        
    }
    htmlString+='</table></div>';
    return htmlString;
}

//Makes the string of the latest 20 measurements for view Two and Three (Temperature and Wind Speed in my case)
const dataToHtmlViewTwoThree = function(data, type) {
    let button = document.getElementById('update');
    button.className = `${type}`;
    let htmlString = `
                        <div class="table" id="t23">
                        <table>
                            <tr>
                            <th>Nr.</th><th>Measurement Day</th><th>Measurement Time</th><th>Measurement Value</th>
                            </tr>`;

    let counter = 1;
    for(let i = data.length-1; i >= 0; i--){
        let d = data[i];
        let date = d.date_time;
        let measurementDay = date.substring(0, date.indexOf('T'));
        let measurementTime = date.substring(date.indexOf('T')+1, date.indexOf('.'));
        let [year, month, day] = measurementDay.split('-');
        measurementDay = [day, month, year].join('-');
        let measurementValue = Object.values(d)[2];
        htmlString += `<tr>
                        <td>${counter}</td>
                        <td>${measurementDay}</td>
                        <td>${measurementTime}</td>
                        <td>${measurementValue}</td>
                       </tr>`;
        counter++;
    }
    htmlString+='</table></div>';
    return htmlString;
}

//Makes the Hourly Average Table, I made a second function since this JSON DataBase is ordered by latest last instead of first. 
const avgDataToHTML = function(data, type) {
    let button = document.getElementById('update');
    button.className = `${type}`;
    let htmlString = `
                        <div class="table" id="t23">
                        <table>
                            <tr>
                            <th>Nr.</th><th>Measurement Day</th><th>Measurement Time</th><th>Measurement Value</th>
                            </tr>`;

    let counter = 1;
    for(let i = data.length-1; i >= 0; i--){
        let d = data[i];
        let date = d.date_time;
        let measurementDay = date.substring(0, date.indexOf('T'));
        let measurementTime = date.substring(date.indexOf('T')+1, date.indexOf('.'));
        let [year, month, day] = measurementDay.split('-');
        measurementDay = [day, month, year].join('-');
        let measurementValue = Object.values(d)[1];
        htmlString += `<tr>
                        <td>${counter}</td>
                        <td>${measurementDay}</td>
                        <td>${measurementTime}</td>
                        <td>${measurementValue}</td>
                       </tr>`;
        counter++;
    }
    htmlString+='</table></div>';
    return htmlString;
}

//Gets the latest 500 measurements and filters the last 25 measurements, or less if there is no 25.
const mainDataToSpecificType = function(data, type) {
    let count = 1;
    let results = [];
    for(let i = 0; i < data.length; i++){
        let d = data[i];
        let measurementType = Object.keys(d.data)[0];

        if(type == measurementType) {
            results.push(d);
            count++;
        }

        if (count > 25)
            break;
    }
    return results
}

//Creates the HTML String from the last 500 measurements into the specific type by calling mainDataToSpecificType()
const dataToHTMLSpecific= function(data, type) {
    let button = document.getElementById('update');
    button.className = 'view1';
    let htmlString = `
                        <div class="table" id="t1">
                        <table>
                        <tr>
                        <th>Nr.</th><th>Measurement Day</th><th>Measurement Time</th><th>Measurement Value</th>
                        </tr>`;

    let results = mainDataToSpecificType(data, type); 
    for(let i = 0; i < results.length; i++){
        let d = results[i];
        let date = d.date_time;
        let measurementDay = date.substring(0, date.indexOf('T'));
        let measurementTime = date.substring(date.indexOf('T')+1, date.indexOf('.'));
        let [year, month, day] = measurementDay.split('-');
        measurementDay = [day, month, year].join('-');
        let measurementValue = Object.values(d.data);
        htmlString += `
                    <tr>
                        <td>${i+1}</td>
                        <td>${measurementDay}</td>
                        <td>${measurementTime}</td>
                        <td>${measurementValue}</td>
                    </tr>
            `;
    }
    htmlString+='</table></div>';
    return htmlString;
}

/*
    INFO VIEW 
*/

//Creates the HTML String for the information page
const infoViewHtml = function() {
    let infoHtml = `<div class="author">
                    <h1>Author Info</h1>
                        <div id="info-content">
                            <table id="info-text">
                            <tr>
                                <td id="info-title">Name:</td> 
                                <td>Tomas Glavina</td>
                            </tr><tr>
                                <td id="info-title">Email:</td>                         
                                <td>tomas.glavina@tuni.fi</td>
                            </tr><tr>
                                <td id="info-title"> Course Implementation:</td>  
                                <td>5G00DM03-3005</td>
                            </tr></table>
                            <img id="me-inca" src="tomas-inca.jpeg" alt="me and my dog" width= "450" height="600">
                            <div id="info-pic">
                            <h2>About the page functionality</h2>
                            <p>The page consists of a navigation bar and the weather data displayed. On load, it launches the Main View, the latest 30 measurements of all types. 
                            Then the "More" button is a dropdown menu which you can use to select a specific measurement of you liking. All views have an "Update" button to update the data without needing to reload the page.
                            Also, the specific views (Temperature, Wind Speed and the More section) contain a "Time Interval" dropdown menu that allows you to chose different intervals.</p> 
                                <h2>Information about pictures:</h2>
                                <p> Background picture: "Column Clouds" | Free to Use 
                                <p> Link: https://www.pexels.com/photo/beautiful-clouds-cloudy-dramatic-209831/
                                <p> Self Picture with my dog. | Rights Reserved. </p> 
                            </div>
                       </div>
                    </div>`;
    return infoHtml;
}


/* 
    *ONLY UI RELATED JS FUNCTIONS* 
Most actions are made into functions for easier code reading 
For example all hiding and showing buttons, as well as updating their event listener
are a function each seperatly

Also for ease of use and more flexibility, many functions, such as chartIt() or 
updateAVGButton() uses a lot of parameters, so all views and different type of measurements can call it and 
no need for 10 different functions that only change the URL of the data or the amount of measurements.

Also, when calling views, they all have viewType parameter, which can be 1, 2 or 3. 1 is for the main url, where the data values
is obtained by Objects.values(d.data);, where ase viewType 2 and 3 gets the data from the specifc url, which have a different JSON format
(the data is not inside another object) so here we send the indexValue which should be 2 or 1.

*/

const DATA_SOURCE = "http://webapi19sa-1.course.tamk.cloud/v1/weather/";

//*Making the chart global so all functions can modify as needed.
let myChart;

//*Sets up the main view, by getting the right buttons, hiding the chart and making the table
const viewOne = async function () {
    //Updating the UI
    showUpdateButton();
    hideDropdownMenu();
    hideChart();
    updateButton("update", viewOne);

    //Setting the content into the page
    setMainTitle();
    const e = document.getElementById("data");
    let data = await getData(DATA_SOURCE);
    e.innerHTML = dataToHtmlViewOne(data, 30);
};


//Both viewTwo and viewThree call specificView for their page set up, only changing the url 
const viewTwo = async function () {
    const temperature_data = 'temperature';
    specificView(temperature_data, 1);
};

const viewThree = async function () {
    const windSpeed = "wind_speed"; 
    specificView(windSpeed, 1);
};


const specificView = async function(measurementType, viewType ){
   //Updating the UI listeners
    showAllButtons();
    updateButton("update", function(){
        specificView(measurementType, viewType);
    });
    updateButton('now', function(){
        specificView(measurementType, viewType);
    });
    updateAVGButton('24last', avgView, measurementType, 23, viewType);
    updateAVGButton('48last', avgView, measurementType, 47, viewType);
    updateAVGButton('72last', avgView, measurementType, 71, viewType);
    updateAVGButton('last_week', avgView, measurementType, 167, viewType);

    //Seting up the page according to the viewType sent
    setSpecificTitle(measurementType);
    let data;
    
    /*
        viewType 1 is for last 20 measurements for view 2 and 3. 
        viewType 2 is for the last 25 measurements in the "More" section (view 5)
    */
    if(viewType == 1){
        let url = DATA_SOURCE + measurementType;
        data = await getData(url);
        const e = document.getElementById("data");
        e.innerHTML = dataToHtmlViewTwoThree(data, measurementType); 
        chartIt(data, measurementType, 1, 2, 'bar');   

    } else if(viewType == 2) {
        data = await getData(DATA_SOURCE);
        const e = document.getElementById("data");
        let dataSpecific = dataToHTMLSpecific(data, measurementType);
        e.innerHTML = dataSpecific;
        let dataToChart = mainDataToSpecificType(data, measurementType);
        chartIt(dataToChart, measurementType, 3, 0, 'line');
    }
}

/*  Average view requests for the name of the button of the dropdown 
    and puts that button on top, so user can have a reference of which view it is.
*/ 
const avgView = async function (buttonName, type, hours, viewType) {
    let b = document.getElementById(buttonName);
    putButtonOnTop(b);
    updateAVGButton('update', avgView, type, hours);
    setAvgTitle(type, hours+1, 'hours');
    let data  = await hourlyAvgData(DATA_SOURCE, type, hours);
    const e = document.getElementById('data');
    e.innerHTML = avgDataToHTML(data, type);

    if(viewType == 1){
        chartIt(data, type, 1, 1, 'bar');
    } else if (viewType == 2) {
        chartIt(data, type, 1, 1, 'line');
    }
}

//Chart is basic, just asking for the data, type(for title), viewType(to now where the data values are) and the index if needed
//The data of view five (filtering the latest 25 measurements) returns the values as an array of only 1 element, the value
//Example [[2], [3], [4], [6]]. So I need to add a index = [0] to get that value
const createChart = function (data, type, viewType, valueIndex, chartType) {
    const labels = [];
    const values = [];

    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        let date = d.date_time;
        let time = date.substring(11, date.indexOf("."));
        labels.push(time);
        if(viewType == 1){
            values.push(Object.values(d)[valueIndex]);
        } else if(viewType == 3) {
            values.push(Object.values(d.data)[0])
        } else {
            values.push(Object.values(d.data));
        }
    }

    const toChart = {
        labels: labels,
        datasets: [
            {
                label: `${type}`,
                backgroundColor: "#74BDCB",
                borderColor: "#FFF",
                data: values,
            },
        ],
    };

    let config = {
        type: chartType,
        data: toChart,
        options: {
            scales:{
                y:{
                    ticks: {
                    color: '#FFF'
                    }
                },
                x:{
                    ticks: {
                        color: '#FFF'
                    }
                }
            },
            datasets: {
                bar: {
                    hoverBackgroundColor: '#588e99'
                }
            },
            plugins: {
                tooltip: {
                    bodyColor: '#FFF'
                },
                title: {
                    display: true,
                    text: `${type.toUpperCase()}`,
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    color: '#FFF'
                },
                legend: {
                    labels:{
                        font: 'Poppins',
                        color: '#FFF'
                    }
                }
            }
        }
    };

    const ctx = document.getElementById("chart").getContext("2d");

    if(myChart){
        myChart.destroy();
    }

    myChart = new Chart(ctx, config);
};

//Chart it is the function that makes the chart, it basically makes sure that 
//If some view hid the chart before, it makes the display back to "block" and then calls createChart
const chartIt = function(data, type, viewType, valueIndex, chartType) {
    let table = document.getElementById("chart-container");
    table.style.display = "block";
    createChart(data, type, viewType, valueIndex, chartType);
}


const infoView = function () {
    //Hiding every single button and chart from the body except the nav bar
    hideChart();
    hideAllButtons();

    const title = document.getElementById("title");
    title.innerHTML = "";

    const e = document.getElementById("data");
    e.innerHTML = infoViewHtml();
};


/*
        UI Functions related to Buttons, DropDown Menus and Chart
*/

//Hiding or showing the buttons, dropdown menus or the chart

const showUpdateButton = function() {
    const bc = document.getElementById("button-container");
    bc.style.display = "flex";
}

const showAllButtons = function() {
    const bc = document.getElementById("button-container");
    bc.style.display = "flex";

    const dropdown = document.getElementById('dd');
    dropdown.style.display = 'inline-block';

    const typeDDMenu = document.getElementById('dd-type');
    typeDDMenu.style.display ='inline-block';

}

const hideDropdownMenu = function() {
    const dropdown = document.getElementById('dd');
    dropdown.style.display = 'none';
}

const hideAllButtons = function() {
    const bc = document.getElementById("button-container");
    bc.style.display = "none";
}

const hideChart = function() {
    if (myChart) {
        myChart.destroy();
    }
    const table = document.getElementById("chart-container");
    table.style.display = "none";
}


//Button Event Listener Updaters

const updateButton = function(name, view){
    let button = document.getElementById(name);
    let newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    newButton.addEventListener("click", view, false);
    newButton.addEventListener('click', function() {
        if(name == 'now') {
        putButtonOnTop(newButton);
    }}, false);
}

const updateAVGButton = function(name, view, type, hours, viewType){
    let button = document.getElementById(name);
    let newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    newButton.addEventListener("click", function() {
        view(name, type, hours, viewType);
    }, false);
};

const putButtonOnTop = function(button) {
    let ddButton = document.getElementById('mainDDButton');
    ddButton.innerHTML = button.innerHTML;
}


//Navigation bar button event listeners!

const mainView = document.querySelectorAll(".view1");
mainView.forEach((b) => {
    b.addEventListener("click", viewOne, false);
});

const temp = document.querySelectorAll(".temperature");
temp.forEach((button) => {
    button.addEventListener("click", viewTwo, false);
    button.addEventListener('click', function() {
        let b = document.getElementById('mainDDButton');
        b.innerHTML = '<span>Time Interval</span>';
    });
});

const rain = document.querySelectorAll(".rain");
rain.forEach((button) => {
    button.addEventListener("click", viewThree, false);
    button.addEventListener('click', function() {
        let b = document.getElementById('mainDDButton');
        b.innerHTML = '<span>Time Interval</span>';
    });
});

//Getting each button of the More Dropdown menu to get the view of the button that was clicked
let moreButtons = document.querySelectorAll('button');
moreButtons.forEach((i) => {
    if(i.className == 'type-button'){
        i.addEventListener('click', function() {
        specificView(i.id, 2);
        });
    }
});

const infoAuthor = document.querySelectorAll(".info");
infoAuthor.forEach((button) => {
    button.addEventListener("click", infoView, false);
});

//Setting the view as viewOne when on load.
Object.onload = viewOne();