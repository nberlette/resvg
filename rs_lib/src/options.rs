extern crate alloc;

// pub(crate) mod image_resolver;
// pub(crate) mod image_resolver;
pub(crate) mod rendering_enums;
pub(crate) mod size;

// pub use image_resolver::*;
// pub use image_resolver::*;
pub use rendering_enums::*;
pub use size::*;

use std::sync::Arc;

use js_sys::Object;
use serde::{Deserialize, Serialize};
use usvg::fontdb::Database;
use usvg::Options as UsvgOptions;
use wasm_bindgen::prelude::*;

use crate::{get, set, FontDatabase, FontFace, FontFamilies};

#[wasm_bindgen(typescript_custom_section)]
pub const OPTIONS_LIKE_TYPE: &'static str = r#"
/**
 * Represents an "options-like" object, which shares the same properties as an
 * instance of the {@linkcode Options} class, but is not an instance of the
 * class itself. This is the type of object returnd by the `toJSON` method on
 * the `Options` class, among others.
 *
 * @category Types
 */
export type OptionsLike = {
  [K in keyof Options as (
    Options[K] extends (...a: any) => any ? never : K
  )]: Options[K];
};

"#;

/// Options for rendering SVGs.
///
/// This is an intermediate conversion type that is used to convert userland
/// options into the correct `UsvgOptions` type.
#[wasm_bindgen(inspectable)]
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(default, rename_all = "camelCase")]
pub struct Options {
  /// By default, the renderer runs a series of syntax tests on its SVG inputs,
  /// looking for several common problems that often cause the renderer to fail
  /// or produce a bad image. If this option is set to `true` or omitted, these
  /// issues will be automatically fixed where possible. If this behavior isn't
  /// desired, setting this to `false` will disable the autofixing process.
  ///
  /// @remarks The `usvg` library that this package uses under the hood is
  /// rather strict about the SVGs it accepts. Scenarios that will be
  /// automatically fixed:
  ///
  /// - Missing `xmlns` attribute
  /// - Missing `version` attribute
  /// - Missing closing `</svg>` tag
  /// - Missing XML document declaration (panics from this seem intermittent)
  ///
  /// Be aware that if this option is set to `false`, the renderer will be
  /// passed the input SVG exactly as-is. Think of disabling this option as
  /// being analogous to enabling a "strict" mode: if there are any syntax
  /// issues or missing attributes, errors will be thrown by the renderer.
  ///
  /// @default {true}
  #[serde(default)]
  #[wasm_bindgen(skip_jsdoc)]
  pub autofix: bool,

  /// Automatic

  /// Target DPI (dots per inch) for the SVG rendering. This value is used to
  /// convert units in the SVG to pixels. As such, the value of this setting
  /// directly impacts unit conversion behavior. For example, if the DPI is set
  /// to 96, then a 1-inch line in the SVG will be rendered as a 96-pixel line
  /// on the output image.
  ///
  /// @default {96}
  #[wasm_bindgen(skip_jsdoc)]
  pub dpi: f32,

  /// Set an explicit scale factor to use when rendering the SVG. This will
  /// cause the SVG to be rendered at a different size than normal, and its
  /// dimensions will be multiplied by the scale factor.
  ///
  /// For example, setting this to `2.0` will double the size of the rendered
  /// image, while setting it to `0.5` will render the image at half of the
  /// original size.The default value of `1.0` is a no-op.
  ///
  /// If you need to set the width and height of the output image explicitly,
  /// use {@linkcode Options.size} instead. If both are set, the scale will
  /// be applied to the dimensions set in the `size` property.
  ///
  /// @default {1.0}
  #[wasm_bindgen(skip_jsdoc)]
  pub scale: f32,

  /// Set the width and height of the output image. This is used to set the
  /// dimensions of the rendered image. The dimensions are set in pixels. If
  /// a scale factor is also set, the dimensions will be multiplied by that
  /// scale factor.
  ///
  /// @default {undefined}
  #[wasm_bindgen(skip_jsdoc)]
  pub size: Option<Size>,

  /// Default viewport size. These dimensions are used if there is no `viewBox`
  /// attribute on the outermost (root) `<svg>` element and the `width` or
  /// `height` attributes are relative.
  ///
  /// @default {{width:100,height:100}}
  #[wasm_bindgen(js_name = defaultSize)]
  pub default_size: Size,

  /// Default font family for when a `font-family` attribute is not in the SVG.
  ///
  /// Default: Times New Roman
  // #[wasm_bindgen(getter_with_clone, js_name = fontFamily)]
  #[wasm_bindgen(skip)]
  pub font_family: String,

  /// Default font size to use when no `font-size` attribute is set in the SVG.
  ///
  /// Default: 12
  #[wasm_bindgen(js_name = fontSize)]
  pub font_size: f32,

  /// Font faces to register with the font database, making them available for
  /// use in the SVG document.
  // #[wasm_bindgen(getter_with_clone, js_name = fontFaces)]
  #[wasm_bindgen(skip)]
  pub font_faces: Vec<FontFace>,

  /// Specifies the default font family to be used for each of the five generic
  /// font family names. This is used when an SVG element's `font-family` is
  /// set to `serif`, `sans-serif`, `cursive`, `fantasy`, or `monospace`.
  ///
  /// Family names must be registered with the font database using the
  /// `font_faces` property, and must **exactly** match the internal family
  /// name of a font face. Otherwise, there's a chance that no text will be
  /// rendered at all.
  // #[wasm_bindgen(getter_with_clone, js_name = fontFamilies)]
  #[wasm_bindgen(skip)]
  pub font_families: FontFamilies,

  /// Specifies the default shape rendering method to be used when an SVG
  /// element's `shape-rendering` property is set to `auto`.
  ///
  /// Default: GeometricPrecision
  // #[wasm_bindgen(getter_with_clone, js_name = shapeRendering)]
  #[wasm_bindgen(skip)]
  pub shape_rendering: ShapeRendering,

  /// Specifies the default text rendering method to be used when an SVG
  /// element's `text-rendering` property is set to `auto`.
  ///
  /// Default: OptimizeLegibility
  // #[wasm_bindgen(getter_with_clone, js_name = textRendering)]
  #[wasm_bindgen(skip)]
  pub text_rendering: TextRendering,

  /// Specifies the default image rendering method to be used when an SVG
  /// element's `image-rendering` property is set to `auto`.
  ///
  /// Default: OptimizeQuality
  // #[wasm_bindgen(getter_with_clone, js_name = imageRendering)]
  #[wasm_bindgen(skip)]
  pub image_rendering: ImageRendering,

  /// A CSS stylesheet that should be injected into the SVG. Can be used to
  /// overwrite certain attributes.
  // #[wasm_bindgen(getter_with_clone, js_name = styles)]
  #[wasm_bindgen(skip)]
  #[serde(rename = "styles", default)]
  pub style_sheet: Option<String>,

  /// Language list used to resolve a `systemLanguage` conditional attribute.
  ///
  /// Format: `en`, `en-US`. Default: `[en]`
  // #[wasm_bindgen(getter_with_clone)]
  #[wasm_bindgen(skip)]
  #[serde(default)]
  pub languages: Vec<String>,
}

#[wasm_bindgen]
impl Options {
  #[wasm_bindgen(constructor)]
  pub fn new(
    maybe_dpi: Option<f32>,
    maybe_scale: Option<f32>,
    maybe_size: Option<Size>,
    maybe_font_size: Option<f32>,
    maybe_font_faces: Option<Vec<FontFace>>,
    maybe_font_family: Option<String>,
    maybe_font_families: Option<FontFamilies>,
    maybe_style_sheet: Option<String>,
    maybe_autofix: Option<bool>,
    maybe_default_size: Option<Size>,
    maybe_shape_rendering: Option<ShapeRendering>,
    maybe_text_rendering: Option<TextRendering>,
    maybe_image_rendering: Option<ImageRendering>,
    maybe_languages: Option<Vec<String>>,
  ) -> Options {
    let mut options = Options::default();

    options.dpi = maybe_dpi.unwrap_or(options.dpi);
    options.default_size = maybe_default_size.unwrap_or(options.default_size);
    options.font_size = maybe_font_size.unwrap_or(options.font_size);
    options.font_faces = maybe_font_faces.unwrap_or(options.font_faces);
    options.font_families = maybe_font_families.unwrap_or(options.font_families);
    options.font_family = maybe_font_family.unwrap_or(options.font_families.default.clone());
    options.shape_rendering = maybe_shape_rendering.unwrap_or(options.shape_rendering);
    options.text_rendering = maybe_text_rendering.unwrap_or(options.text_rendering);
    options.image_rendering = maybe_image_rendering.unwrap_or(options.image_rendering);
    options.style_sheet = maybe_style_sheet.or(options.style_sheet);
    options.languages = maybe_languages.unwrap_or(options.languages);
    options.autofix = maybe_autofix.unwrap_or(options.autofix);
    options.size = maybe_size.or(options.size);
    options.scale = maybe_scale.unwrap_or(options.scale);

    options
  }

  #[wasm_bindgen(js_name = defaultOptions)]
  /// Creates a new `Options` object with default values.
  pub fn default_options() -> Self {
    let default_size = Size::default();
    let font_families = FontFamilies::default();
    let font_family = font_families.default.clone();
    let font_faces = Vec::new();
    let languages = vec!["en".into()];
    let image_rendering = ImageRendering::default();
    let shape_rendering = ShapeRendering::default();
    let text_rendering = TextRendering::default();

    Self {
      dpi: 96.0,
      scale: 1.0,
      size: None,
      default_size,
      font_faces,
      font_families,
      font_family,
      font_size: 12.0,
      languages,
      style_sheet: None,
      image_rendering,
      shape_rendering,
      text_rendering,
      autofix: true,
    }
  }

  /// Creates a new `Options` object with default values, converts it into a
  /// plain JavaScript object, and returns it. This is more or less the same
  /// as calling `Options.default().toJSON()`, but the conversion takes place
  /// entirely in Rust instead of in the JavaScript glue code.
  ///
  /// @returns {object} The default options object.
  #[wasm_bindgen(
    skip_jsdoc,
    js_name = defaultObject,
    unchecked_return_type = "OptionsLike"
  )]
  pub fn default_object() -> Object {
    let default: Options = Options::default_options();
    let obj: Object = default.into();
    obj
  }

  /// Creates a new `Options` object from a JSON string or object.
  ///
  /// @param {string | object} json The JSON string or object to parse.
  /// @returns {Options} The parsed options object.
  #[wasm_bindgen(skip_jsdoc, js_name = fromJSON)]
  pub fn from_json(
    #[wasm_bindgen(unchecked_param_type = "string | Options | OptionsLike")]
    json: JsValue,
  ) -> Options {
    if json.is_string() {
      let json = json.as_string().unwrap();
      let obj = js_sys::JSON::parse(&json).unwrap();
      obj.into()
    } else if json.is_object() {
      json.into()
    } else {
      Options::default_options()
    }
  }

  /// Default font family for when a `font-family` attribute is not in the SVG.
  ///
  /// Default: Times New Roman
  // #[wasm_bindgen(getter_with_clone, js_name = fontFamily)]
  #[wasm_bindgen(getter = fontFamily)]
  pub fn get_font_family(&self) -> String { self.font_family.clone() }

  #[wasm_bindgen(setter = fontFamily)]
  pub fn set_font_family(&mut self, font_family: String) { self.font_family = font_family; }

  /// Font faces to register with the font database, making them available for
  /// use in the SVG document.
  #[wasm_bindgen(getter = fontFaces)]
  pub fn get_font_faces(&self) -> Vec<FontFace> { self.font_faces.clone() }

  #[wasm_bindgen(setter = fontFaces)]
  pub fn set_font_faces(
    &mut self,
    #[wasm_bindgen(unchecked_param_type = "FontFace[]")]
    value: Vec<JsValue>
  ) {
    self.font_faces = value.into_iter().map(|ref v| {
      if v.is_object() {
        let font_face: FontFace = serde_wasm_bindgen::from_value(v.clone()).unwrap();
        font_face
      } else {
        panic!("Invalid font face object");
      }
    }).collect();
  }

  /// Specifies the default font family to be used for each of the five generic
  /// font family names. This is used when an SVG element's `font-family` is
  /// set to `serif`, `sans-serif`, `cursive`, `fantasy`, or `monospace`.
  ///
  /// Family names must be registered with the font database using the
  /// `font_faces` property, and must **exactly** match the internal family
  /// name of a font face. Otherwise, there's a chance that no text will be
  /// rendered at all.
  #[wasm_bindgen(getter = fontFamilies)]
  pub fn get_font_families(&self) -> FontFamilies { self.font_families.clone() }

  #[wasm_bindgen(setter = fontFamilies)]
  pub fn set_font_families(&mut self, value: FontFamilies) { self.font_families = value; }

  /// Specifies the default shape rendering method to be used when an SVG
  /// element's `shape-rendering` property is set to `auto`.
  ///
  /// @default {ShapeRendering.GeometricPrecision}
  #[wasm_bindgen(getter = shapeRendering)]
  pub fn get_shape_rendering(&self) -> ShapeRendering { self.shape_rendering.clone() }

  #[wasm_bindgen(setter = shapeRendering)]
  pub fn set_shape_rendering(
    &mut self,
    #[wasm_bindgen(unchecked_param_type = "ShapeRendering | `${ShapeRendering}` | null | undefined")]
    value: JsValue
  ) {
    if value.is_string() {
      let value = value.as_string().unwrap();
      self.shape_rendering = value.parse().expect("Invalid shape rendering");
    } else if value.js_typeof() == "number" {
      let value = value.as_f64().unwrap();
      self.shape_rendering = ShapeRendering::from(value as u32);
    } else if value.is_null() || value.is_undefined() {
      self.shape_rendering = ShapeRendering::default();
    } else {
      panic!("Invalid shape rendering value");
    }
  }

  /// Specifies the default text rendering method to be used when an SVG
  /// element's `text-rendering` property is set to `auto`.
  ///
  /// @default {TextRendering.OptimizeLegibility}
  #[wasm_bindgen(getter = textRendering)]
  pub fn get_text_rendering(&self) -> TextRendering { self.text_rendering.clone() }

  #[wasm_bindgen(setter = textRendering)]
  pub fn set_text_rendering(
    &mut self,
    #[wasm_bindgen(unchecked_param_type = "TextRendering | `${TextRendering}` | null | undefined")]
    value: JsValue
  ) {
    if value.is_string() {
      let value = value.as_string().unwrap();
      self.text_rendering = value.parse().expect("Invalid text rendering");
    } else if value.js_typeof() == "number" {
      let value = value.as_f64().unwrap();
      self.text_rendering = TextRendering::from(value as u32);
    } else if value.is_null() || value.is_undefined() {
      self.text_rendering = TextRendering::default();
    } else {
      panic!("Invalid text rendering value");
    }
  }

  /// Specifies the default image rendering method to be used when an SVG
  /// element's `image-rendering` property is set to `auto`.
  ///
  /// @default {ImageRendering.OptimizeQuality}
  #[wasm_bindgen(getter = imageRendering)]
  pub fn get_image_rendering(&self) -> ImageRendering { self.image_rendering.clone() }

  #[wasm_bindgen(setter = imageRendering)]
  pub fn set_image_rendering(
    &mut self,
    #[wasm_bindgen(unchecked_param_type = "ImageRendering | `${ImageRendering}` | null | undefined")]
    value: JsValue
  ) {
    if value.is_string() {
      let value = value.as_string().unwrap();
      self.image_rendering = value.parse().expect("Invalid image rendering");
    } else if value.js_typeof() == "number" {
      let value = value.as_f64().unwrap();
      self.image_rendering = ImageRendering::from(value as u32);
    } else if value.is_null() || value.is_undefined() {
      self.image_rendering = ImageRendering::default();
    } else {
      panic!("Invalid image rendering value");
    }
  }

  /// A CSS stylesheet that should be injected into the SVG. Can be used to
  /// overwrite certain attributes.
  #[wasm_bindgen(getter = styles)]
  pub fn get_style_sheet(&self) -> String { self.style_sheet.clone().unwrap_or_default() }

  pub fn set_style_sheet(&mut self, value: JsValue) {
    if value.is_string() {
      let value = value.as_string().unwrap();
      self.style_sheet = Some(value);
    } else if value.is_array() {
      let values: Vec<String> = serde_wasm_bindgen::from_value(value).unwrap();
      let css = values
        .into_iter()
        .collect::<Vec<String>>()
        .join("\n");
      self.style_sheet = Some(css);
    } else if value.is_null() || value.is_undefined() {
      self.style_sheet = None;
    } else {
      panic!("Invalid style sheet value");
    }
  }

  /// Language list used to resolve a `systemLanguage` conditional attribute.
  ///
  /// Format: `en`, `en-US`. Default: `[en]`
  #[wasm_bindgen(getter = languages)]
  pub fn get_languages(&self) -> Vec<String> { self.languages.clone() }

  #[wasm_bindgen(setter = languages)]
  pub fn set_languages(&mut self, value: Vec<String>) {
    self.languages = value;
  }
}

impl Default for Options {
  fn default() -> Self { Options::default_options() }
}

impl From<Options> for Object {
  fn from(options: Options) -> Self {
    let obj = Object::new();

    set!(obj, "autofix", options.autofix);
    set!(obj, "defaultSize", options.default_size);
    set!(obj, "dpi", options.dpi);
    set!(obj, "fontFaces", options.font_faces);
    set!(obj, "fontFamilies", options.font_families);
    set!(obj, "fontFamily", options.font_family);
    set!(obj, "fontSize", options.font_size);
    set!(obj, "styles", options.style_sheet);
    set!(obj, "imageRendering", options.image_rendering);
    set!(obj, "shapeRendering", options.shape_rendering);
    set!(obj, "textRendering", options.text_rendering);
    set!(obj, "languages", options.languages);

    obj
  }
}

impl From<JsValue> for Options {
  fn from(value: JsValue) -> Self {
    if value.is_object() {
      // if value is an POJO, try to convert it into an Options instance.
      let obj: Object = value.into();
      obj.into()
    } else if value.is_string() {
      // if its a string, we assume its a serialized JSON object.
      // so we attempt to parse and convert it into an Options instance.
      // if the string is invalid JSON, this will panic.
      let json = value.as_string().unwrap();
      let obj = js_sys::JSON::parse(&json).unwrap();
      obj.into()
    } else {
      Options::default()
    }
  }
}

impl From<Object> for Options {
  fn from(obj: Object) -> Self {
    let default = Options::default_options();
    let dpi = get!(obj, "dpi", default.dpi);
    let default_size = get!(obj, ["defaultSize", "default_size"], default.default_size);
    let font_size = get!(obj, ["fontSize", "font_size"], default.font_size);
    let scale = get!(obj, "scale", default.scale);
    let size = get!(obj, "size", default.size);
    let font_faces = get!(
      obj,
      ["fonts", "fontFaces", "font_faces"],
      default.font_faces
    );
    let font_families = get!(
      obj,
      ["fontFamilies", "font_families", "families"],
      default.font_families
    );
    let font_family = get!(obj, ["fontFamily", "font_family"], default.font_family);
    let shape_rendering: ShapeRendering = get!(
      obj,
      ["shapeRendering", "shape_rendering"],
      default.shape_rendering
    );
    let text_rendering: TextRendering = get!(
      obj,
      ["textRendering", "text_rendering"],
      default.text_rendering
    );
    let image_rendering: ImageRendering = get!(
      obj,
      ["imageRendering", "image_rendering"],
      default.image_rendering,
    );
    let style_sheet = get!(
      obj,
      ["styles", "styleSheet", "stylesheet", "style_sheet"],
      default.style_sheet
    );
    let languages = get!(obj, "languages", default.languages);
    let autofix = get!(obj, "autofix", default.autofix);

    Options {
      dpi,
      size,
      scale,
      default_size,
      font_size,
      font_faces,
      font_families,
      font_family,
      shape_rendering,
      text_rendering,
      image_rendering,
      style_sheet,
      languages,
      autofix,
    }
  }
}

impl From<Options> for Database {
  fn from(options: Options) -> Self {
    let db = FontDatabase::from(options);
    let fontdb = db.clone();
    fontdb.into()
  }
}

impl From<Options> for Arc<Database> {
  fn from(options: Options) -> Self {
    let db = FontDatabase::from(options);
    db.db
  }
}

impl<'a> From<Options> for UsvgOptions<'a> {
  fn from(options: Options) -> Self {
    let mut inner: UsvgOptions<'static> = UsvgOptions::default();
    inner.dpi = options.dpi;
    inner.default_size = options.default_size.into();
    inner.font_family = options.font_family.clone();
    inner.font_size = options.font_size;
    inner.shape_rendering = *options.shape_rendering;
    inner.text_rendering = *options.text_rendering;
    inner.image_rendering = *options.image_rendering;
    inner.languages = options.languages.clone();
    inner.style_sheet = if let Some(css) = options.style_sheet.clone() {
      Some(css.clone())
    } else {
      None
    };
    inner.fontdb = options.into();

    inner
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_default_options() {
    let options = Options::default();

    assert_eq!(options.dpi, 96.0);
    assert_eq!(options.size, None);
    assert_eq!(options.scale, 1.0);
    assert_eq!(options.autofix, true);
    assert_eq!(options.font_size, 12.0);
    assert_eq!(options.style_sheet, None);
    assert_eq!(options.languages, vec!["en"]);
    assert_eq!(options.font_faces, Vec::new());
    assert_eq!(options.default_size, Size::default());
    assert_eq!(options.font_families, FontFamilies::default());
    #[cfg(feature = "font-gotham")]
    assert_eq!(options.font_family, "Gotham Narrow ScreenSmart");
    #[cfg(feature = "font-inter")]
    assert_eq!(options.font_family, "Inter");
    assert_eq!(options.text_rendering, TextRendering::default());
    assert_eq!(options.image_rendering, ImageRendering::default());
    assert_eq!(options.shape_rendering, ShapeRendering::default());
  }

  #[test]
  fn test_options_into_usvg_options() {
    let options = Options::default();
    let usvg_options: UsvgOptions = options.into();

    assert_eq!(usvg_options.dpi, 96.0);
    assert_eq!(usvg_options.default_size, Size::default().into());
    assert_eq!(usvg_options.font_size, 12.0);
    assert_eq!(usvg_options.font_family, "Gotham Narrow ScreenSmart");
    assert_eq!(
      usvg_options.shape_rendering,
      usvg::ShapeRendering::default()
    );
    assert_eq!(usvg_options.text_rendering, usvg::TextRendering::default());
    assert_eq!(
      usvg_options.image_rendering,
      usvg::ImageRendering::default()
    );
    assert_eq!(usvg_options.style_sheet, None);
    assert_eq!(usvg_options.languages, vec!["en"]);
  }

  #[test]
  fn test_default_font_data() {
    let font_data = FontFamilies::default();

    assert_eq!(font_data.default, "Gotham Narrow ScreenSmart");
    assert_eq!(font_data.sans_serif, "Gotham Narrow ScreenSmart");
    assert_eq!(font_data.serif, "Sentinel ScreenSmart");
    assert_eq!(font_data.monospace, "OperatorMono Nerd Font");
    assert_eq!(font_data.cursive, "Inkwell Script");
    assert_eq!(font_data.fantasy, "Inkwell Blackletter");
  }
}
