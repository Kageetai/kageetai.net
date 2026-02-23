---
created: 2025-11-07T09:28+01:00
changed: 2025-12-10T14:25+01:00
image: "[Astro-based web page](./attachments/new%20blog,%20new%20stack-1763042571840.webp.webp)"
publish: true
published: 2025-12-02
summary: What's the cliché first post on a fresh blog for a developer? Of course, the tech stack behind the blog!
---
  
I've always wanted to write more, but often struggle with finding topics. So, here we go, with the most cliché post a developer can do on their new blog: Describing the tech stack behind it.  
This blog you see here now, is my first real attempt at a fully self-developed and self-made blog and website.  
  
## First Steps with Quartz  
  
Before that I briefly used [Quartz](https://quartz.jzhao.xyz/) to generate a site from my Obsidian vault and push it to my Uberspace web host, which works well and is well-suited to make a simple Digital Garden of any Obsidian vault. Quartz provides a few useful features, like easy conversion of Markdown files into HTML pages, rendering a good default theme, with navigation and components like a page graph etc. The source is also open and easy to adjust, just a little trickier to update, if they have been custom changes.  
There are also plenty other similar plugins and such out there, which provide very similar functionality, converting and rendering Obsidian notes with a fixed design or theme, like [Obsidian Digital Garden](https://dg-docs.ole.dev/) or [Friday](https://obsidian.mdfriday.com/).  
This is all fine and dandy, but my "pride" as a web developer myself, I wanted even more control over how my content is being displayed. Also Quartz does not support classic blog feeds and such.  
Therefore from the beginning I had in my mind to use a more custom-made solution at some point and kept researching frameworks, plugins and what others did. And it's hard to believe how many are already out there!  
All of them use slightly different approaches, either plugins to be run from inside Obsidian, CLI tools to be executed either manually or by a pipeline. Due to my setup of my vault in Obsidian, where I am mixing private notes with the public posts I want to write, I had a few requirements for the setup:  
  
- convert Obsidian-style Markdown, especially Wikilinks `[[like this]]`  
- be able to link to other notes and include attachments like images  
- filtering out notes based on a key, e.g. `publish`  
- in the beginning I also wanted to keep everything in one repository and not expose the source files publicly, as well as not have source code inside my Obsidian vault  
  
Especially that last one was trickier than expected. Many other solutions either force you to keep your Markdown files together with the source code of the website, and often have the entire vault public. For example, even with Quartz, I had to keep two repositories, one for my private vault as I had before. And another to keep the Quartz source code. Meaning I had to either copying over the Markdown files from one repository to another or use Git submodules. The submodule proved the more reliable way, as I could include it in the public repository on GitHub and give the repository access via a deploy key, as still can be seen [here](https://github.com/Kageetai/kageetai.net-quartz/tree/26cb226a1892e8917aa8ca02f0c55985d9160d70). This worked fine, but meant I had to manually update the submodule inside the public repository, whenever there was new content in the private one, and I never got around to automating that process.  
After that I also have to deploy the build files somewhere, for which it makes most sense to use my existing and trusted webspace provider [Uberspace](https://uberspace.de/en/). Using `scp` and some deploy keys in a GitHub workflow worked like a charm for that.  
  
This is how the page looked after the above process:  
  
![Quartz-based web page](./attachments/new%20blog,%20new%20stack-1763475494080.webp.webp)  
  
Certainly not bad for a basic setup and being able to publish Obsidian notes relatively easily.  
I did keep this for a while, but always with the desire to only use it as a base and at some point replace it.  
  
## Developers Pride  
  
Even if that time never really came, I kept some notes on other options I stumbled upon in the meantime. One of those that made the next step possible was the [Obsidian plugin Enveloppe](https://enveloppe.ovh/). Instead of pushing from one repository to another, this plugin talks to the public repository directly from within Obsidian, via the GitHub API.  
Initially I wanted to avoid this approach to not have to rely on another plugin and instead just combine this publishing flow with my backup flow to my private GitHub repository. But after trying it out once, I realised it takes away a lot of the hassle, that I would have to do myself otherwise with a custom solution:  
  
- converting Wikilinks into standard Markdown links and map them to the corresponding files: `[[link]]` -> `[](link)` (which was more complexities than I thought at first, e.g. what to do with identically named notes in different folders?)  
- filters files and attachments based on a property  
- map file paths to a designated folder structure  
- … and other things I probably couldn't even think of yet  
  
So with all of this (and more) taken care of by the Enveloppe plugin, I could get back to the more fun part of making a website (at least to me): Working on the actual page and design!  
I just set up Enveloppe plugin to push to my secondary public repository (after testing with another temporary repository) and started working on rendering these Markdown files with a framework of my choice.  
For that kind of choice there are just as many options out there. I won't go over those here in detail, basically any frontend framework would do the job. I chose [Astro](https://astro.build/) for my purpose here, as it's suited well for static content like blogs and supports many modern web features and technologies.  
  
## Building with Astro  
  
Setting up Astro for this project was as easy as following their basic quick-start guide and setting up Enveloppe to push the converted Markdown files to the correct source folder for Astro to find the files. One trickier thing was to find the right format for internal links, to articles and attachments. The settings for Enveloppe allow for extensive configuration, which I had to align with Astro's routing expectations. This was a bit trickier at first and I had to write some [short helper functions](https://github.com/Kageetai/kageetai.net/blob/main/src/content/config.ts#L31) to help parse the links, especially to retrieve image banners to render for each post.  
The main part of that happens inside the standard Astro configuration, where I am fetching the Markdown files and parsing them into blog posts, while also making sure titles and images are parsed and generated. If curious, the code is here:  
  
[kageetai.net/src/content/config.ts at main · Kageetai/kageetai.net](https://github.com/Kageetai/kageetai.net/blob/main/src/content/config.ts#L31-L63)  
  
With that done, working on the actual design and CSS for the site was the easy part and I soon had the below design for the home page:  
  
![Astro-based web page](./attachments/new%20blog,%20new%20stack-1763042571840.webp.webp)  
  
For more details about that, I recommend just checking the source code and history on [GitHub](https://github.com/Kageetai/kageetai.net/commits/main/). I will surely work on it more, try to find my own style and design etc. For now I want to keep it simple, but have plans for more proper "blog features" and such, e.g.:  
  
- RSS feed with new posts  
- SEO sitemap etc.  
- filtering by tags and/or folders  
	- I have a folder structure inside my Obsidian vault, which I reflect via the path of the blog posts  
	- it would be nice to use these paths as categories for the posts and make them filterable  
- comments, maybe via something like [giscus](https://giscus.app/)  
- table of contents for single articles  
- ... and probably many more over time  
  
After that I published the site on my Uberspace web host just like before.  
After some testing and tweaking with Google Lighthouse, I managed to get a `100` score:  
  
![Lighthouse score](./attachments/new%20blog,%20new%20stack-1762525428937.webp.webp)  
  
I suppose it's okay to be just a little proud of that. Let's see how long it lasts! ;)  
In the meantime, feel free to [contact me](https://mastodon.social/@kageetai) with suggestions, share your own blog setups or anything.  
