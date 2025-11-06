import { visit } from "unist-util-visit";
import type { Root } from "mdast";

export function remarkYouTubeEmbed() {
  return (tree: Root) => {
    visit(tree, "image", (node) => {
      const url = node.url;

      // Check if it's a YouTube URL
      const youtubeRegex =
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
      const match = url.match(youtubeRegex);

      if (match && match[1]) {
        const videoId = match[1];

        // Transform the image node to HTML with YouTube embed
        node.type = "html";
        node.value = `<lite-youtube videoid="${videoId}"></lite-youtube>`;
      }
    });
  };
}
