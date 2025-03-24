export declare function decompress(
  input: BufferSource,
  options?: BrotliDecodeOptions,
): Uint8Array;

export interface BrotliDecodeOptions {
  customDictionary: BufferSource | null;
}

export default decompress;
