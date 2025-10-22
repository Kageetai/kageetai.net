---
created: 2024-05-13T17:48+02:00
changed: 2025-03-13T11:51+01:00
image: "[[Scrolling Gradient-20240514181254633.webp]]"
publish: true
summary: In this article, I present a short experiment to combine an animated background gradient with scroll animations in CSS.
url: https://github.com/Kageetai/scrolling-gradient
---
  
> [!summary]  
> In this article, I present a short experiment to combine an animated background gradient with scroll animations in CSS.  
  
I have a confession to make: I'm a CSS enthusiast. I get unreasonably excited about new features and spend hours tinkering with them, sometimes to the detriment of other tasks and obligations.  
This probably says something about me, that I don't want to admit, but let's not think about that too hard right now.  
This project is a result of one such tinkering session, where I set out to create a captivating background animation that's driven by the user's scroll position. Let's explore how I brought this vision to life using the latest CSS tricks!  
  
## Research  
  
The frontend development sphere is a very fast moving one, with new frameworks etc. being released basically daily, which has become a sort of running joke in the community:  
  
> Every time you blink, three new "JS frameworks" are released.  
  
To keep up with that chaos, I read bogs and newsletters about recent browser features and other developments. But many articles mention features that are either really new or not yet fully available to all browser though. The frontend development scene moves so fast, it can be hard to be aware of what is currently possible or what is newly available.  
The [Baseline project](https://web.dev/baseline) was introduced in 2023 to help developers gauge more easily which features are widely available and which are still cooking:  
  
> Web Platform Baseline brings clarity to information about browser support for web platform features.  
> Baseline has two stages ([source](https://web.dev/baseline#:~:text=Baseline%20has%20two,worrying%20about%20support.)):  
> - **Newly available:** The feature becomes supported by all of the core browsers, and is therefore interoperable.  
> - **Widely available:** 30 months has passed since the newly interoperable date. The feature can be used by most sites without worrying about support.  
  
Especially recently, browsers have been developing fast and releasing lots of new CSS features for developers to make their lives easier.  
Highlights here include [CSS nesting](https://developer.chrome.com/docs/css-ui/css-nesting), [container queries](https://web.dev/blog/cq-stable) and [the `:has()` selector](https://developer.chrome.com/blog/has-m105).  
Even more recently and in addition to the above, the [Web Platform Dashboard](https://web.dev/blog/web-platform-dashboard?utm_source=tldrwebdev) was released, to give an overview and be able to search for new features and compare the availability data for them.  
  
## Idea  
  
Reading about these, sometimes gives me ideas for little experiments or mini-projects, like in this article. I do these to learn the new features and understand how to use them for future projects.  
So while reading about a new feature called `animation-timeline`, I had an idea for an animated page background based on how far the user has scrolled the page.  
Scroll-based animations themselves are not new and usually done via some scroll listener in JavaScript, to make elements appear with an animation when scrolling down the page or highlight elements in similar ways.  
Furthermore, I also always liked animated backgrounds on websites that give the site a certain tangibility and immersion.  
So how about being able to animate a background with the new `animation-timeline` feature?  
  
## Steps  
  
With that in mind, I tried to think of some steps, that would make sense for an idea like that.  
  
### Background Image  
  
First comes the general concept of the background image, with a few things I wanted to achieve:  
  
- render a full page background  
- with several radial gradients in one background element, positioned on screen at opposite corners  
- cycle through colours and use complementary colours for opposite gradients  
  
All of this is achieved with the following code snippet:  
  
```css  
background:  
	radial-gradient(  
		circle at var(--scroll-percentage) var(--scroll-percentage),  
		hsl(0deg 100% 10%),  
		transparent 50%  
	),  
	radial-gradient(  
		circle at calc(100% - var(--scroll-percentage)) var(--scroll-percentage),  
		hsl(90deg 100% 10%),  
		transparent 50%  
	),  
	radial-gradient(  
		circle at calc(100% - var(--scroll-percentage))  
		calc(100% - var(--scroll-percentage)),  
		hsl(180deg 100% 10%),  
		transparent 50%  
	),  
	radial-gradient(  
		circle at var(--scroll-percentage) calc(100% - var(--scroll-percentage)),  
		hsl(270deg 100% 10%),  
		transparent 50%  
	);  
```  
  
This basically just consists of a single `background` property, where you can either just define a single background colour/image/gradient or several at once, which is what I am using here to render several `radial-gradient`s and position them on the page using a custom property, that I will explain more below.  
For the colour of each gradient I used the [`hsl` colour format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl), to be able to easily "rotate around the colour wheel", so using `0deg`, `90deg`, `180deg` and `270deg` to split the colour wheel in four.  
  
All of this results in a background like this:  
  
![Scrolling Gradient-20240602210521157.webp](./attachments/Scrolling%20Gradient-20240602210521157.webp)  
  
### Animation  
  
Now to animating that!  
My idea was to have these gradients move across the page, cross each other in the middle and move to the opposite sides of the screen.  
  
I had to try several iterations of that, because animation a background gradient is surprisingly hard. At first, I wanted to use `background-positon` to position each gradient and then animate that property. But getting the right position for each gradient listed in `background-position` is rather tricky. For example, I first tried to use something like `background-positon: 0 0, 100% 0, 0 100%, 100% 100%` with a `background-size: 200% 200%`, and [this works well](https://stackoverflow.com/a/33938639/1159510) for singular backgrounds, but not so well for several gradients. I couldn't get a reliable position animation happening, the gradients always ended up in weird positions on the viewport, like offscreen somewhere else. I am still not fully sure why, but it also became quite the mess of properties and calculations, that was barely readable any more.  
So unhappy with this, I recalled reading that it's possible to animate custom properties and even define their data types explicitly, as mentioned in other recent articles. This opens up a whole range of opportunities of animating any possible value, that are not usually animatable.  
For example, in this specific case, I want a custom property to function like a length percentage value, and therefore interpolate between `0%` and `100%`. This is done via the `@property` syntax:  
  
```css  
@property --scroll-percentage {  
  syntax: "<length-percentage>";  
  inherits: false;  
  initial-value: 0;  
}  
```  
  
With this in place, it's easy to animate the gradients through the custom property now:  
  
```css  
@keyframes background-position-diagonal {  
  from {  
    --scroll-percentage: 0%;  
  }  
  
  to {  
    --scroll-percentage: 100%;  
  }  
}  
```  
  
We know have a standard animation we apply to the body element with the usual properties, like making it iterate infinitely and alternating for a certain time:  
  
```css  
animation: background-position-diagonal;  
animation-duration: 15s;  
animation-iteration-count: infinite;  
animation-direction: alternate;  
animation-timing-function: ease-in-out;  
```  
  
Which in the end looks like this:  
  
![four gradients animated](./attachments/chrome-capture-2024-6-2.gif)  
  
### Scroll Animation  
  
Now comes the new fancy trick, applying all this when the user scrolls the page. This is done with a new property `animation-timeline`, which has a few possible [values](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline#values), but here we are only interested in the `scroll()` one. This provides a "scroll progress timeline for animating the current element", optionally specifying a specific element and axis in the brackets, as I have done below. We just have to unset the `animation-iteration-count` and specify a special value for `animation-duration` just [for Firefox](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-timeline#examples:~:text=animation%2Dduration%3A%201ms%3B%20/*%20Firefox%20requires%20this%20to%20apply%20the%20animation%20*/), as the feature is still rather [experimental](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/scroll#browser_compatibility):  
  
```css  
body.scrollable {  
  animation-timeline: scroll(y root);  
  animation-duration: 1ms; /* Firefox requires this to apply the animation */  
  animation-iteration-count: unset;  
}  
```  
  
### Adjust for Screen Size  
  
As already visible above, the animation timeline is only active when the class `.scrollabe` is applied, otherwise the normal above animation is playing.  
This class is used to be able to only use it when the page is actually scrollable. Which in turn means we need a way to toggle this class when the content is smaller or bigger than the viewport.  
This is surprisingly tricky!  
The go-to solution for most people would be to just add a listener for when the viewpoint size changes with JavaScript, and toggle the class then. But always like to avoid any JavaScript solutions, if there are "native alternatives" without.  
My first thought was if there is [any media query](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries#syntax) to detect whether the content is higher than the viewport. But you can only query for specific heights and widths of the viewport.  
The next idea was to use container queries, but also no luck there. These are very new and allow querying for different aspects of a parent element. Unfortunately, they have a limitation when trying to query the height of the parent element, because the parent element collapses their height when defining it as a "block container", so you need to set a fixed height, which somewhat causes a loop in the logic.  
This seems confusing and even contradicting to me, not to say, makes height-based container queries somewhat useless in my eyes. Not sure if that's the intended behaviour, but looks to me, there is no way to query for height of a container properly then. Please do let me know if I misunderstand that and there is another way.  
Without any other ideas myself, the only option was to use a small JavaScript snippet to detect when the viewport is scrollable, as much as I would have preferred to avoid that. This script simply uses a `ResizeObservers` to detect whether the height of the `body` is smaller than the `window`. To make sure the effect only starts when there is enough to scroll, the height of the body has to be at least 1.5 times the height of the viewport as well:  
  
```js  
import debounce from "lodash/debounce";  
  
let className = "scrollable";  
let observer = new ResizeObserver(  
  debounce((entries) => {  
    entries.forEach(() => {  
      if (document.body.scrollHeight > window.innerHeight * 1.5) {  
        document.body.classList.add(className);  
      } else {  
        document.body.classList.remove(className);  
      }  
    });  
  }, 400),  
);  
observer.observe(document.querySelector("#scrollObserver"));  
```  
  
So with this script running, the `body` has the `.scrollable` class applied when it's scrollable, but not if not.  
  
One more idea I had after all this, whether it would be possible to transition between these two states somehow, meaning the gradients smoothly transition between their normal "times animation" and the "scrolled animation". But unfortunately I don't think that's possible, as we don't have any distinct states we can animate between here, but only the `animation-timeline`, so even something like in [this video](https://www.youtube.com/watch?v=IdxzJLQ3Mbs) would not be impossible.  
  
## Result  
  
And with all this in place, we have achieved the following result:  
You might have to open it directly on [CodePen](https://codepen.io/Kageetai/pen/dyEVZPv) to see the scrolling effect.  
  
%% ![h:500px](https://codepen.io/Kageetai/pen/dyEVZPv) %%  
  
<p class="codepen" data-height="300" data-default-tab="css,result" data-slug-hash="dyEVZPv" data-pen-title="scrolling gradient" data-preview="true" data-user="Kageetai" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">  
	<span>See the Pen <a href="https://codepen.io/Kageetai/pen/dyEVZPv">  
	scrolling gradient</a> by Kageetai (<a href="https://codepen.io/Kageetai">@Kageetai</a>)  
	on <a href="https://codepen.io">CodePen</a>.</span>  
</p>  
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>  
  
## One Step Further  
  
But there is more!  
Reading more about scroll-based animations, I found [another article](https://www.bram.us/2023/09/16/solved-by-css-scroll-driven-animations-detect-if-an-element-can-scroll-or-not/) recently with another very interesting technique to detect a scrollable container without any JS.  
The main trick comes right from the [W3 spec](https://www.w3.org/TR/scroll-animations-1/#:~:text=If%20the%20source%20of%20a%20ScrollTimeline%20is%20an%20element%20whose%20principal%20box%20does%20not%20exist%20or%20is%20not%20a%20scroll%20container%2C%20or%20if%20there%20is%20no%20scrollable%20overflow%2C%20then%20the%20ScrollTimeline%20is%20inactive.):  
  
> If the source of a ScrollTimeline is an element whose principal box does not exist or is not a scroll container, or if there is no scrollable overflow, then the ScrollTimeline is inactive.  
  
This allows an interesting technique, which uses a custom property, that's only set when the animation is activated, which in turn can then be used to detect whether the container is scrollable or not.  
  
```css  
@keyframes detect-scroll {    
  to {    
    --can-scroll: 1;    
  }    
}  
```  
  
Because this animation is only active when the container is scrollable, due to `animation-timeline: scroll(self)` being used, the custom property can be used in other places as an indicator when we can scroll.  
  
As the article shows, there are still different ways to go about this, but using "space toggles" gets messy very quickly and is rather hard to understand and I needed to trigger several CSS properties on the main container, only the option using style queries seemed feasible to me. This can look like this, for example:  
  
```css  
@container style(--can-scroll: 1) {    
  body {    
    animation-duration: unset;    
    animation-timeline: scroll(y root);    
    animation-iteration-count: unset;    
  }    
}  
```  
  
This allows to remove the JavaScript used in the previous implementation, which is always favourable.  
  
It has three small downsides though:  
  
1. [Style queries](https://developer.chrome.com/docs/css-ui/style-queries) are currently only available in Chromium-based browsers (at time of writing). Also, they can only be applied to child elements, therefore I had to split the scrolling detection and the animation itself to the `:root` and the `body` elements.  
2. We can not detect changes in "scrollability", as the above "animation hack" gets triggered once, but can't unset the value of the custom property, at least not that I am aware. It works one way, when making the viewport smaller and it becomes scrollable. For this case, the animation is activated and therefore the custom property set, but not the other way around. Usually users don't resize their browser much, therefore this could be an acceptable tradeoff.  
3. I cannot add a "scroll margin" for when to switch to the scrolling animation, as I did above in the JavaScript snippet. Therefore, the scrolling animation can look very fast, when there is only very little space to scroll.  
  
With this in mind, the code becomes considerably simpler and easier to understand though, and as this is an experiment to try out new technologies, I consider this a very interesting solution at least.  
  
## Even Further  
  
It's been a while since I originally wrote this, but now, more than half a year later, I stumbled upon another interesting article in my feeds [Overflow/scrollbar detection using modern CSS](https://css-tip.com/overflow-detection/), which inspired me to see if I can improve my original experiment again.  
A small change in structure and usage of the scroll timeline allows the container query to switch automatically and more reliable, than the solution above. It looks a bit more confusing at first, using a named scroll timeline, but actually works very well and smoothly.  
One more downside is that this doesn't work with Firefox at all (yet), as scroll timelines are not entirely supported there yet.  
  
Here is the updated code in its entirety on GitHub: [refactor: rewrite animation and container query based on latest article · Kageetai/scrolling-gradient@1db18af](https://github.com/Kageetai/scrolling-gradient/commit/1db18af0d403349d79e896bcdc2de05fb13fcdc4)  
  
The end result looks like this:  
  
<p class="codepen" data-height="300" data-default-tab="css,result" data-slug-hash="BagBrMe" data-pen-title="scrolling gradient" data-preview="true" data-user="Kageetai" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">  
	<span>See the Pen <a href="https://codepen.io/Kageetai/pen/BagBrMe">  
	scrolling gradient</a> by Kageetai (<a href="https://codepen.io/Kageetai">@Kageetai</a>)  
	on <a href="https://codepen.io">CodePen</a>.</span>  
</p>  
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>  
  
## Performance  
  
An important consideration with new technologies like these, is of course how it affects performance in the browser and especially mobile devices.  
Luckily, a simple performance test can be quickly done in the [Chrome Dev Tools via the "Frame Rendering Stats"](https://devtoolstips.org/tips/en/display-current-framerate/#:~:text=In%20Chromium%2Dbased%20browsers%2C%20such,Press%20Enter%20.):  
  
![120 FPS on MacBook Pro M1](./attachments/Scrolling%20Gradient-20240623225511076.webp)![~80 FPS on Pixel 5](./attachments/Scrolling%20Gradient-20240623225250757.webp)  
  
As you can see it could be better on my slightly dated mobile device (second image), but generally, I would consider performance good, for a simple example like this. Of course, as always test your app in a real-life situation, if you wanna use a more complex effect like this. Animations are a complicated topic, and especially bad performance can make them look very bad, or worst case even have side effects for some users.  
Therefore, it's usually good to check for the `prefers-reduced-motion` flag via a media query, but for an experiment testing a specific animation like this, the animation is kind of the whole point.  
Unfortunately, there is one downside I learned from [a recent article](https://motion.dev/blog/do-you-still-need-framer-motion#:~:text=However%2C%20the%20big,a%20JS%20library.) with the way I am using CSS custom properties to animate the gradients: They cause the browser to repaint every on every frame, unlike animating other properties like `transform` or so. This becomes visible when using the Chrome Dev Tools to [highlight repaints](https://developer.chrome.com/docs/devtools/rendering/performance#paint-flashing) and they are already visible in the screenshots above as the yellow lines in the graph.  
As it stands, I don't think there is another way to animate background gradients using the CSS properties, which don't cause repaints, so I gave to live with that knowledge, it seems.  
A good article giving tips how to debug rendering performance of your app, can be found here: [Investigate Animation Performance with DevTools - Calibre](https://calibreapp.com/blog/investigate-animation-performance-with-devtools)  
  
## Compatibility  
  
Of course, for new features like these, it's important to keep in mind whether they are already supported widely or not yet. As already mentioned above, the wonderful [Baseline project](https://web.dev/baseline), shows a lot of useful information about that.  
The main feature I am testing with this experiment is the `scroll-timeline`, which has the following compatibility data (from [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-timeline#browser_compatibility) as of writing):  
  
![Scrolling Gradient-20240610174249691.webp](./attachments/Scrolling%20Gradient-20240610174249691.webp)  
  
One more feature that's not widely available yet, is the `@property` custom property definitions, which is also not in Firefox yet.  
But with either these two missing for Firefox, it will degrade nicely to the default animation.  
  
## The End  
  
Anyway, I hope this little write-up of my little mini-project was insightful or you even learned something. Scroll-driven animations are still quite new, so here is a nice resource if you want to learn more about them: [Scroll-driven Animations](https://scroll-driven-animations.style/).  
Here is also a nice playlist on YouTube, if you prefer to learn more visually: [Before you continue to YouTube](https://www.youtube.com/playlist?list=PLNYkxOF6rcICM3ttukz9x5LCNOHfWBVnn)  
  
Thanks for reading this little "rambly" experiment of mine and I look forward to any comments, suggestions or otherwise messages.  
