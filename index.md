---
layout: post
title: Progressive Web App V1
description: First draft of progressive webapp stuff
script: https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js
script1: scripts/content/LoaPN.js
---

# Life of a Push Notification

[Convert to Slide Deck](#aslides)

Talk plan for SDC
Length 15-15mins, with demo.
# Plan

## Introduction

I'm Ada Edwards from the Financial Times, I'm here to talk about Progressive Web Apps.

I'd like to ask some questions before I start.

* Who here is a primarily a native app developer?
  * Who here is a native app developer who primarily uses web tech in a wrapper like Cordova?
* Who here is primarily a Web Developer?
  * Who here has built a progressive Web App before?

<blockquote class="dark" id="splash-slide" style="background-image: url('images/bird1.jpg');">
<h1>Progressive Web Apps</h1>
<div class="labs-logo"></div>
<h3>Life of a push notification</h3>
<h2>Ada Rose Edwards - Financial Times</h2>
</blockquote>

## Push Notifications

Progressive Web Apps are not new. The Financial Times chose to use a Web App for digital content delivery on mobile devices since 2012.
Moving to a Web App enabled the same app to ship across platforms using a single distribution channel.
It also allowed us to bypass app stores.
That said it did come with its' own difficulties:
We had to use the infamous appcache to enable offline support.
Difficulties arose when different platforms supported different API features. These differences need a polyfill or the feature should be avoided entirely.
Since that time features have gained support across platforms and new technologies which are useful for Web Apps such as service workers have emerged.

>![First Version of the FT Web App](images/ipad-home.jpg)

## What is a progressive web app?

* A progressive web app is a type of website which exhibits certain *app-like* properties.

(Mind map slide)

* **✈** - **Offline first** - The app must be capable of starting offline and still display useful information. With no No ‘browser-like’ elements or page loading behaviour
* **<span class="home-screen-icon">🐵</span>** - **An icon on the homescreen** - some browsers will prompt for this if it fulfills certain conditions others will not.
* **📱💻** - **Responsive** - Perfectly filling the screen, These sites are primarily aimed at mobile and tablets so will need to respond to the plethera of screen sizes. They should also just work as desktop websites too.
* **http://** - **On the open web** - Not locked in to any browser or app store.
* **👉** - **Touch capable** - An interface designed for touch with Gesture interaction
* **🔔** - **Push Notifications** - Not applicable for everyone but is very app-like

http://labs.ft.com/2012/06/what-exactly-is-an-app/

* Were going to explore creating push notifications.

>

## Prerequisits for a push notification

* Specifically we are looking at producing a web app for the Chromium 44 based Samsung browser.
* Chrome requires a non standard parameter in the Web App manifest before you can even ask for notifications so we will start there.

<blockquote class="dark" id="splash-slide" style="background-image: url('images/nest.jpg');">
<h1>Prerequisits for a push notification</h1>
</blockquote>

## Web App Manifest

This is an example Web App manifest for a demo I built for this talk.

The top part of the manifest down to the line break is standard.

It defines the name on the home screen how the app should orientate itself and whether to hide the browser chrome,
i.e. whether it looks like a native app, rather than a web page when launched from the home screen.

It defines an icon, and the URL the app should use to start, in this case I add a ?standalone suffix for detecting installs with Analytics.

But the last three properties are Chrome specific, the one pertinent to push notifications is `gcm_sender_id` without this the app won't even try prompting for push notifications.

The GCM in gcm_sender_id stands for Google Cloud Messaging and this is where we go next to get our ID

> client/manifest.json:
>
> ```json
{
  "name": "81 Emoji",
  "icons": [
    {
      "src": "launcher-icon-4x.png",
      "sizes": "192x192",
      "type": "image/png",
      "density": 4.0
    }
  ],
  "start_url": "/?standalone",
  "display": "standalone",
>  "orientation": "portrait",
>
>  "gcm_sender_id": "90157766285",
  "background_color": "lavenderblush",
  "theme_color": "lavenderblush"
}
> ```

## Google CLoud Messaging

* Google Cloud Messaging handles the push notifications. Which requires a google developer account.
* Use this website to set up a project and get an API key for `Google Cloud Messaging`

> ## https://console.developers.google.com
> ![Google Cloud Messaging, in the dashboard](images/gcm-dashboard.png)

## Finding your ID

Finding your ID is difficult, it takes me a while to find and I've done it few times before so this is where you find it:

Insert your project ID minus the hash as your `gcm_sender_id`

> ## Finding your Id
>
> Select 'Google Cloud Platform'
>
> ![Finding Your Id](images/finding_gcm_sender_id.png)
> ![Finding Your Id](images/finding_gcm_sender_id2.png)

## Update the JSON

Insert it into your manifest under `gcm_sender_id`:

> client/manifest.json:
>
> ```json
{
  "name": "81 Emoji",
  "icons": [
    {
      "src": "launcher-icon-4x.png",
      "sizes": "192x192",
      "type": "image/png",
      "density": 4.0
    }
  ],
  "start_url": "/?standalone",
  "display": "standalone",
   "orientation": "portrait",
>
   "gcm_sender_id": "90157766285",
  "background_color": "lavenderblush",
  "theme_color": "lavenderblush"
}
> ```

## Setting up a Service Worker

Your app receives push notifications via a Service Worker.

<blockquote class="dark" id="splash-slide" style="background-image: url('images/bird5.jpg');">
<h1>Setting up the Service Worker</h1>
</blockquote>

## The Service Worker

The service worker is a special shared worker. It acts like a proxy between browser tabs and the larger web allowing one to rewrite requests and responses on the fly.
The service worker can outlive your open tabs and the browser will start your service worker when it receives a push notification.

One can use Service Workers to make your Web App work offline, by intercepting requests and serving them from the cache whilst quietly updating the cache in the background.

This will make your site robust on poor wireless networks, e.g. conferences or whilst roaming and speed up access to Cached content.


> ```
                +-------------------------------------------------+
                |                               (Cats)            |
                |    The Internet         )\._.,--....,'``.       |
                |                        /;   _.. \   _\  (`._ ,. |
                |                       `+--+(,_..'++(,_..'`+.;.' |
                +---------------------^--+------------------------+
                                      |  |
+-------------+ +---------------------+--v------------------------+
|             +->                                                 |
|  Cache API  | |   Service Worker                                |
|             <-+                                                 |
|             | +---------+--^-----------------------^--+---------+
|             |           |  |                       |  |
|             | +---------v--+---------+    +--------+--v---------+
|             | |                      |    |                     |
|             +->         Tab 1        |    |        Tab 2        |
|             <-+                      |    |                     |
+-------------+ +----------------------+    +---------------------+
> ```

Starting the service worker is different from starting a regular worker, and it provides a promise for when it's ready to use.

We will delve into the contents of the service worker later when we discus handling push notifications.

> client/scripts/lib/sw.js
>
> ```javascript
> function setUpServiceWorker() {
>
> 	if ('serviceWorker' in navigator) {
>
> 		if (navigator.serviceWorker.controller) {
>
>			// service worker registered.
> 			return navigator.serviceWorker.ready;
> 		} else {
>
>			// service worker not registered
> 			return navigator.serviceWorker.register('/sw.js')
> 			.then(() => navigator.serviceWorker.ready);
> 		}
> 	}
> }
> ```

## Requesting permission to receive push notifications.

Now we have API access and a service worker we can delve into the code and start asking the user to receive the notification.

<blockquote class="dark" id="splash-slide" style="background-image: url('images/bird3.jpg');">
<h1>Requesting Permissions</h1>
</blockquote>

To the user requesting push notification permission is a two-part process.

The first request needs to come from a user interaction such as a 'click' event.

The browser then shows it's own "request permission" box to the user.

>
> ![Ask In App](images/ask1.png)
> Then
> ![Ask In Chrome](images/ask2.png)

## Detecting push notification status

Stepping through the code:

First we want to see whether the client supports notifications and whether we have already subscribed.

If we have subscribed we should update the server with the current push notification details.

In the first run case where we have not subscribed we present a banner which upon being clicked will request permissions.

> client/scripts/lib/push-notifications.js - detecting push notification status
>
> ```javascript
>	swPromise.then(serviceWorkerRegistration =>
		serviceWorkerRegistration.pushManager.getSubscription()
	)
>	.then(subscription => {
>		if (!subscription) {
>			// Not subscribed: show subscribe banner
>			pushBanner.style.display = 'block';
>		} else {
>			// Update server with current info.
>			return api.sendSubscriptionToServer(subscription);
>		}
>	})
>	.catch(e => {
>		// Service workers not supported.
>		console.log('Push notifications not supported.')
>	});
> ```

## Finally Subscribing

Subscribing is more complex but it's not that ugly.

> ```javascript
> // Make the banner semi transparent so it is clear something is happening
> pushBanner.classList.add('working');
>
> swPromise
> .then(
> 	serviceWorkerRegistration =>
>		serviceWorkerRegistration
>		.pushManager
>		.subscribe({
>           // Required parameter
>			userVisibleOnly: true
>		})
> )
> .then(function(subscription) {
>
> 	// Success we're done so hide the banner
> 	pushBanner.style.display = 'none';
> 	return sendSubscriptionToServer(subscription);
> })
> .catch(function(e) {
> 	if (Notification.permission === 'denied') {
>
> 		// reshow the banner to prompt them again
> 		pushBanner.style.display = '';
> 		warn('Permission for Notifications was denied');
> 	} else {
>
> 		// A problem occurred with the subscription; common reasons
> 		// include network errors, and lacking gcm_sender_id and/or
> 		// gcm_user_visible_only in the manifest.
> 		error('Unable to subscribe to push.');
> 		console.log(e);
> 	}
> })
> .then(() => {
>
> 	// Remove the indication that something is happening
> 	pushBanner.classList.remove('working');
> });
> ```

## Thanks

Thank you for listening I hope you have a successful app

> ![FT APP on a Balloon!](images/FinancialTimes_G-FTUS_Balloon_LordMayorsAppeal.jpg)

> # Image Attributions
>
> * https://www.flickr.com/photos/dreynolds/6930648214