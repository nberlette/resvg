export function toBase64(data: Uint8Array): string {
  return btoa(data.reduce((a, b) => a + String.fromCharCode(b), ""));
}

/**
 * Converts an image (PNG, JPEG, etc.) from a string or `Uint8Array` to an ANSI
 * escape sequence that can be displayed in most modern terminals.
 *
 * @param image - The image data as a base64-encoded string or `Uint8Array`.
 * @param [width="100%"] - The width of the image in the terminal.
 * @param [height="100%"] - The height of the image in the terminal.
 * @param [preserveAspectRatio=1] - Whether to preserve the aspect ratio of the
 * image when resizing. Set to 0 to stretch the image to fit the terminal.
 * @returns A string containing the ANSI escape codes for the image.
 */
export function imageToAnsi(
  image: string | Uint8Array,
  width = "100%",
  height = "100%",
  preserveAspectRatio = true,
  inline = true,
): string {
  let buf: Uint8Array;
  if (typeof image === "string") {
    buf = Uint8Array.from(atob(image), (c) => c.charCodeAt(0));
  } else {
    buf = image;
  }
  const base64 = toBase64(buf), length = buf.length;
  return `\x1b]1337;File=inline=${+inline};preserveAspectRatio=${+preserveAspectRatio};size=${length};width=${width};height=${height}:${base64}\x07`;
}

export function resolve(path: string, base = import.meta.url) {
  return new URL(path, base).toString().replace(/^file:\/\//, "");
}
