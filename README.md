# BULB

**A hackathon project by [Adrienne](https://github.com/aes89) & [Nick](https://github.com/nick-ducker)**

****

![Bulb Logo](src/img/logo.png)

## Welcome to Bulb!

A Hackathon project made for CoderAcademy by [@Adrienne_es](https://twitter.com/Adrienne_es) & [@DriftingDev](https://twitter.com/DriftingDev)

## The Challenge

Bulb was built as part of a 3 day hackathon done as part of the curriculum of CoderAcademy

The aim of the hackathon was to create a functional, hosted web application using only HTML and vanilla JS. Styling add-ons were also permitted.

## The App

Bulb is a webscraper/API synthesizer, designed to consolidate planting and harvesting information for household Australian gardeners.

It achieves this through essentially running a web-scraper on the ABC website to compile a list of plants suitable for planting depending on a selected region and month.

From here, Bulb then searches for the plant on the Growstuff API and tries to pull up specific information about that plant.

In it's current version, Bulb can generally find and accurate match 90% of the time, but will sometimes pull up the wrong plant if the search term starts with a general descriptor (such as "sweet") or the scraped plant name contains brackets or is uncommon.

## API's

Bulb utilizes the DOM object of https://www.abc.net.au/gardening/vegie-guide-zones/9796680 and essentially navigates through the site remotely to build lists.

Bulb also uses the https://www.growstuff.org/ API and DOM object to pull specific information and search for that information respectively.
As the API does not have an inbuilt search function in the API, Bulb remotely searches for the queried plant via URL and then uses the returned DOM object to find a result (or lack of one)

## Technologies used

Bulb is built only with HTML, CSS and JS.
However, Bootstrap and Jquery were also used for styling and JSON retrieval.

## Contribute

Bulb is an open source project!
If you want to contribute, feel free to fork the repo and make a pull request. 
Things that still need work:
* JS cleanup and refactor
* Find a better way to search the Growstuff API for the correct result (sometimes when clicking a listed item, you get the wrong result).
* Find a better way to parse strange strings into the Growstuff search bar (Brackets and other special characters tend to break the app).
* Incorporate the images of the zones in a more intuitive way than a pop-up.