use js_sys::Object;
use serde_wasm_bindgen::from_value;
use tiny_skia::Pixmap;
use usvg::{Options as UsvgOptions, Transform, Tree};
use wasm_bindgen::prelude::*;

use crate::Options;

/// Renders an SVG string into a PNG image as a byte array.
///
/// Optionally accepts a `Options` object to customize the rendering,
/// such as setting the font family, font size, and custom fonts.
///
/// @param {string} svg The SVG string to render.
/// @param {Options} [options] Custom rendering options (if any).
/// @returns {Uint8Array} A rasterized PNG image encoded as a byte array.
/// @throws {Error} If the SVG string is invalid or rendering fails.
#[wasm_bindgen(js_name = render, skip_jsdoc)]
pub fn js_render(svg: &str, options: Option<Object>) -> Result<Vec<u8>, JsValue> {
  let options = options.unwrap_or_default();
  let opt: Option<Options> = from_value(options.into())?;

  Ok(render(svg, opt).map_err(map_err)?)
}

/// Renders an SVG string into a PNG image as a byte array.
///
/// Optionally accepts an `Options` object to customize the rendering,
/// such as setting the font family, font size, and custom fonts.
pub fn render(svg: &str, options: Option<Options>) -> Result<Vec<u8>, String> {
  let options = options.unwrap_or_default();
  // Attempt to autofix the SVG if the autofix option is enabled
  let mut input = svg.to_string();

  if options.autofix {
    input = autofix::autofix(input.trim());
  };
  let data = input.as_bytes();

  let opt: UsvgOptions<'static> = options.into();

  // Try to parse the SVG into a usvg Tree; return an error if parsing fails
  let tree = if let Some(tree) = Tree::from_data(data, &opt).ok() {
    tree
  } else {
    return Err(format!(
      "{}",
      "Failed to parse SVG data. Try enabling the autofix option."
    ));
  };

  // Get the size of the SVG and check for valid dimensions
  let size = tree.size().to_int_size();
  let width = size.width();
  let height = size.height();
  if width == 0 || height == 0 {
    return Err(format!(
      "Invalid SVG dimensions: width and height must be greater than zero."
    ));
  }

  // Create the Pixmap and check for successful creation
  if let Some(mut pm) = Pixmap::new(width, height) {
    // Set up the default transform for rendering
    let transform = Transform::default();

    // Attempt to render the SVG tree into the pixmap; if rendering fails, return an error
    ::resvg::render(&tree, transform, &mut pm.as_mut());

    // Encode the pixmap into a PNG and handle encoding errors
    pm.encode_png()
      .or_else(|e| return Err(format!("PNG encoding error: {}", e)))
  } else {
    Err(format!(
      "Failed to create pixmap with given dimensions {width}x{height}"
    ))
  }
}

fn map_err(err: String) -> JsError { JsError::new(&err) }

pub(crate) mod autofix {
  use lazy_static::*;
  use regex::Regex;

  lazy_static! {
      static ref STARTING_TAG_RE: Regex = Regex::new(r"(?i)<svg\b[^>]*>").unwrap();
      static ref ENDING_TAG_RE: Regex = Regex::new(r"(?i)</svg>\s*$").unwrap();
      static ref XMLNS_RE: Regex =
          Regex::new(r#"(?i)xmlns\s*=\s*(['"]?)http://www\.w3\.org/2000/svg"#).unwrap();
      static ref XMLNS_XLINK_RE: Regex =
          Regex::new(r#"(?i)xmlns:xlink\s*=\s*(['"]?)http://www\.w3\.org/1999/xlink"#).unwrap();
      static ref VERSION_RE: Regex =
          Regex::new(r#"(?i)version\s*=\s*(['"]?)(\d+\.\d+)"#).unwrap(); // Matches any version format like "1.0", "2.0"
      static ref XML_DECL_RE: Regex =
          Regex::new(r#"^\s*<\?xml\b[^>]*\?>"#).unwrap();
  }

  /// Autofixes an SVG string to ensure it is well-formed, applying only to the outermost SVG element.
  ///
  /// This function will ensure the following:
  ///  - The SVG string starts with an XML declaration (e.g. `<?xml version="1.0" encoding="UTF-8"?>`).
  ///  - The outermost SVG element has an opening `<svg>` tag with the following attributes:
  ///    - its `xmlns` attribute is set to `http://www.w3.org/2000/svg`.
  ///    - its `xmlns:xlink` attribute is set to `http://www.w3.org/1999/xlink`.
  ///    - its `version` attribute supports any valid version format, with "1.1" as the default.
  ///  - The SVG string ends with a closing `</svg>` tag corresponding to the outermost SVG element.
  pub(crate) fn autofix(str: impl ToString) -> String {
    let mut svg = str.to_string();

    // Ensure XML declaration is present at the start, with encoding set to UTF-8
    if !XML_DECL_RE.is_match(&svg) {
      svg = format!("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n{}", svg);
    }

    // Find the first <svg> tag to ensure attributes are added to the outermost element only
    if let Some(start_tag) = STARTING_TAG_RE.find(&svg) {
      let mut new_tag = start_tag.as_str().to_string();

      // Add missing required attributes to the outermost <svg> tag
      if !XMLNS_RE.is_match(&new_tag) {
        new_tag.insert_str(new_tag.len() - 1, r#" xmlns="http://www.w3.org/2000/svg""#);
      }
      if !XMLNS_XLINK_RE.is_match(&new_tag) {
        new_tag.insert_str(
          new_tag.len() - 1,
          r#" xmlns:xlink="http://www.w3.org/1999/xlink""#,
        );
      }
      if !VERSION_RE.is_match(&new_tag) {
        new_tag.insert_str(new_tag.len() - 1, r#" version="1.1""#);
      }

      // Replace the first occurrence of <svg> with the updated tag
      svg = format!("{}{}", new_tag, &svg[start_tag.end()..]);
    }

    // Ensure the closing </svg> tag is present for the outermost <svg>
    if !ENDING_TAG_RE.is_match(&svg) {
      svg.push_str("</svg>");
    }

    svg
  }
}
