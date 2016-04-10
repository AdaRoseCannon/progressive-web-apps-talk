'use strict';
/* global d3 */

window.aSlidesSlideData = {
	'slide-what-is-a-progressive-web-app-': {
		setup() {},
		action: function *() {

			const w = this.clientWidth;
			const h = this.clientHeight;
			const d = 0.4 * Math.min(w,h);

			const lines = d3.select(this).append('svg')
				.attr('width', w)
				.attr('height', h);

			const labels = d3.select(this);

			const item = [
				'✈',
				'<span class="home-screen-icon">🐵</span>',
				'📱💻',
				'http://',
				'👉',
				'🔔'
			];
			const nodes = [{
				label: 'Appiness',
				fixed: true,
				x: w/2,
				y: h/2
			}];
			const links = [];

			const force = d3.layout.force()
				.nodes(nodes)
				.links(links)
				.charge(-400)
				.linkDistance(d)
				.size([w, h])
				.on('tick', tick);


			let node = labels.selectAll('.node');
			let link = lines.selectAll('.link');

			function start () {
				link = link.data(force.links(), d => d.source.id + '-' + d.target.id);
				link.enter().insert('line', '.node').attr('class', 'link');
				link.exit().remove();

				node = node.data(nodes, d => d.id);
				node.enter().append('span').attr('class', 'node').html(d => d.label);
				node.exit().remove();

				force.start();
			}

			function tick() {
				node
				.style('transform', d => `translate(${d.x}px, ${d.y}px) translate(-50%, -50%)`);

				link.attr('x1', d => d.source.x)
					.attr('y1', d => d.source.y)
					.attr('x2', d => d.target.x)
					.attr('y2', d => d.target.y);
			}

			start();

			yield;

			let i = 1;
			for (const o of item) {
				const node = {
					label: o,
					id: String(i++),
					x: d*Math.cos(i * Math.PI/(item.length/2)) + w/2,
					y: d*Math.sin(i * Math.PI/(item.length/2)) + h/2
				};
				nodes.push(node);
				links.push({source: nodes[0], target: node});
				start();
				yield;
			}

			lines
			.style('transform', 'translate(-50%, -50%) scale(0.01)')
			.style('opacity', '0')
			.style('transition', 'transform 1s ease, opacity 1 ease-in');

			node
			.style('background', 'transparent')
			.style('transform', d => `translate(${d.id === '6' ? w/2+'px,'+h/2+'px' : '0,0'}) translate(-50%, -50%) scale(${d.id === '6' ? 5 : 0.001})`)
			.style('opacity', d => d.id === '6' ? 1 : 0)
			.style('transition', 'transform 1s ease, opacity 2s ease-in');

			force.stop();

			yield;
		},
		teardown() {
			this.innerHTML = '';
		}
	},
	'slide-finally-subscribing': {
		setup(){
			this.$$('.hide-after').forEach(n => n.classList.remove('hide-after'));

		},
		action: function *() {
			const codeTarget = this.$('code');
			codeTarget.scrollIntoView();
			const children = Array.from(codeTarget.children);
			for (let i = 0; i < children.length; i++) {
				const n = children[i];
				const n2 = children[i + 2];
				if (n2 && (n2.textContent === 'then' || n2.textContent === 'catch')) {
					n.classList.add('hide-after');
					const scrollTop = this.scrollTop;
					n.scrollIntoViewIfNeeded();
					const newScrollTop = this.scrollTop;
					this.scrollTop = scrollTop;
					scrollTo(this, newScrollTop, 1000);

					yield;
					n.classList.remove('hide-after');
				}
			}
			yield;
		},
		teardown(){
			this.$$('.hide-after').forEach(n => n.classList.remove('hide-after'));
			cancelAnimationFrame(anim);
		}
	}
};

let anim;
function scrollTo(el, newTop, scrollDuration) {
	const oldTop =  el.scrollTop;
    const scrollHeight = oldTop - newTop;
	const scrollStep = Math.PI / ( scrollDuration / 16 );
    const cosParameter = scrollHeight / 2;
    let scrollCount = 0;
	let scrollMargin;
    anim = requestAnimationFrame(function step () {
		if ( Math.abs(el.scrollTop - newTop) > 5 && scrollCount * scrollStep < Math.PI) {
			requestAnimationFrame(step);
			scrollCount = scrollCount + 1;
			scrollMargin = cosParameter - cosParameter * Math.cos( scrollCount * scrollStep );
			el.scrollTop = oldTop - scrollMargin;
		}
    });
}