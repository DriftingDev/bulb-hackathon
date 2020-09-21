let list = document.querySelector("#plantResults");

async function domQuery(selectedMonth) {
  let selectedRegion = document.querySelector("#region").value
  try {
    veggieList = await getVeggieList(selectedRegion, selectedMonth);
    
    list.innerHTML = ""
    veggieList.forEach((item) => {
      listItem = document.createElement("li")

      itemLink = document.createElement("a")
      itemLink.href = `plant.html?plant=${item}`
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

async function getVeggieList(region, month) {
  let domParser = new DOMParser()
  const proxyURL = "https://secret-savannah-87524.herokuapp.com/"
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

let resetMonth = () => {
  document.querySelector("#month").value = "nil"
  list.innerHTML = ""
}