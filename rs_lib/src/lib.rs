#![allow(unexpected_cfgs)]
#![cfg(target_arch = "wasm32")]

#[cfg(feature = "alloc")]
extern crate alloc;
#[cfg(all(feature = "alloc", not(feature = "alloc-mt")))]
use lol_alloc::AssumeSingleThreaded;
#[cfg(feature = "alloc")]
use lol_alloc::FreeListAllocator;
#[cfg(all(feature = "alloc", feature = "alloc-mt"))]
use lol_alloc::LockedAllocator;

#[global_allocator]
#[cfg(all(feature = "alloc", not(feature = "alloc-mt")))]
// SAFETY: This app is single threaded, so AssumeSingleThreaded is allowed.
static ALLOCATOR: AssumeSingleThreaded<FreeListAllocator> =
  unsafe { AssumeSingleThreaded::new(FreeListAllocator::new()) };

#[global_allocator]
#[cfg(all(feature = "alloc", feature = "alloc-mt"))]
static ALLOCATOR: LockedAllocator<FreeListAllocator> =
  LockedAllocator::new(FreeListAllocator::new());

#[macro_use]
pub(crate) mod macros;
pub(crate) mod utils;

pub mod fonts;
pub mod options;
pub mod renderer;

pub use fonts::*;
pub(crate) use macros::*;
pub use options::*;
pub use renderer::*;

#[cfg(test)]
mod tests {
  use utils::test_util::*;

  use super::*;

  #[test]
  fn test_render() {
    let actual = crate::render(
      r##"<?xml version="1.0" encoding="UTF-8"?>
    <svg width="820px" height="312px" viewBox="0 0 820 312" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Testing</title>
        <g id="testing" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <rect fill="#FFFFFF" x="0" y="0" width="820" height="312"></rect>
            <text id="test-text" font-family="sans-serif" font-size="32" font-weight="bold" fill="#111827">
                <tspan x="51" y="90">Testing Testing Testing</tspan>
            </text>
            <text id="monospace" font-family="monospace" font-size="32" font-weight="normal" fill="#2D53A4">
                <tspan x="502" y="233">Monospace</tspan>
            </text>
        </g>
    </svg>"##,
      None,
    );
    assert!(actual.is_ok());
    let actual: Vec<u8> = actual.unwrap();
    assert_eq!(actual.len(), 15471);
  }

  #[test]
  fn test_autofix() {
    let mut options = Options::default();
    options.autofix = true;
    let actual = crate::render(
      r##"<svg width="820" height="312" viewBox="0 0 820 312">
        <title>Testing</title>
        <g id="testing" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <rect fill="#FFFFFF" x="0" y="0" width="820" height="312" rx="8"></rect>
            <text id="test-text" font-family="sans-serif" font-size="32" font-weight="bold" fill="#111827">
                <tspan x="51" y="90">Testing Testing Testing</tspan>
            </text>
            <text id="monospace" font-family="monospace" font-size="32" font-weight="normal" fill="#2D53A4">
                <tspan x="502" y="233">Monospace</tspan>
            </text>
        </g>
    </svg>"##,
      Some(options),
    );
    assert!(actual.is_ok());
    let actual: Vec<u8> = actual.unwrap();
    assert_eq!(actual.len(), 15516);
  }

  #[test]
  #[should_panic]
  fn test_autofix_disabled() {
    let mut options = Options::default();
    options.autofix = false;
    let result = crate::render(
      r##"<svg width="820" height="312" viewBox="0 0 820 312"><title>Testing</title></svg>"##,
      Some(options),
    );
    assert!(result.is_err());
  }

  #[cfg_attr(not(feature = "lite"), test)]
  fn test_default_font_faces() {
    let options = Options::default();

    let svg = r##"<?xml version="1.0" encoding="UTF-8"?>
    <svg width="1000" height="1000" viewBox="0 0 500 500" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Testing</title>
        <g id="testing" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <rect fill="#111827" x="0" y="0" width="100%" height="100%" rx="8"></rect>
            <text id="test-text" font-family="sans-serif" font-size="60" font-weight="normal" fill="#FFF" text-anchor="middle" x="50%" y="15%">
                <tspan>sans-serif</tspan> <tspan font-style="italic">(sans)</tspan>
            </text>
            <text id="serif" font-family="serif" font-size="60" font-weight="normal" fill="#FFF" text-anchor="middle" x="50%" y="32.5%">
                <tspan>serif</tspan> <tspan font-weight="bold" font-size="54">(<tspan font-style="italic">roman</tspan>)</tspan>
            </text>
            <text id="monospace" font-family="monospace" font-size="50" font-weight="normal" fill="#FFF" text-anchor="middle" x="50%" y="50%">
                <tspan>monospace</tspan> <tspan font-style="italic">(mono)</tspan>
            </text>
            <text id="cursive" font-family="cursive" font-size="64" font-weight="normal" fill="#FFF" text-anchor="middle" x="50%" y="70%">
                <tspan>cursive</tspan> <tspan font-weight="bold">(script)</tspan>
            </text>
            <text id="fantasy" font-family="fantasy" font-size="64" font-weight="normal" fill="#FFF" text-anchor="middle" x="50%" y="90%">
                <tspan>fantasy</tspan> <tspan font-weight="bold">(blackletter)</tspan>
            </text>
        </g>
    </svg>"##;

    let options = Some(options);
    let actual = crate::render(svg, options);

    assert!(actual.is_ok());
    let actual: Vec<u8> = actual.unwrap();

    write_png_to_terminal(&actual);

    assert_eq!(actual.len(), 209772);
  }

  #[test]
  fn test_custom_font_faces_rendering() {
    let options = Some(get_options_with_custom_font_faces());

    let actual = crate::render(
      r##"<?xml version="1.0" encoding="UTF-8"?>
    <svg width="820" height="312" viewBox="0 0 820 312" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Testing</title>
        <g id="testing" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <rect fill="#FFFFFF" x="0" y="0" width="820" height="312" rx="8"></rect>
            <text id="test-text" font-family="sans-serif" font-size="32" font-weight="bold" fill="#111827" text-anchor="start" x="50%" y="25%">
                <tspan>Inter (sans-serif)</tspan>
            </text>
            <text id="serif" font-family="serif" font-size="32" font-weight="bold" fill="#111827" text-anchor="middle" x="50%" y="50%">
                <tspan>Bitter (serif)</tspan>
            </text>
            <text id="monospace" font-family="monospace" font-size="32" font-weight="normal" fill="#2D53A4" text-anchor="end" x="502" y="75%">
                <tspan>JetBrains Mono (monospace)</tspan>
            </text>
        </g>
    </svg>"##,
      options,
    );

    assert!(actual.is_ok());
    let actual: Vec<u8> = actual.unwrap();
    assert_eq!(actual.len(), 39942);

    write_png_to_terminal(&actual);
    write_png_to_tmp_file(&actual);
  }

  #[test]
  fn debug_options_with_custom_font_faces() {
    let options = get_options_with_custom_font_faces();
    let opts: ::usvg::Options<'static> = options.into();
    for f in opts.fontdb.faces() {
      debug_font_face(f);
    }
  }
}
