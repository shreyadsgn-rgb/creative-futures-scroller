# Text Scroll on Reveal — Undissolve (reference source, NOT directly runnable)

Original: "No JS char by char on scroll reveal effects" by Ana Tudor (thebabydino)
https://codepen.io/thebabydino/pen/KKLWBJZ
No stated license on the pen — treat as reference/learning material, not
something to publish verbatim in the final site.

## Why this file is different from the others

The other 5 reference files in this folder are plain, self-contained
HTML/CSS/JS you can just double-click and run. This one genuinely isn't —
and I didn't want to fake a "simplified" version and hand you something
that quietly doesn't work the same way. Here's why:

- The **HTML** is written in **Pug** (a templating language), which uses
  a JavaScript loop to auto-generate SEVEN different text-reveal effects,
  each built from a different combination of up to 10 layered SVG filter
  primitives. It needs a Pug compiler to turn into real HTML — it is not
  HTML you can paste into a file and open.
- The **CSS** is written in **SCSS** (variables, `@property`, nesting) and
  needs a Sass compiler to turn into real CSS.
- The core trick — no wrapping every character in a `<span>`, and no
  duplicated text — relies on **SVG filters** (`feColorMatrix`,
  `feComponentTransfer`, `feGaussianBlur`, `feBlend`, `feDisplacementMap`)
  combined with a CSS gradient mask driven by `animation-timeline: view()`.
  It's a genuinely advanced technique, explained by the author here:
  https://mastodon.social/@anatudor/112551564705281523
- **Browser support**: as of when this was built, the scroll-driven part
  (`animation-range`) only worked in Chromium 115+ (Chrome/Edge) — it
  simply won't reveal in Firefox/Safari without a fallback.

Given this, I saved the raw source below rather than risk quietly
"translating" a 100+ line generative SVG filter loop by hand and handing
you something subtly broken. If you want to actually use this effect,
the realistic path is: paste the source into CodePen itself (which
compiles Pug/SCSS automatically for you) to see and tweak it live, or
come back here and we build a much simpler single-effect version
together from scratch using the same underlying idea (gradient mask +
`animation-timeline: view()`) without the SVG filter complexity.

---

## Raw Pug (HTML)

```pug
- let text = 'They were careless people, Tom and Daisy -- they smashed up things and creatures and then retreated back into their money or their vast carelessness or whatever it was that kept them together, and let other people clean up the mess they had made.';
- let n = text.length;
- let demo = [
- 	'fade in',
- 	'unblur',
- 	'unblur & fade in',
- 	'unblur & grow',
- 	'unblur & unshear',
- 	'undissolve',
- 	'wave fade in'
- ];
- let m = 10;
- let a = new Array(m + 1).fill(0);

mixin base(f = 0)
	feColorMatrix(values=`0 0 0 0 1
												0 0 0 0 1
												0 0 0 0 1
												0 0 1 0 0` result='basetext')
	if f
		feColorMatrix(in='SourceGraphic'
									values=`0 0 0 0 0
													0 0 0 0 .5
													0 0 0 0 0
													0 1 0 0 0` result='vertdmap')
		feComponentTransfer(result='vertrect')
				feFuncA(type='discrete' tableValues='0 1 0')
		if f > 1
			feTurbulence(type='fractalNoise' baseFrequency='1.73'
			             result='noisemap')
	feColorMatrix(in='SourceGraphic'
								values=`0 0 0 0 0
												0 0 0 0 0
												0 0 0 0 0
												1 0 0 0 0` result='basegrad')

body(style=`--n: ${n}; --m: ${m}`)
	svg(width='0' height='0')
		filter#grainy(color-interpolation-filters='sRGB')
			feTurbulence(type='fractalNoise' baseFrequency='1.73')
			feColorMatrix(type='saturate' values='0')
			feBlend(in='SourceGraphic' mode='multiply')

		filter#reveal-0(color-interpolation-filters='sRGB')
			feColorMatrix(values=`0 0 0 0 0
			                      0 0 0 0 0
														0 0 0 0 0
														1 0 0 0 0`)
			feComponentTransfer(result='alphamap')
				feFuncA(type='discrete'
				        tableValues=a.map((_, i) => i/m).join(' '))
			feColorMatrix(in='SourceGraphic'
			              values=`0 0 0 0 1
														0 0 0 0 1
														0 0 0 0 1
														0 0 1 0 0`)
			feComposite(in2='alphamap' operator='in')

		// ... reveal-1 through reveal-6 follow the same generative pattern,
		// each looping i from 0..m to build up a chain of feComponentTransfer
		// + feComposite + feGaussianBlur/feDisplacementMap + feBlend layers.
		// See the live pen for the complete loop bodies — omitted here for
		// length, since they're mechanically repetitive variations of the
		// reveal-0 pattern above with different distortion/blur math per demo.

	header
		h2 no JS gallery of<br>char by char<br>on scroll<br>text reveal effects
		em without wrapping each character in an element!
		em without any text duplication whatsoever!
	- demo.forEach((c, i) => {
		article
			h3 #{c}
			p(style=`filter: url(#reveal-${i})`): span #{text}
	- })
```

## Raw SCSS (CSS)

```scss
@import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@600&family=Shantell+Sans:ital,wght,BNCE,INFM@0,300..800,100,100;1,300..800,100,100&display=swap');

@property --k {
	syntax: '<number>';
	initial-value: 0;
	inherits: true
}

* { margin: 0 }

html, body, header, article { display: grid }

html { scrollbar-color: #f7b267 #212121 }

body {
	color: #ededed;

	&::before {
		position: fixed;
		inset: 0;
		z-index: -1;
		background: #1a1a1a;
		filter: url(#grainy);
		content: ''
	}
}

header, article, footer {
	grid-gap: 1em;
	justify-self: center;
	place-content: center;
	padding: min(4%, 1em);
	max-width: 25em;
	min-height: 100vh;
	font: clamp(1.5em, 6vmin, 12.5em)/ 1.125 inconsolata, sans-serif;
	text-wrap: balance
}

header, h3 {
	color: #f25c54;
	font-family: shantell sans, cursive;
	text-align: center
}

h2 { color: #f7b267; font-size: 1.75em }
em { display: block; font-size: .75em; font-weight: 100 }
h3 { font-size: 1.375em }
a { color: #ffb703 }

p {
	--k: calc(-1*(var(--m) + 1));
	animation: k steps(calc(var(--n) + var(--m) + 1)) both;
	animation-timeline: view();
	animation-range: entry 50% cover 50%
}

@keyframes k { to { --k: var(--n) } }

span {
	overflow: hidden;
	background:
		linear-gradient(#00f 0 0) text,
		linear-gradient(90deg,
			red calc(var(--k)*1ch),
			#000 calc((var(--k) + var(--m) + 1)*1ch)),
		linear-gradient(#000, #0f0);
	background-blend-mode: lighten;
	color: #0000
}
```

## No JavaScript

This effect uses zero JavaScript — the reveal is driven entirely by the
CSS `animation-timeline: view()` scroll-driven animation on the `p`
element, combined with the SVG filters above.
