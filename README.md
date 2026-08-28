# The Blog

A small, private blog. Posts are markdown files.

## Writing a new post

1. Create a new **folder** in `src/content/blog/`, for example
   `my-trip-to-helsinki/`, and inside it a file called `index.md`. The folder name becomes the web address (`/posts/my-trip-to-helsinki/`), and the folder is also where the post's pictures live — everything for one post in one place.
2. Start `index.md` with a _frontmatter_ block, then write your post in Markdown:

   ```markdown
   ---
   title: My trip to Helsinki
   description: A short summary (used if there's no "keep reading" cut).
   date: 2026-09-01
   category: Travel
   tags:
     - finland
     - holiday
   ---

   The post itself goes here. **Bold**, _italics_, [links](https://example.com), lists and headings all work.
   ```

3. Save the file. That's it — the post appears on the homepage, on its category page, on each tag page, and in search.

Only `title` and `date` are required; everything else can be left out. `category` is one word describing the kind of post (Travel, Recipes, Life…); `tags` can be as many as you like.

## The "keep reading" cut

To show only the opening of a post on the homepage (like Tumblr's
"keep reading"), put this on its own line where you want the preview to stop:

```markdown
<!--more-->
```

Everything above the marker appears on the homepage, followed by a
"Keep reading →" link. On the post's own page the marker is invisible and the post reads as one seamless piece.

If a post has no marker, the homepage shows its `description` from the frontmatter instead — or, failing that, its first paragraph.

## Adding pictures

Drop the image files (photos straight from your phone are fine) into the post's folder, then reference each one by name inside the post:

```markdown
![A sentence describing the picture](./harbour.jpg)
```

Images are automatically resized and compressed when the site is published, so don't worry about file sizes. The sentence in square brackets is read aloud by screen readers and shown if the image fails to load, so make it a real description.

A post's folder might end up looking like this:

```
src/content/blog/
  my-trip-to-helsinki/
    index.md
    harbour.jpg
    sauna.jpg
    tram.jpg
```

Deleting the folder removes the post and all its pictures in one go.

## Cover images

To give a post a picture on its homepage card, add these two lines to the frontmatter, pointing at an image in the post's folder:

```markdown
image: ./harbour.jpg
imageAlt: Boats moored in Helsinki's harbour at dusk
```

The cover appears across the top of the post's card in every list. It's optional — posts without one simply show their text preview. (If the file name is wrong, publishing fails with an error message rather than showing a broken picture, so typos get caught early.)

## Drafts

Add `draft: true` to the frontmatter and the post is hidden from the homepage, tags, categories, and search. You can still preview it by adding `?preview` to its address, e.g. `/posts/my-trip-to-helsinki/?preview`.

Remove the `draft: true` line when you're ready to publish.

## The password

Everyone who visits the blog is asked for a single shared password (their browser remembers it afterwards). To change it, run this in a terminal from the project folder:

```
npm run set-password -- "the new password"
```

**A note on how private this is:** the password keeps out casual visitors and search engines, but it is not bank-grade security — the check happens in the browser, and a determined technical person could read the posts anyway. Perfect for keeping a personal blog semi-private; don't post secrets.

## Seeing the blog on your own computer

You need [Node.js](https://nodejs.org) installed. Then, in a terminal, from this folder:

```
npm install        # first time only
npm run dev        # then open http://localhost:4321
```

The page live-reloads whenever you save a file.

## The sidebar

Every page has a sidebar with a little "about me" card, plus Categories, Tags, and month-by-month Archives (all filled in automatically from your posts).

- **Your name and bio**: edit `AUTHOR_NAME` and `AUTHOR_BIO` in
  [`src/site.config.mjs`](src/site.config.mjs).
- **Your picture**: replace the file called `avatar` in `src/assets/` with whatever image you like. It can be `avatar.jpg`, `avatar.png` or `avatar.svg` — just keep exactly one file with that name. Any square-ish photo works; it's shown as a small circle.

## Changing how it looks

All the styling lives in one commented file:
[`src/styles/global.css`](src/styles/global.css). The colours and sizes are collected at the top of that file — change a value, save, and see the result instantly. The site title and description live in [`src/site.config.mjs`](src/site.config.mjs).

## Publishing

The site builds to plain files with `npm run build` (output in `dist/`). Any static host works — Netlify, Vercel, Cloudflare Pages, GitHub Pages. Typical setup: connect the Git repository to the host, set the build command to `npm run build` and the output directory to `dist`, and every push publishes automatically.
