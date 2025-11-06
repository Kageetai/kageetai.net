import { visit } from "unist-util-visit";
import type { Root, Image, Html } from "mdast";

export function remarkYouTubeEmbed() {
  return (tree: Root) => {
    visit(tree, "image", (node: Image, index, parent) => {
      const url = node.url;

      // Check if it's a YouTube URL
      const youtubeRegex =
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
      const match = url.match(youtubeRegex);

      if (match && match[1] && parent && typeof index === "number") {
        const videoId = match[1];

        // Transform the image node to HTML with YouTube embed
        const htmlNode: Html = {
          type: "html",
          value: `<lite-youtube videoid="${videoId}"></lite-youtube>`,
        };

        // Replace the image node with the HTML node
        parent.children[index] = htmlNode;
      }
    });
  };
}
