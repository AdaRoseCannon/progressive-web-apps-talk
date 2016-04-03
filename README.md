# progressive-web-apps-talk
Talk plan for SDC
Length 15-15mins, with demo.
Qs?

# Key points to mention
 * Progressive WebApps aren't new and are proven to be a viable method of app production.
 * Some browsers may give information prompts to install it but there is currently no defined way of adding ot home screen without guiding the user through it.


# Plan

## Introduction

I'm Ada Edwards from the Financial Times, I'm here to talk about Progressive Web Apps.

## What is a progressive web app?

* A progressive web app is a type of website which exhibits certain properties.

(Mind map slide)

* **Offline first** - The app must be capable of starting offline and still display useful information. With no No ‘browser-like’ elements or page loading behaviour
* **An icon on the homescreen** - some browsers will prompt for this if it fulfills certain conditions others will not.
* **Responsive** - Perfectly filling the screen, These sites are primarily aimed at mobile and tablets so will need to respond to the plethera of screen sizes. They should also just work as desktop websites too.
* **Touch capable** - An interface designed for touch with Gesture interaction
* **On the open web** - Not locked in to any browser or app store.
* ** Push Notifications ** - Not applicable for everyone but is very app-like

http://labs.ft.com/2012/06/what-exactly-is-an-app/

## Are they new?

 * Progressive Web Apps are not new. The FT has been doing it since 2012:

![First Version of the FT Web App](https://raw.githubusercontent.com/AdaRoseEdwards/progressive-web-apps-talk/master/ipad-home.jpg)

 * Since then it has only gotten easier to produce web apps. 
 * A lot of useful web technologies are well supported.

## Technology

Offlining:
* Service Workers - No more AppCache
* Indexed DB'
.* LocalForage
.* CouchDB replication

Touch Capabilities:
 * I like to use Greensock or Hammer.js

Push Notifications:
* Support in Chrome, Firefox and Samsung Web Browser, Requires Service Worker

## Thanks

Thank you for listening I hope you have a successful app

![FT APP on a Balloon!](https://raw.githubusercontent.com/AdaRoseEdwards/progressive-web-apps-talk/master/FinancialTimes_G-FTUS_Balloon_LordMayorsAppeal.jpg)

