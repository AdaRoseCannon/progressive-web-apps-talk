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

I'd like to ask a few questions before I start.

* Who here is a primarily a native app developer?
.* Who here is a native app developer who mostly uses web tech in a wrapper like cordova?
* Who here is mostly a Web Developer?
.* Who here has built a progressive webapp before?

## What is a progressive web app?

* A progressive web app is a type of website which exhibits certain properties.

(Mind map slide)

* **Offline first** - The app must be capable of starting offline and still display useful information. With no No ‘browser-like’ elements or page loading behaviour
* **An icon on the homescreen** - some browsers will prompt for this if it fulfills certain conditions others will not.
* **Responsive** - Perfectly filling the screen, These sites are primarily aimed at mobile and tablets so will need to respond to the plethera of screen sizes. They should also just work as desktop websites too.
* **Touch capable** - An interface designed for touch with Gesture interaction
* **On the open web** - Not locked in to any browser or app store.
* **Push Notifications** - Not applicable for everyone but is very app-like

http://labs.ft.com/2012/06/what-exactly-is-an-app/

## Are they new?

 * Progressive Web Apps are not new. The Financial Times has been using if for it's digital content delivery since 2012:

![First Version of the FT Web App](https://raw.githubusercontent.com/AdaRoseEdwards/progressive-web-apps-talk/master/ipad-home.jpg)

 * Back then we were breaking a lot of new ground and it was very difficult
 * Since then it has gotten easier to produce web apps. 
 * A lot of useful web technologies which facilitate the production of web apps are now widely supported across many platforms.

## Technology

Offlining:
* AppCache - Bad but widely supported
* Service Workers - Support in Chrome, Opera, Firefox and Samsung Web Browser. 
.* Can progressively enhance AppCache if both present
* Indexed DB'
.* LocalForage
.* CouchDB/PouchDB replication

Touch Capabilities:
 * I like to use Greensock or Hammer.js

Push Notifications:
* Support in Chrome, Firefox and Samsung Web Browser, Requires Service Worker

## For this talk I produced a sample web app and describe my thought porcesses between choosing the various tech.

 * The app is a messaging app it sends emojis and small images.
 * To keep it simple it doesn't use any frame works on the front end.
 * It's just an ordinary web page with some javascript.
 * I built it mainly focussed on Samsung Web Browser
 .* Based on Cr44 with some fixes, supports indexedDB, Service Worker, Push Notifications.
 .* All of the lovely tools to build a web app.

## The back end - nothing remarkable.

 * The user information is backed by Redis on Heroku, ideally I would use CouchDB due to it's database replication tech but it is not available on Heroku.
 * HTTPS and Caching and caching layer provided by Cloudflare
 * Twitter oauth using passport.js

## The middle layer - the service worker.

 * The service worker is a web worker which sits between my app and the internet it can intercept requests and act on them accordingly.
 * It acts like a local proxy intercepting and modifying requests.
 * It's primary use is handling caching to show your user cached web pages to allow them to be read offline or to speed up delivery by responding with cached content and updating the cache in the background.
 * It can recieve push notifications and act on them to retrieve information, show notifications or send messages to your web apps front end.

 * In the case of my app I use it to display notifications and trigger updates on the front end, without using sockets or long polling.
 * The image that gets displayed can be any image. For my app whenever I recieve a message I get the url of the image using twemoji and dispaly that. If the sender sends a photo it'll display that.

```
                +-------------------------------------------------+
                |                                                 |
                |    The Internet               (Cats)            |
                |                                                 |
                |                         )\._.,--....,'``.       |
                |                        /;   _.. \   _\  (`._ ,. |
                |                       `+--+(,_..'++(,_..'`+.;.' |
                +---------------------^---------------------------+
                                      |  |
+-------------+ +------------------------v------------------------+
|             | |                                                 |
|  Cache API  | |   Service Worker                                |
|             +->                                                 |
|             | |                                                 |
|             <-+                                                 |
|             | +------------^-----------------------^------------+
|             |           |  |                       |  |
|             | +---------v------------+    +-----------v---------+
|             | |                      |    |                     |
|             +->  Tab 1               |    |    Tab 2            |
|             | |                      |    |                     |
|             <-+                      |    |                     |
+-------------+ +----------------------+    +---------------------+
```

## The client
 * If I was using CouchDB I would use PouchDB which can replicate CouchDB databases. So I could maintain a replica of the user's messages across the frontend and backend. 
 * Instead I am just pulling down messages and using localforage to store them in indexedDB.
 * Touch interactions are mostly handled with just the Web touch events no library there.
 * Draggable Modals and the scrolling messages are handled by the Greensock Draggable and Tweening library. This gave me really smooth animations for that truly native feeling.
 * Important you need to remove the 300ms tap delay you get this for free in Chromium based browsers simply by having a `<meta name="viewport" content="width=device-width">` tag. But for iOS it can be a little tricky but there are libraries to handle it.

## Sending push notifcations
### Limitations
### How to set it up,
**Backend**
 * Google Developer Console
 * Google Cloud Messaging
 * App gives you a url
 * Sync that url with the server
 * May get regenerated so will need to be synced
 * whenever I need to make a push notification I summon this url to use it

**frontend**
 * Service worker recieves it.
 * Triggers refresh on the client
 * SHows notification box

## Thanks

Thank you for listening I hope you have a successful app

![FT APP on a Balloon!](https://raw.githubusercontent.com/AdaRoseEdwards/progressive-web-apps-talk/master/FinancialTimes_G-FTUS_Balloon_LordMayorsAppeal.jpg)

