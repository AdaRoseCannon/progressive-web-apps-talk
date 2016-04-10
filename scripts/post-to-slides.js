/* global $, ASlides*/

/**
 * Turns a normal mrkdown blog posti into a slide deck!!
 * WTH amazing right!!
 */

'use strict';

function addStyle(url){
	const styles = document.createElement('link');
	styles.rel = 'stylesheet';
	styles.type = 'text/css';
	styles.media = 'screen';
	styles.href = url;
	document.getElementsByTagName('head')[0].appendChild(styles);
}

function addScript (url) {
	const p = new Promise(function (resolve, reject) {
		const script = document.createElement('script');
		script.setAttribute('src', url);
		document.head.appendChild(script);
		script.onload = resolve;
		script.onerror = reject;
	});
	function promiseScript () {
		return p;
	};
	promiseScript.promise = p;
	return promiseScript;
}

function init() {
	return Promise.all([
		addScript('https://cdn.rawgit.com/AdaRoseEdwards/dirty-dom/v1.3.1/build/dirty-dom-lib.min.js').promise,
		addScript('https://rawgit.com/AdaRoseEdwards/a-slides/master/build/a-slides.js').promise
	])
	.then(function () {

		addStyle('https://rawgit.com/AdaRoseEdwards/a-slides/master/build/a-slides.css');

		const slideContainer = document.createElement('div').setClassName('a-slides_slide-container');
		let slide;
		let i=0;
		while (slide = $('body > blockquote')) {
			i++;
			let name = '';
			const notes = slide.prevAll();
			const newSlide = document.createElement('div').setClassName('a-slides_slide');
			const notesWrapper = document.createElement('div').setClassName('a-slides_notes');
			slide.classList.add('a-slides_slide-content');
			if (notes[0] && notes[0].tagName.match(/h[0-6]/i)) {
				name = notes[0].textContent.trim().replace(/[^A-Za-z0-9]/ig, '-').toLowerCase();
				name = name + (slideContainer.querySelectorAll(`[data-slide-id="${name}"]`).length || '');
			}
			newSlide.dataset.slideId = 'slide-' + (name || i);
			newSlide.appendChild(slide);
			newSlide.appendChild(notesWrapper);
			notes.forEach(note => notesWrapper.appendChild(note));
			slideContainer.appendChild(newSlide);
		}
		document.body.prependChild(slideContainer);

		document.body.classList.remove('post');
	})
	.then(function () {

		const slideData = window.aSlidesSlideData || [];
		const slideContainer = document.querySelector('.a-slides_slide-container');

		new ASlides(slideData, {
			slideContainer,
			plugins: [
				ASlides.prototype.plugins.markdownTransform, // needs to be run first
				ASlides.prototype.plugins.slideController, // needs to be run before buttons are added to it.
				ASlides.prototype.plugins.deepLinking,
				ASlides.prototype.plugins.interactionKeyboard,
				ASlides.prototype.plugins.interactionTouch({ // has configuration
					use: ['swipe-back']
				}),
				// ASlides.prototype.plugins.bridgeServiceWorker
			]
		});

		if (location.search === '?presentation') {
			slideContainer.classList.add('presentation');
		}

		if (location.search === '?notes') {
			slideContainer.classList.add('hide-presentation');
		}

		return slideContainer;
	});
}

const oldHash = location.hash || false;

if (location.hash === '#aslides' || location.search.indexOf('aslides') !== -1) {
	init().then(slideContainer => {
		if (location.hash === '#aslides' || oldHash === false) {
			slideContainer.fire('a-slides_goto-slide', {slide: 0});
		} else {
			slideContainer.fire('a-slides_goto-slide', {slide: $(`[data-slide-id="${oldHash.substr(1,Infinity)}"]`)});
		}
	});
} else {
	function locationHashChanged() {
		if (location.hash === '#aslides') {
			window.removeEventListener('hashchange', locationHashChanged);
			window.location.hash = oldHash;
			init().then(slideContainer => {
				slideContainer.fire('a-slides_goto-slide', {slide: oldHash ? $(`[data-slide-id="${oldHash.substr(1,Infinity)}"]`) : 0});
			});
		}
	}
	window.addEventListener('hashchange', locationHashChanged);
}
