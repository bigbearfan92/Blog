import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** All published (non-draft) posts, newest first. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Every post including drafts (drafts still get a page, for previewing). */
export async function getAllPosts(): Promise<Post[]> {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function slugifyTerm(term: string): string {
  return term
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export interface ArchiveMonth {
  /** e.g. "2026" */
  year: string;
  /** Zero-padded, e.g. "08" */
  month: string;
  /** e.g. "August 2026" */
  label: string;
  posts: Post[];
}

/** Published posts grouped by month, newest month first (for the sidebar + archive pages). */
export async function getArchiveMonths(): Promise<ArchiveMonth[]> {
  const posts = await getPublishedPosts();
  const months = new Map<string, ArchiveMonth>();
  for (const post of posts) {
    // Frontmatter dates like 2026-08-20 parse as UTC, so group in UTC too —
    // otherwise a post could land in the wrong month depending on timezone.
    const date = post.data.date;
    const year = String(date.getUTCFullYear());
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const key = `${year}-${month}`;
    let entry = months.get(key);
    if (!entry) {
      const label = date.toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      });
      entry = { year, month, label, posts: [] };
      months.set(key, entry);
    }
    entry.posts.push(post);
  }
  return [...months.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([, entry]) => entry);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
