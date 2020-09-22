//GLOBAL VARS
let list = document.querySelector("#plantResults");
let searchList = document.querySelector("#searchResults")
const proxyURL = "https://secret-savannah-87524.herokuapp.com/"
let domParser = new DOMParser()
let params = {}
let retry = 0

// INDEX PAGE JS

function loader(target) {
  target.innerHTML = `
  <h2>Loading</h2>
  `
}

// dynamically renders a list of plants using the passed month and a queried region when
// a month is selected from the drop down in index.html
async function domQuery() {
  loader(list);

  let selectedRegion = document.querySelector("#region").value
  let selectedMonth = document.querySelector("#month").value
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
}

function urlMatcher(url, term) {
  if(url.match(`/${term}(.*)/`)) {
    regex = "(.*)"
    const match = url.match(term + regex);
    return match[0];
  }
  return null;
}

//queries the ABC site to build a list of plants according to the passed month and region.
async function getVeggieList(region, month) {
  const abcUrl = "https://www.abc.net.au/gardening/vegie-guide-zones/9796680"
  let queryDOM = await fetch(proxyURL + abcUrl)
    .then(resp => resp.text())
    .then(result => domParser.parseFromString(result, "text/html"));
  
  const firstLinkList = Array.from(queryDOM.querySelectorAll("a"));
  let firstFilteredList = firstLinkList.filter(a => new RegExp("\\b" + region + "\\b").test(a.href));
  const regionLink = urlMatcher(firstFilteredList[0].href, "gardening")

  const regionUrl = "https://www.abc.net.au/" + regionLink;
  queryDOM = await fetch(proxyURL + regionUrl)
    .then(resp => resp.text())
    .then(result => domParser.parseFromString(result, "text/html"));

  const secondLinkList = Array.from(queryDOM.querySelectorAll("a"));
  let secondFilteredList = secondLinkList.filter(a => new RegExp("\\b" + month + "\\b").test(a.href));
  const monthLink = urlMatcher(secondFilteredList[0].href, "gardening")
  
  const monthUrl = "https://www.abc.net.au/" + monthLink;
  queryDOM = await fetch(proxyURL + monthUrl)
    .then(resp => resp.text())
    .then(result => domParser.parseFromString(result, "text/html"));

  let plantList = Array.from(queryDOM.querySelector("#comp-rich-text5").querySelectorAll("a"));
  return plantList.map(a => a.innerText)
  
}


async function searchFunction(event) {
  event.preventDefault();
  loader(searchList);

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
function resetMonth() {
  document.querySelector("#month").value = "nil";
  document.querySelector("#month").focus()
  list.innerHTML = "";
}

function removeCollapse() {
  document.querySelector("#region").removeAttribute('data-toggle')
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
      listSearcher(term.split(" ")[0])
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




