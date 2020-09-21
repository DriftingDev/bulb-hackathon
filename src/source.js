async function domQuery(selectedMonth) {
  let selectedRegion = document.querySelector("#region").value
  console.log(selectedRegion);
  console.log(selectedMonth);
  veggieList = await getVeggieList(selectedRegion, selectedMonth);
  
  
}

async function getVeggieList(region, month) {
  let domParser = new DOMParser()
  const proxyURL = "https://cors-anywhere.herokuapp.com/"
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