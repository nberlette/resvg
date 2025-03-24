use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

// use usvg::fontdb::{Database, FaceInfo, Source};
// use super::FontFamilies;

#[wasm_bindgen(inspectable)]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FontFace {
  #[wasm_bindgen(getter_with_clone)]
  pub kind: String,

  #[wasm_bindgen(getter_with_clone)]
  pub name: String,

  // #[serde(with = "serde_wasm_bindgen::preserve")]
  // #[wasm_bindgen(getter_with_clone)]
  // pub data: Uint8Array,
  #[wasm_bindgen(getter_with_clone)]
  pub data: Vec<u8>,

  #[serde(default)]
  pub default: bool,
}

impl Default for FontFace {
  fn default() -> Self { FontFace::default_fontface() }
}

#[wasm_bindgen]
impl FontFace {
  #[wasm_bindgen(constructor)]
  pub fn new(
    kind: Option<String>,
    name: Option<String>,
    data: Option<Vec<u8>>,
    is_default: Option<bool>,
  ) -> Self {
    let face: FontFace = Default::default();
    let kind: String = kind.unwrap_or(face.kind);
    let name: String = name.unwrap_or_default();
    // let data: Uint8Array = data.unwrap_or_default();
    let data: Vec<u8> = data.unwrap_or_default().to_vec();
    let default: bool = is_default.unwrap_or(face.default);

    Self {
      kind,
      name,
      data,
      default,
    }
  }

  #[wasm_bindgen(js_name = defaultFontFace)]
  pub fn default_fontface() -> Self {
    Self {
      kind: "sans-serif".to_string(),
      name: String::new(),
      data: Vec::new(),
      default: false,
    }
  }

  #[wasm_bindgen(getter, js_name = "type")]
  pub fn get_type(&self) -> String { self.kind.clone() }

  #[wasm_bindgen(setter, js_name = "type")]
  pub fn set_type(&mut self, kind: String) { self.kind = kind; }
}

impl PartialEq for FontFace {
  fn eq(&self, other: &Self) -> bool {
    self.kind == other.kind
      && self.name == other.name
      && self.default == other.default
      && &self.data == &other.data
  }
}

impl Eq for FontFace {}

impl PartialOrd for FontFace {
  fn partial_cmp(&self, other: &Self) -> Option<::core::cmp::Ordering> { Some(self.cmp(other)) }
}

impl Ord for FontFace {
  fn cmp(&self, other: &Self) -> ::core::cmp::Ordering {
    self
      .kind
      .cmp(&other.kind)
      .then_with(|| self.name.cmp(&other.name))
      .then_with(|| self.default.cmp(&other.default))
      .then_with(|| self.data.cmp(&other.data))
  }
}
