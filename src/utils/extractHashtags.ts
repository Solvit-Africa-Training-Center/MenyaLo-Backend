/**
 * Extracts unique hashtags from a given text string.
 * Hashtags must start with # and contain alphanumeric characters or underscores.
 * Returns lowercase, deduplicated array of hashtag names without the # symbol.
 */
export function extractHashtags(text: string): string[] {
  const regex = /#([a-zA-Z0-9_]+)/g;
  const tags = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    tags.add(match[1].toLowerCase());
  }

  return Array.from(tags);
}
