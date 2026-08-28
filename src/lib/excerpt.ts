import { marked } from 'marked';
import type { Post } from './posts';

/**
 * The "cut" marker, Tumblr-style. Writing <!--more--> (or <!-- read more -->)
 * on its own line in a post marks where the homepage preview stops.
 *
 * Because the marker is an HTML comment, the full post page needs no special
 * handling at all — browsers never display comments, so the post reads
 * seamlessly as if the cut isn't there.
 */
const CUT_MARKER = /<!--\s*(?:read\s*)?more\s*-->/i;

export interface Preview {
  /** Rendered HTML for the card on listing pages ('' if there's nothing to show). */
  html: string;
  /** True when there is more to read than the preview shows. */
  hasMore: boolean;
}

export function getPreview(post: Post): Preview {
  const body = post.body ?? '';
  const match = body.match(CUT_MARKER);

  // 1. Author placed a cut: preview is everything above it, fully formatted.
  if (match) {
    return { html: renderExcerpt(body.slice(0, match.index)), hasMore: true };
  }

  // 2. No cut, but a description in the frontmatter: show that as the teaser.
  if (post.data.description) {
    return { html: `<p>${escapeHtml(post.data.description)}</p>`, hasMore: true };
  }

  // 3. Neither: show the first paragraph of the post.
  const firstParagraph = body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    // Skip headings and images — we want the first actual sentence or two.
    .find((block) => block && !block.startsWith('#') && !block.startsWith('!'));
  if (firstParagraph) {
    return {
      html: renderExcerpt(firstParagraph),
      hasMore: body.trim().length > firstParagraph.length,
    };
  }

  return { html: '', hasMore: true };
}

function renderExcerpt(markdown: string): string {
  const html = marked.parse(markdown, { async: false });
  return (
    html
      // Drop images: their relative paths only resolve through Astro's image
      // pipeline on the post page itself. Cuts normally sit above any images,
      // but if one sneaks in, remove it rather than show a broken picture.
      .replace(/<img[^>]*>/gi, '')
      .replace(/<p>\s*<\/p>/gi, '')
      .trim()
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
