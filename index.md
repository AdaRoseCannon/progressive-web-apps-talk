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

<blockquote class="dark" id="splash-slide" style="background-image: url('images/nest.jpg');">
<h1>Prerequisits for a push notification</h1>
</blockquote>

* Specifically we are looking at producing a web app for the Chromium 44 based Samsung browser.
*

## Thanks

Thank you for listening I hope you have a successful app

> ![FT APP on a Balloon!](images/FinancialTimes_G-FTUS_Balloon_LordMayorsAppeal.jpg)
