use js_sys::Object;
use serde::{Deserialize, Serialize};
use usvg::fontdb::Family;
use wasm_bindgen::prelude::*;

use super::FontDatabase;
use crate::{get, set};
/// Represents the default font families for each of the five generic font
/// types that can be used in an SVG document, as well as the default font
/// family if no generic type is specified at all.
#[wasm_bindgen(inspectable, getter_with_clone)]
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FontFamilies {
  /// The font family to use when no `font-family` attribute is set in the SVG.
  pub default: String,
  /// The `sans-serif` font family.
  pub sans_serif: String,
  /// The `serif` font family.
  pub serif: String,
  /// The `monospace` font family.
  pub monospace: String,
  /// The `cursive` font family.
  pub cursive: String,
  /// The `fantasy` font family.
  pub fantasy: String,
}

#[wasm_bindgen]
impl FontFamilies {
  /// Converts a plain JavaScript object - or a JSON string that can be parsed
  /// into such an object with a valid structure - into a `FontFamilies`
  /// instance.
  ///
  /// This is a convenience method that is used internally to convert userland
  /// POJOs into valid `FontFamilies` instances that can be used by the
  /// renderer.
  ///
  /// @param {string | object} json - The JavaScript object or JSON string to
  /// convert.
  /// @returns {FontFamilies} - The converted `FontFamilies` instance.
  #[wasm_bindgen(skip_jsdoc, js_name = fromJSON)]
  pub fn from_json(json: JsValue) -> Result<FontFamilies, JsValue> {
    if json.is_string() {
      let parsed = ::js_sys::JSON::parse(&json.as_string().unwrap().as_str())?;
      Ok(FontFamilies::from_json(parsed)?)
    } else if json.is_object() {
      let obj = Object::try_from(&json).unwrap();
      Ok(FontFamilies::from(obj.clone()))
    } else {
      Err(JsValue::from_str("Invalid JSON value"))
    }
  }

  /// Converts the `FontFamilies` instance into a plain JavaScript object.
  #[wasm_bindgen(js_name = toObject)]
  pub fn to_object(&self) -> Object { self.clone().into() }
}

impl Default for FontFamilies {
  /// Creates a new `FontFamilies` instance with the default font families.
  fn default() -> Self {
    let fontdb: FontDatabase = Default::default();

    FontFamilies {
      default: fontdb.family_name(&Family::SansSerif).to_string(),
      sans_serif: fontdb.family_name(&Family::SansSerif).to_string(),
      serif: fontdb.family_name(&Family::Serif).to_string(),
      monospace: fontdb.family_name(&Family::Monospace).to_string(),
      cursive: fontdb.family_name(&Family::Cursive).to_string(),
      fantasy: fontdb.family_name(&Family::Fantasy).to_string(),
    }
  }
}

// impl From<Database> for FontFamilies {
//   fn from(fontdb: Database) -> Self { FontFamilies::from_database(fontdb) }
// }

// impl From<FontDatabase> for FontFamilies {
//   fn from(fontdb: FontDatabase) -> Self { FontFamilies::from_database(&fontdb.into()) }
// }

impl From<Object> for FontFamilies {
  fn from(obj: Object) -> Self {
    let default_data = FontFamilies::default();
    let default = get!(obj, "default", default_data.default);
    let sans_serif = get!(
      obj,
      ["sans", "sans_serif", "sansSerif", "sans-serif"],
      default_data.sans_serif
    );
    let serif = get!(obj, "serif", default_data.serif);
    let monospace = get!(
      obj,
      ["monospace", "mono", "typewriter"],
      default_data.monospace
    );
    let cursive = get!(
      obj,
      ["cursive", "script", "handwriting"],
      default_data.cursive
    );
    let fantasy = get!(
      obj,
      ["fantasy", "decorative", "display"],
      default_data.fantasy
    );

    FontFamilies {
      default,
      sans_serif,
      serif,
      monospace,
      cursive,
      fantasy,
    }
  }
}

impl From<FontFamilies> for Object {
  fn from(font_data: FontFamilies) -> Self {
    let obj = Object::new();

    set!(obj, "default", font_data.default);
    set!(obj, "sans_serif", font_data.sans_serif);
    set!(obj, "serif", font_data.serif);
    set!(obj, "monospace", font_data.monospace);
    set!(obj, "cursive", font_data.cursive);
    set!(obj, "fantasy", font_data.fantasy);

    obj
  }
}
