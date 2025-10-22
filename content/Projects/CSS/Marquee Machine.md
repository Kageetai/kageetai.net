---
created: 2024-07-31T14:44+02:00
changed: 2024-07-31T16:53+02:00
summary: "We recently had a little hour-long mini hackathon at my work, where we had one hour to develop anything to a specific topic and for this first iteration the topic was: **90s websites**!"
url: https://codepen.io/Kageetai/pen/vYqGGLp
publish: true
---
  
We recently had a little hour-long mini hackathon at my work, where we had one hour to develop anything to a specific topic and for this first iteration the topic was: **90s websites**!  
  
At first, I was feeling a bit stumped on what to do with that. Just using the ugliest GIFs and fonts, as everyone else was probably doing, seemed to… normal.  
What else was typical for the wild, wild time the 90s was? The `marquee` element of course! Nearly as long forgotten as hated, it was all over the internet in the 90s and further. Texts, images and more would scroll from left to right or the other way and sometimes back. What a wild world it was!  
  
After a quick look at the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/marquee), as my memory was surprisingly somewhat foggy on the usage of this element, I was inspired by one their code example, which immediately reminded me of another staple of 90s life: the **DVD screen saver**!  
Oh, how did we all follow its unpredictable trail and celebrate if it ever hit the corner. Did anyone ever really witness that, or did it just become such a meme, that the [Mandela effect](https://en.wikipedia.org/wiki/Mandela_effect) worked its magic there?!  
  
Anyway, recreating this DVD screen saver effect is surprisingly simple with the help of two nested `marquee` elements and some minor CSS to make it full screen. After finding a fitting logo with transparency and setting the background black, it was already nearly perfect, just missing one tiny detail: Changing colour when it bounces!  
  
```html  
<marquee direction="down" behavior="alternate" height="100%" width="100%">  
  <marquee behavior="alternate" height="100%" width="100%">  
    <img src="https://i.imgur.com/T0qfszm.png" width="250" />  
  </marquee>  
</marquee>  
```  
  
It seemed at first like this should be easy as well, as the docs for the `marquee` included an `onbounce` event, which should make it easy to trigger anything when it bounces. Unfortunately, as the big red box on top of the page already spoils, this element is considered highly deprecated, which is actually rather rare for the web, as one of the main agreements of browser developers is, not basically never deprecate anything to make sure any old websites from the 90s (or newer ones that wanna look like it) still work today. Therefore, this `onbounce` event was either never implemented in most browser or has since been removed, and I couldn't use it.  
  
But there's never been a better time to be a web developer, with all these features available to us now, and the perfect one for this is the `IntersectionObserver`, which can observer whether an element intersects with the viewport or other elements and luckily it contains a `rootMargin` option, which allows to even observe intersection with an inner margin, if set to a negative value:  
  
```js  
const observer = new IntersectionObserver(  
  (entries) => { /* callback */ },  
  {  
    root: document.querySelector("body"),  
    rootMargin: "-10px",  
    threshold: 1.0  
  }  
);  
  
observer.observe(document.querySelector("img"));  
```  
  
And with that added, the screensaver becomes more colourful, as with every contact with the edge of the viewport, the logo changes colour, thanks to some CSS filter magic:  
  
```js  
if (entry.isIntersecting) {  
	entry.target.style.filter = `hue-rotate(${entry.time}deg)`;  
}  
```  
  
All this together looks like this:  
  
<p class="codepen" data-height="300" data-default-tab="css,result" data-slug-hash="vYqGGLp" data-pen-title="Marquee Machine" data-user="Kageetai" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">  
  <span>See the Pen <a href="https://codepen.io/Kageetai/pen/vYqGGLp">  
  Marquee Machine</a> by Kageetai (<a href="https://codepen.io/Kageetai">@Kageetai</a>)  
  on <a href="https://codepen.io">CodePen</a>.</span>  
</p>  
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>  
  
This was a fun short experiment with some a nice combination of ancient HTML combined with newer JS and CSS techniques.  
