#![allow(dead_code)]

/// Decompresses a Brotli-compressed byte slice. Always returns the input
/// when Brotli is not enabled.
#[cfg(feature = "brotli")]
pub fn decompress(input: impl AsRef<[u8]>) -> Box<[u8]> {
  use brotli_decompressor::BrotliDecompress;
  let mut output = Vec::new();
  match BrotliDecompress(&mut input.as_ref(), &mut output) {
    Ok(_) => output.into_boxed_slice(),
    Err(_) => input.as_ref().to_vec().into_boxed_slice(),
  }
}

/// Decompresses a Brotli-compressed byte slice. Always returns the input
/// when Brotli is not enabled.
#[cfg(not(feature = "brotli"))]
pub fn decompress(input: impl AsRef<[u8]>) -> Box<[u8]> {
  input.as_ref().to_vec().into_boxed_slice()
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  #[cfg(feature = "brotli")]
  fn test_decompress_safe_empty() {
    // 0x6 is the Brotli magic number for an empty block
    let data = vec![0x6].into_boxed_slice();
    let empty_vec: Vec<u8> = vec![];
    let empty = empty_vec.into_boxed_slice();
    assert_eq!(decompress(data.clone()), empty);
  }

  #[test]
  #[cfg(feature = "brotli")]
  fn test_decompress_inter_bold() {
    let data = include_bytes!("../../../fonts/Inter/Inter-Bold.ttf.br")
      .to_vec()
      .into_boxed_slice();
    let expected = include_bytes!("../../../fonts/Inter/Inter-Bold.ttf")
      .to_vec()
      .into_boxed_slice();
    assert_eq!(decompress(data), expected);
  }

  #[cfg(not(feature = "brotli"))]
  #[test]
  fn test_decompress_no_brotli() {
    let data = vec![0, 0, 0, 0].into_boxed_slice();
    assert_eq!(decompress(data), vec![0, 0, 0, 0].into_boxed_slice());
  }

  #[cfg(not(feature = "brotli"))]
  #[test]
  fn test_decompress_no_brotli_empty() {
    let data = vec![0x6].into_boxed_slice();
    assert_eq!(decompress(data), vec![0x6].into_boxed_slice());
  }
}
