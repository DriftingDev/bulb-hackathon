//GLOBAL VARS
let list = document.querySelector("#plantResults");
let searchList = document.querySelector("#searchResults")
const proxyURL = "https://secret-savannah-87524.herokuapp.com/"
let domParser = new DOMParser()
let params = {}
let retry = 0

// INDEX PAGE JS

// dynamically renders a list of plants using the passed month and a queried region when
// a month is selected from the drop down in index.html
async function domQuery(selectedMonth) {
  let selectedRegion = document.querySelector("#region").value
  try {
    veggieList = await getVeggieList(selectedRegion, selectedMonth);
    
    list.innerHTML = ""
    veggieList.forEach((item) => {
      listItem = document.createElement("li")

      itemLink = document.createElement("a")
      itemLink.href = `plant.html?plant=${item.toLowerCase()}&month=${selectedMonth}&region=${selectedRegion}`
      itemLink.innerText = item
      
      listItem.appendChild(itemLink)
      list.appendChild(listItem);
    })
  } catch {
    list.innerHTML = ""

    error = document.createElement("h2")
    error.innerText = "There was an error! Try again in a minute";
    list.appendChild(error);
  }
  const urlParams = itemLink.href
}

//queries the ABC site to build a list of plants according to the passed month and region.
async function getVeggieList(region, month) {
  let abcUrl = "https://www.abc.net.au/gardening/vegie-guide-zones/9796680"
  let queryDOM = await fetch(proxyURL + abcUrl)
    .then(resp => resp.text())
    .then(result => domParser.parseFromString(result, "text/html"));
  
  let linkList = Array.from(queryDOM.querySelectorAll("a"));
  let filteredList = linkList.filter(a => new RegExp("\\b" + region + "\\b").test(a.href));
  let link = filteredList[0].href.slice(21);

  abcUrl = "https://www.abc.net.au" + link;
  queryDOM = await fetch(proxyURL + abcUrl)
    .then(resp => resp.text())
    .then(result => domParser.parseFromString(result, "text/html"));

  linkList = Array.from(queryDOM.querySelectorAll("a"));
  filteredList = linkList.filter(a => new RegExp("\\b" + month + "\\b").test(a.href));
  link = filteredList[0].href.slice(21);
  
  abcUrl = "https://www.abc.net.au" + link;
  queryDOM = await fetch(proxyURL + abcUrl)
    .then(resp => resp.text())
    .then(result => domParser.parseFromString(result, "text/html"));

  let plantList = Array.from(queryDOM.querySelector("#comp-rich-text5").querySelectorAll("a"));
  return plantList.map(a => a.innerText)
  
}


async function searchFunction(event) {
  event.preventDefault();
  let searchTerm = document.querySelector("#search").value
  let searchDOM = await fetch(proxyURL + "https://www.growstuff.org/crops/search?term=" + searchTerm)
    .then(resp => resp.text())
    .then(result => domParser.parseFromString(result, "text/html"));
  
  let results = searchDOM.querySelectorAll(".card")

  searchListBuilder(results);
}

function searchListBuilder(nodeList) {
  searchList.innerHTML = ""
  if(nodeList.length === 0) {
    searchList.innerHTML = `
    <h2>No results Found!</h2>
    `
  } else {
    nodeList.forEach((node) => {
      console.log(node)
      title = node.querySelector("h3").querySelector("a").innerText
      listItem = document.createElement("li")

      itemLink = document.createElement("a")
      itemLink.href = `plant.html?plant=${title}&month=unspecified&region=unspecified`
      itemLink.innerText = title
      
      listItem.appendChild(itemLink)
      searchList.appendChild(listItem);
    })
  }
} 

//Resets the month each time the region is changed.
let resetMonth = () => {
  document.querySelector("#month").value = "nil"
  list.innerHTML = ""
}

//PLANT PAGE JS

//Searches for matches of the listed plant using the growstuff search bar remotely.
//If nothing turns up, it tries again using only the first word (if there is more than one word,
// otherwise just searches the same term again.)
async function listSearcher(params) {
  let searchDOM = await fetch(proxyURL + "https://www.growstuff.org/crops/search?term=" + params["plant"])
    .then(resp => resp.text())
    .then(result => domParser.parseFromString(result, "text/html"));

    try {
    let link = searchDOM.querySelectorAll(".card")[0].querySelector("a").href.slice(21)
    let data = await fetch(proxyURL + "https://www.growstuff.org" + link + ".json")
    .then(resp => resp.json())

    console.log("we found a thing")
    return data
    
  } catch {
    
    if(retry > 0) {
      console.log("the thing still isn't here")
      retry = 0
      return null
    } else {
      console.log("couldn't find the thing first try, trying again")
      retry++
      listSearcher(params["plant"].split(" ")[0])
    }
    
  }
}

//Retrieves the params and returns the data or a null value
var getParams = function (windowUrl) {
  params = {};
  var parser = document.createElement('a');
  parser.href = windowUrl;
  var query = parser.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    params[pair[0]] = decodeURIComponent(pair[1]);
  }

  return params
};

async function pageContent() {
  const params = getParams(window.location.href)
  

  let plantName = document.querySelector(".plantName");
  let plantDescription = document.querySelector(".plantDescription");
  let image = document.querySelector(".image")
  let spacingDisp = document.querySelector(".spacingDisp")
  let plantHeight = document.querySelector(".plantHeight")
  let sun = document.querySelector(".sun")
  let scientificName = document.querySelector(".scientificName");
  let sowingMethod = document.querySelector(".sowingMethod");
  let harvest = document.querySelector(".harvest");


  const proxyURL = "https://secret-savannah-87524.herokuapp.com/"
  let url = "https://www.growstuff.org/crops"

  // let spacingCalc;
  // let dateCalc;
  const data = await listSearcher(params)

  if (data) {
    slug = data.slug
    $.getJSON(`${proxyURL+url}/${slug}.json`, ({ name, openfarm_data: { attributes }, median_days_to_first_harvest, scientific_names }) => {
      const { description, height, sun_requirements, sowing_method, main_image_path, row_spacing } = attributes;
      spacingCalc = row_spacing;
      dateCalc = median_days_to_first_harvest;
      plantName.textContent = name;
      scientificName.textContent = `Scientific name: ${scientific_names[0].name}`;
      plantDescription.textContent = `Description: ${description}`;
      image.src = main_image_path;
      spacingDisp.textContent = `Spacing: ${row_spacing}cm`;
      plantHeight.textContent = `Height: ${height}cm`;
      sun.textContent = `Sun requirements: ${sun_requirements}`;
      sowingMethod.textContent = `Sowing method: ${sowing_method}`;
      harvest.textContent = `Harvest from: ${median_days_to_first_harvest} days`;
        
    });
  } else {
    errorMsg()
    hideCalcs()
  }
}


function errorMsg() {
  var temp = document.getElementById("errorTemplate");
  var clon = temp.content.cloneNode(true);
  document.body.appendChild(clon);
}

function hideCalcs() {
  var areaCalc = document.getElementById("areaCalculator");
  var dateCalc = document.getElementById("dateCalculator");
  var calculators = document.getElementById("calculators");

  calculators.innerHTML= "";
}


  const areaButton = document.querySelector('.area-calculator-button');
  const inputForArea = document.querySelector('#area-calculator');

  const areaCalculator = (area, space) => {

      return `${area / space} plant/s will fit in this area.`
  };

  areaButton.addEventListener('click', () => document.querySelector('.displayArea').innerHTML = areaCalculator(inputForArea.value, spacingCalc));


  const dateButton = document.querySelector('.date-calculator-button');
  const inputForDate = document.querySelector('#date-calculator');


  const harvestCalc = function(date) {
      const formatDate = new Date(date);
      const dateToHarvest = new Date(formatDate.setDate(formatDate.getDate() + dateCalc))
      return `Harvest from ${dateToHarvest.toDateString()}`;
  }

  dateButton.addEventListener('click', () => document.querySelector('.displayDate').innerHTML = harvestCalc(inputForDate.value));





