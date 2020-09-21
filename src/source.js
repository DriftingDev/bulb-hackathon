//GLOBAL VARS
let list = document.querySelector("#plantResults");
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
      itemLink.href = `plant.html?plant=${item.toLowerCase()}`
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
}

//queries the ABC site to build a list of plants according to the passed month and region.
async function getVeggieList(region, month) {
  let url = "https://www.abc.net.au/gardening/vegie-guide-zones/9796680"
  let queryDOM = await fetch(proxyURL + url)
    .then(resp => resp.text())
    .then(result => domParser.parseFromString(result, "text/html"));
  
  let linkList = Array.from(queryDOM.querySelectorAll("a"));
  let filteredList = linkList.filter(a => new RegExp("\\b" + region + "\\b").test(a.href));
  let link = filteredList[0].href.slice(21);

  url = "https://www.abc.net.au" + link;
  queryDOM = await fetch(proxyURL + url)
    .then(resp => resp.text())
    .then(result => domParser.parseFromString(result, "text/html"));

  linkList = Array.from(queryDOM.querySelectorAll("a"));
  filteredList = linkList.filter(a => new RegExp("\\b" + month + "\\b").test(a.href));
  link = filteredList[0].href.slice(21);
  
  url = "https://www.abc.net.au" + link;
  queryDOM = await fetch(proxyURL + url)
    .then(resp => resp.text())
    .then(result => domParser.parseFromString(result, "text/html"));

  let plantList = Array.from(queryDOM.querySelector("#comp-rich-text5").querySelectorAll("a"));
  return plantList.map(a => a.innerText)
  
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
async function searcher(term) {
  let searchDOM = await fetch(proxyURL + "https://www.growstuff.org/crops/search?term=" + term)
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
      searcher(term.split(" ")[0])
    }
    
  }
}

//Retreives the params and returns the data or a null value
var getParamsAndLoad = function (url) {
	params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
  }

  return searcher(params["plant"])
};




