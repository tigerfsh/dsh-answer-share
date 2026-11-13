# dsh-answer-share

Copy a finalized DeepSeek Harness answer as a long PNG image or as rich-text HTML.

Adds one action to every finalized assistant answer in the DSH Web chat:

- **Click** the new action to copy the answer as a **long PNG image** (the
  default). Paste it into DingTalk, WeCom, WeChat, or any editor that accepts
  images.
- Open the small **more** menu to:
  - copy the same image again;
  - copy the answer as **rich-text HTML** (`text/html` plus a `text/plain`
    fallback) for Word, Feishu Docs, Notion, email, and other HTML-aware
    editors;
  - download the PNG file.

The built-in plain-text copy button is **not modified**; both copy actions can
be used side by side.

## Why this exists

DSH renders an assistant answer from Markdown in the browser: headings, code
blocks, tables, blockquotes, inline code, and formulas are semantic HTML after
rendering. The built-in copy action writes the raw answer text with
`navigator.clipboard.writeText`, so pasting it elsewhere loses the rendered
appearance.

This plugin reads the rendered answer DOM, removes chat chrome (action buttons,
reasoning disclosures, code-block toolbars), applies portable inline styles,
and produces:

- a PNG long image for image-only chat inputs such as DingTalk;
- a self-contained HTML fragment for rich-text editors.

## Install

From npm:

```sh
dsh plugin --profile web add dsh-answer-share
```

From GitHub (pin a tag or commit for reproducible installs):

```sh
dsh plugin --profile web add github:tigerfsh/dsh-answer-share
```

Restart `dsh web` if it was already running, then reload the Web page. The
package is a Web bundle; it appears in **Settings → Plugins** as
**Answer copy & screenshot**.

## Usage

1. Open a session with a completed answer.
2. Hover the answer's action strip.
3. Click the new picture action to copy the answer image; paste into DingTalk.
4. Click the tiny arrow beside it for rich-text HTML or a PNG download.

## Limitations

- It uses the answer as currently rendered. If the answer is still streaming,
  wait until it is finalized.
- Reasoning, tool-call cards, and chat action buttons are excluded from the
  output.
- Images embedded in the answer are inlined as data URLs when the browser can
  read them; very large or cross-origin images may be omitted.
- A very long answer is scaled down to keep the PNG within browser canvas
  limits.
- Rich-text HTML is best-effort: editors that strip HTML (for example the
  WeChat chat input) will fall back to text. Use the image copy there.
