import { Fragment, type ReactNode } from "react";

/* ---------------------------------------------------------------------------
   Tiny, dependency-free, XSS-safe Markdown renderer.

   The project ships no markdown library, and lesson bodies are author-supplied,
   so we MUST NOT use dangerouslySetInnerHTML. This renders a pragmatic subset
   to React elements (escaped by React automatically):

     # / ## / ###   headings
     - / *          unordered lists
     1.             ordered lists
     > quote        blockquote
     ```            fenced code blocks
     `code`         inline code
     **bold**  *em* inline emphasis
     [text](url)    links (http/https/mailto only)
     blank line     paragraph break

   Anything unrecognized falls through as plain text. Good enough for course
   notes; safe by construction (no raw HTML is ever injected).
--------------------------------------------------------------------------- */

/** Render inline spans: code, bold, italic, links. */
function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Token regex: `code` | **bold** | *italic* | [label](href)
  const re =
    /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(
        <Fragment key={`${keyBase}-t-${i}`}>
          {text.slice(last, m.index)}
        </Fragment>,
      );
      i++;
    }
    const tok = m[0];
    const key = `${keyBase}-i-${i}`;
    i++;

    if (tok.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded bg-bg-deep/70 px-1.5 py-0.5 text-[0.85em] text-gilt [box-shadow:inset_0_0_0_1px_var(--color-line)]"
        >
          {tok.slice(1, -1)}
        </code>,
      );
    } else if (tok.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-ink">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else if (tok.startsWith("*")) {
      nodes.push(<em key={key}>{tok.slice(1, -1)}</em>);
    } else {
      // [label](href)
      const split = tok.indexOf("](");
      const label = tok.slice(1, split);
      const href = tok.slice(split + 2, -1);
      const safe = /^(https?:|mailto:)/i.test(href);
      nodes.push(
        safe ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="text-gold underline decoration-gold/40 underline-offset-2 hover:decoration-gold"
          >
            {label}
          </a>
        ) : (
          <Fragment key={key}>{label}</Fragment>
        ),
      );
    }
    last = re.lastIndex;
  }

  if (last < text.length) {
    nodes.push(
      <Fragment key={`${keyBase}-t-end`}>{text.slice(last)}</Fragment>,
    );
  }
  return nodes;
}

/** Render a markdown string to a column of block-level React elements. */
export function renderMarkdown(src: string): ReactNode {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];

  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let quote: string[] = [];
  let code: { lang: string; lines: string[] } | null = null;
  let key = 0;

  const flushPara = () => {
    if (para.length === 0) return;
    blocks.push(
      <p key={`p-${key++}`} className="mb-3 last:mb-0">
        {renderInline(para.join(" "), `p${key}`)}
      </p>,
    );
    para = [];
  };
  const flushList = () => {
    if (!list) return;
    const items = list.items;
    const cls =
      "mb-3 ms-5 flex flex-col gap-1 last:mb-0 " +
      (list.ordered ? "list-decimal" : "list-disc");
    blocks.push(
      list.ordered ? (
        <ol key={`l-${key++}`} className={cls}>
          {items.map((it, idx) => (
            <li key={idx} className="ps-1">
              {renderInline(it, `li${key}-${idx}`)}
            </li>
          ))}
        </ol>
      ) : (
        <ul key={`l-${key++}`} className={cls}>
          {items.map((it, idx) => (
            <li key={idx} className="ps-1">
              {renderInline(it, `li${key}-${idx}`)}
            </li>
          ))}
        </ul>
      ),
    );
    list = null;
  };
  const flushQuote = () => {
    if (quote.length === 0) return;
    blocks.push(
      <blockquote
        key={`q-${key++}`}
        className="mb-3 border-gold/40 ps-4 text-ink-soft italic [border-inline-start:2px_solid] last:mb-0"
      >
        {renderInline(quote.join(" "), `q${key}`)}
      </blockquote>,
    );
    quote = [];
  };
  const flushCode = () => {
    if (!code) return;
    blocks.push(
      <pre
        key={`c-${key++}`}
        className="mb-3 overflow-x-auto rounded-[8px] bg-bg-deep/80 p-4 text-[0.8rem] leading-relaxed text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)] last:mb-0"
        dir="ltr"
      >
        <code>{code.lines.join("\n")}</code>
      </pre>,
    );
    code = null;
  };

  for (const raw of lines) {
    const line = raw;

    // Fenced code blocks take precedence (don't parse markup inside).
    const fence = line.match(/^```(.*)$/);
    if (code) {
      if (fence) {
        flushCode();
      } else {
        code.lines.push(line);
      }
      continue;
    }
    if (fence) {
      flushPara();
      flushList();
      flushQuote();
      code = { lang: fence[1].trim(), lines: [] };
      continue;
    }

    const trimmed = line.trim();

    if (trimmed === "") {
      flushPara();
      flushList();
      flushQuote();
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushPara();
      flushList();
      flushQuote();
      const level = heading[1].length;
      const content = renderInline(heading[2], `h${key}`);
      const hcls =
        level === 1
          ? "mb-3 mt-1 font-[family-name:var(--font-display)] text-h3 font-bold text-ink"
          : level === 2
            ? "mb-2 mt-4 text-lg font-semibold text-ink first:mt-0"
            : "mb-2 mt-3 text-base font-semibold text-ink first:mt-0";
      blocks.push(
        level === 1 ? (
          <h2 key={`h-${key++}`} className={hcls}>
            {content}
          </h2>
        ) : level === 2 ? (
          <h3 key={`h-${key++}`} className={hcls}>
            {content}
          </h3>
        ) : (
          <h4 key={`h-${key++}`} className={hcls}>
            {content}
          </h4>
        ),
      );
      continue;
    }

    const ordered = trimmed.match(/^\d+\.\s+(.*)$/);
    const unordered = trimmed.match(/^[-*]\s+(.*)$/);
    if (ordered || unordered) {
      flushPara();
      flushQuote();
      const isOrdered = Boolean(ordered);
      const item = (ordered ? ordered[1] : unordered![1]) ?? "";
      if (!list || list.ordered !== isOrdered) {
        flushList();
        list = { ordered: isOrdered, items: [] };
      }
      list.items.push(item);
      continue;
    }

    const q = trimmed.match(/^>\s?(.*)$/);
    if (q) {
      flushPara();
      flushList();
      quote.push(q[1]);
      continue;
    }

    // plain paragraph line
    flushList();
    flushQuote();
    para.push(trimmed);
  }

  flushPara();
  flushList();
  flushQuote();
  flushCode();

  return <div className="text-pretty">{blocks}</div>;
}
