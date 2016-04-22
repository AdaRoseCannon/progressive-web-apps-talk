---
layout: post
title: Push Notifications and Progressive Web Apps
description: First draft of progressive webapp
image: https://ada.is/progressive-web-apps-talk/images/FinancialTimes_G-FTUS_Balloon_LordMayorsAppeal.jpg
script: https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js
script1: scripts/content/LoaPN.js
---

# Life of a Push Notification

[Convert to Slide Deck](#aslides)

Talk plan for SDC
Length 15-15mins, with demo.

## Introduction

I'm Ada Edwards from the Financial Times, I'm here to talk about Progressive Web Apps.

## **Note to self:** Speak slowly no one can understand your accent.

Firstly a heads up this will be pretty code heavy but the notes are online so you can follow along or read later.

I'd like to ask some questions before I start.

* Who here is a primarily a native app developer?
  * Who here is a native app developer who primarily uses web tech in a wrapper like Cordova?
* Who here is primarily a Web Developer?
  * Who here has built a progressive Web App before?

<blockquote class="dark" id="splash-slide" style="background-image: url('images/bird1.jpg');">
<h1>{{ site.name }}</h1>
<div class="labs-logo"></div>
<h3>{{ site.description }}</h3>
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

## **Note to self**: Remember to **read the descriptions** don't just rush through!

A progressive web app is a type of website which exhibits certain *app-like* properties.

(Mind map slide)

* **✈** - **Offline first** - The app must be capable of starting offline and still display useful information. With no No ‘browser-like’ elements or page loading behaviour
* **<span class="home-screen-icon">🐵</span>** - **An icon on the homescreen** - some browsers will prompt for this if it fulfills certain conditions others will not.
* **📱💻** - **Responsive** - Perfectly filling the screen, These sites are primarily aimed at mobile and tablets so will need to respond to the plethera of screen sizes. They should also just work as desktop websites too.
* **https://** - **On the open web** - Not locked in to any browser or app store.
* **👉** - **Touch capable** - An interface designed for touch with Gesture interaction
* **🔔** - **Push Notifications** - The ability to receive notifications when the app is not running. Not applicable for everyone but is very app-like
* **e 🍏** - **Progressive** - It needs to still work on platforms which may not support installing or service workers yet.

http://labs.ft.com/2012/06/what-exactly-is-an-app/

* Were going to explore creating push notifications.

<blockquote class="a-slides_slide-content" style="height: 661px;"><svg width="887" height="661"><line class="link" x1="443.5" y1="330.5" x2="403.9572407972903" y2="570.5806086451331"></line><line class="link" x1="443.5" y1="330.5" x2="228.15818899594174" y2="444.108749139755"></line><line class="link" x1="443.5" y1="330.5" x2="224.11106509107583" y2="224.95466908867178"></line><line class="link" x1="443.5" y1="330.5" x2="399.91996363779634" y2="90.84298002504529"></line><line class="link" x1="443.5" y1="330.5" x2="605.3781005532702" y2="148.60175172671623"></line><line class="link" x1="443.5" y1="330.5" x2="686.5415655555497" y2="344.7672486096294"></line><line class="link" x1="443.5" y1="330.5" x2="596.8422417555993" y2="519.2969713950393"></line></svg><span class="node" style="transform: translate(443.5px, 330.5px) translate(-50%, -50%);">Appiness</span><span class="node" style="transform: translate(403.957px, 570.581px) translate(-50%, -50%);">✈</span><span class="node" style="transform: translate(228.158px, 444.109px) translate(-50%, -50%);"><span class="home-screen-icon">🐵</span></span><span class="node" style="transform: translate(224.111px, 224.955px) translate(-50%, -50%);">📱💻</span><span class="node" style="transform: translate(399.92px, 90.843px) translate(-50%, -50%);">http://</span><span class="node" style="transform: translate(605.378px, 148.602px) translate(-50%, -50%);">👉</span><span class="node" style="transform: translate(686.542px, 344.767px) translate(-50%, -50%);">🔔</span><span class="node" style="transform: translate(596.842px, 519.297px) translate(-50%, -50%);"><span style="font-size: 1.5em;">e</span> 🍏</span></blockquote>

## Prerequisites for a push notification

* Specifically we are looking at producing a web app for the **Chromium 44 based** Samsung browser.
* Chrome requires a non standard parameter in the Web App manifest before you can even ask for notifications so we will start there.

<blockquote class="dark" id="splash-slide" style="background-image: url('images/nest.jpg');">
<h1>Prerequisites for a push notification</h1>
</blockquote>

## Web App Manifest

This is an example Web App manifest for a demo I built for this talk.

The Web App Manifest defines various properties of a Web App, e.g.

* the name on the home screen
* how the app should orientate itself
*  whether to hide the browser chrome i.e. whether it looks like a native app, rather than a web page when launched from the home screen.

The top part of the manifest down to the line break is standard.

It defines an icon, and the URL the app should use to start, in this case I add a ?standalone suffix for detecting installs with Analytics.

But the last three properties are Chrome specific, the one pertinent to push notifications is `gcm_sender_id` without this the app won't even try prompting for push notifications.

The GCM in gcm_sender_id stands for Google Cloud Messaging.

Google cloud messaging handles all of the push notifications for Chrome behind the scenes.

So we need to set this up before we can begin.

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

## Google Cloud Messaging

* Google Cloud Messaging handles the push notifications.
* Which requires a google developer account to use.
* It is free.
* Use this website to set up a project and get an API key for `Google Cloud Messaging`
* Write down this API key you'll need it later.

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

This is the same slide as earlier.

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

A worker is a piece of JavaScript which runs in a seperate thread to your main page.

The service worker is a special shared worker.

It acts like a proxy between browser tabs and the larger web allowing one to rewrite requests and responses on the fly.

If often gets compared to AppCache but being a worker it can be used much more usefully.

The service worker (and by extension push notifications) are unavailble on iOS but you can progressively enhance offline support by using AppCache.

The service worker will displace AppCache when it is installed.

<blockquote class="dark" id="splash-slide" style="background-image: url('images/bird5.jpg');">
<h1>Setting up the Service Worker</h1>
</blockquote>

## The Service

Once it is installed:

The service worker can outlive your open tabs and the browser will start your service worker when it receives a push notification.

One can use Service Workers to make your Web App work offline, by intercepting requests and serving them from the cache whilst quietly updating the cache in the background.

This will make your site robust on poor wireless networks, e.g. conferences or whilst roaming and speed up access to Cached content.

The service worker is only available over https because it's so powerful. On http a malicious third-party could change your site and cache it forever

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

1. The user has requested a push notification subscription via a click event.
1. We show a spinner on the banner to show something is going on.

1. Firstly we trigger subscribe on the service worker registration.
1. This has an optional parameter. Where optional means include it if you want it to work.
1. "userVisibleOnly indicates that the push subscription will only be used for push messages whose effect is made visible to the user, for example by displaying a Web Notification. "

2. At this point if we haven't already got push permission the browser will request it
2. if all was successful great, we're done. Hide the banner.
2. We can post the notification details to the server for using later.

3. Otherwise something went wrong, either the user refused to allow push notifications.
3. Or we missed a step setting everything up.

4. Finally remove the spinner from the banner

> client/scripts/lib/push-notifications.js
>
> ```javascript
> // Make the banner semi transparent so it is clear something is happening
> pushBanner.classList.add('working');
>
> // get the serverWorkerRegistration object from the earlier instantiation promise
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
> 		notify.warn('Permission for Notifications was denied');
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

# The subscription details.

The subscription details provide an endpoint which the server side can query to send a push notification.

We'll fire this up to the server to use later.

> ```json
> {
>  "endpoint": "http://example.com/some/uuid"
> }
>```
>
> In this case the url looks something like:
>
> <span style="word-break: break-all; font-family: monospace; font-size: 0.8em;">"https://android.googleapis.com/gcm/send/
> cz6YgbRXHAc:APA91bGWtm35_kAQsZEn_Ye…EVXj1
> MDXGulbtBWJYw4AGcIWXq7p5BjhFhnDhMQoqOHRzY
> 9jI_OeOn_DQ5W_cYD5tCDDdjOD7d"</span>
>
> https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription

# Sending a push notification

Now we have an endpoint we can use to fire off notifications when ever we want.

Each endpoint will provide a different address, for the case of Chrome and the Samsung browser it's google cloud messaging.

This is where we break out the API key we got when setting up our project for Google Cloud Messaging.

<blockquote class="dark" style="background-image: url('images/bird2.jpg');">
<h1>Sending a push notification</h1>
</blockquote>

# Sending a push notification Details

The google one is handled a little differently you can't just fire a request at that URL to get a push notification.

You have to form a post request with your API key in the header and all of the final part of the url in the body.

Here it is as a cURL request.

> cURL
>
> ```bash
> curl --header "Authorization: key=AIzaSyAc2e8MeZHA5NfhPANea01wnyeQD7uVY0c" --header "Content-Type: application/json" https://android.googleapis.com/gcm/send -d "{\"registration\_ids\":[\"APA91bE9DAy6\_p9bZ9I58rixOv-ya6PsNMi9Nh5VfV4lpXGw1wS6kxrkQbowwBu17ryjGO0ExDlp-S-mCiwKc5HmVNbyVfylhgwITXBYsmSszpK0LpCxr9Cc3RgxqZD7614SqDokwsc3vIEXkaT8OPIM-mnGMRYG1-hsarEU4coJWNjdFP16gWs\"]}"
>```
> (not a real API key)

# Code fetch

It makese more sense when broken down into a fetch request.

> Isomorphic fetch in a node.js server
>
>```javascript
>
> // query the db for my subscription id. (The long string at the end of the endpoint)
> const subscriptionId = getSubscriptionIdForUser('lady_ada_king');
>
> // Get API key from environment variable.
> const GCM_KEY = process.env['GCM_API_KEY'];
>
> const fetch = require('node-fetch');
>
> // Set the api key in the header
> const headers = new fetch.Headers({
> 	'Content-Type': 'application/json',
> 	Authorization: `key=${GCM_KEY}`
> });
>
> // Request push notification from Google Cloud Messaging
> fetch('https://android.googleapis.com/gcm/send', {
> 	method: 'POST',
> 	headers: headers,
> 	body: JSON.stringify({
> 		registration_ids: [subscriptionId]
> 	})
> });
>```

# Receiving push notifications

When the client receiving the response from the Push Notification Server it does not go to the window.

Which makes sense because there could be more (or less) than one window and all windows share the same service worker.

If there are no open windows and the service worker is not running, when a push notification arrives,

The browser will even fire up the service worker just to handle the notification.

<blockquote class="dark" style="background-image: url('images/baby-birds.jpg');">
<h1>Receiving Push Notifications</h1>
</blockquote>

# Receiving push notifications service worker (code).

So this code runs in the service worker to handle push notifications.

Sorry this is the last long chunk of code.

Then I can show it to you working.

1. This takes place in the Event Listener for push events.
1. When the phone receives a push notification for this app it fires this event on the service worker.
1. The service worker then does two things.
  1. Asks any open windows to check for new messages.
  1. Displays a push notification to the user.
1. We haven't sent any information with the notification we will get the latest message from the api.
1. We will then format the message as a notification.
1. To refresh the pages, we query for open windows.
1. then we sent a push message
1. The page can trigger an update when it gets it.
1. Listen to this message with `navigator.serviceWorker.addEventListener('message', function)`

1. The final part is what to do when the user interacts with the click
1. Here we close the notification (you don't have to)
1. try to focus an existing window
1. or open a new one

> In the service worker:
>
> ```javascript
> // Setup Event Listener
> self.addEventListener('push', function(event) {
>
>	// The event is completed when we have
>	// Triggered a refresh on any open windows
> 	// Display a notification
> 	event.waitUntil(
>		Promise.all([
>			refreshOpenWindows(),
> 			getMessageDetails().then(details => self.registration.showNotification(details.title, details))
>		])
> 	);
> });
>
> // Function for retreiving latest message,
> // returns a promise.
> function getMessage() {
> 	return fetchLatestMessageFromAPI()
>		.then(function (data) {
>			return {
>				title: data.user + 'said: ',
>				body: data.message,
>				icon: '/my-app-logo-192x192.png'
>			};
>		});
> }
>
> // Find any open windows and get them to update,
> // In this case I have has change listeners but
> // window.postMessage should work too.
> //
> // One way of triggering UI updates without using
> // sockets or polling
> function refreshOpenWindows() {
> 	return clients.matchAll({
> 		type: 'window'
> 	})
> 	.then(function (windows) {
> 		windows.forEach(function (w) {
> 			w.postMessage({action: 'refresh'});
> 		});
> 	});
> }
>
> // We can even handle how it behaves on click.
> self.addEventListener('notificationclick', function(event) {
>
> 	// Close the notification
> 	event.notification.close();
>
> 	// This looks to see if any windows are open and tries to focus one.
> 	// Otherwise it just opens a new window.
> 	event.waitUntil(clients.matchAll({
> 		type: 'window'
> 	}).then(function(clientList) {
> 		for (let i = 0; i < clientList.length; i++) {
> 			const client = clientList[i];
> 			if ('focus' in client) {
> 				return client.focus();
> 			}
> 		}
> 		if (clients.openWindow) return clients.openWindow('/');
> 	}));
> });
> ```

# Demo

> <p><video src="images/demo.mp4" autoplay="false" preload="true" controls="true"></video></p>

# Summary of what we covered

> 1. The Web now supports making Apps. (It's fun)
> 1. Making a WebApp requires https.
> 1. A web app manifest describes your app.
> 1. A service worker or falling back to AppCache can make it work offline.
> 1. A service worker allows you to send push notifications.

## Thanks

Thank you for listening I hope you have a successful app

<blockquote class="dark" style="background-image: url('images/FinancialTimes_G-FTUS_Balloon_LordMayorsAppeal.jpg'); background-color: rgba(107, 107, 123, 0.8) !important;">
<h1>Thank you for listening</h1>
</blockquote>

> # Good Reading
> Loads on MDN, this covers lot though: https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Using_the_Push_API
>
> # Image Sources
> * Wikimedia
> * https://www.flickr.com/photos/dreynolds/6930648214