"use client";

import DOMPurify from "dompurify";

export const SafeHtml = ({ html }: { html: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
};
