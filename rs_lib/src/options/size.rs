use core::ops::Deref;

use js_sys::{Object, JSON};
use serde::{Deserialize, Serialize};
use serde_wasm_bindgen::from_value;
use wasm_bindgen::prelude::*;

use crate::{get, set};

#[derive(Debug, Clone, Copy, PartialEq, PartialOrd, Serialize, Deserialize)]
#[wasm_bindgen(inspectable)]
pub struct Size {
  pub(crate) width: f32,
  pub(crate) height: f32,
}

#[wasm_bindgen]
impl Size {
  #[wasm_bindgen(constructor)]
  pub fn new(width: f32, height: f32) -> Self { Self { width, height } }

  #[wasm_bindgen(getter, js_name = width)]
  pub fn get_width(&self) -> f32 { self.width }

  #[wasm_bindgen(setter, js_name = width)]
  pub fn set_width(&mut self, width: f32) { self.width = width; }

  #[wasm_bindgen(getter, js_name = height)]
  pub fn get_height(&self) -> f32 { self.height }

  #[wasm_bindgen(setter, js_name = height)]
  pub fn set_height(&mut self, height: f32) { self.height = height; }
}

impl Default for Size {
  fn default() -> Self { Self::new(100.0, 100.0) }
}

impl From<Size> for (f32, f32) {
  fn from(size: Size) -> Self { (size.width, size.height) }
}

impl From<(f32, f32)> for Size {
  fn from(size: (f32, f32)) -> Self {
    Self {
      width: size.0,
      height: size.1,
    }
  }
}

impl From<::usvg::Size> for Size {
  fn from(size: ::usvg::Size) -> Self {
    Self {
      width: size.width(),
      height: size.height(),
    }
  }
}

impl From<Size> for ::usvg::Size {
  fn from(size: Size) -> Self { Self::from_wh(size.width, size.height).unwrap() }
}

impl From<&Size> for &::usvg::Size {
  fn from(size: &Size) -> Self { (&size.clone()).into() }
}

impl Deref for Size {
  type Target = ::usvg::Size;

  fn deref(&self) -> &Self::Target { self.into() }
}

impl AsRef<::usvg::Size> for Size {
  fn as_ref(&self) -> &::usvg::Size { self.into() }
}

impl From<Object> for Size {
  fn from(obj: Object) -> Self {
    let width = get!(obj, ["width", "w"], 100.0);
    let height = get!(obj, ["height", "h"], 100.0);
    Self::new(width, height)
  }
}

impl From<Size> for Object {
  fn from(size: Size) -> Self {
    let obj = Object::new();
    set!(obj, "width", &size.width);
    set!(obj, "height", &size.height);
    obj
  }
}

#[wasm_bindgen]
impl Size {
  /// Converts `Size` to a JavaScript object.
  #[wasm_bindgen(js_name = toObject)]
  pub fn to_object(&self) -> Object { self.clone().into() }

  /// Converts a JSON-encoded string or object into a `Size` instance.
  #[wasm_bindgen(js_name = fromJSON)]
  pub fn from_json(json: JsValue) -> Result<Size, JsValue> {
    if json.is_string() {
      let string = json.as_string().unwrap();
      let value = JSON::parse(&string).unwrap_throw();
      let size: Size = from_value(value).unwrap_throw();
      Ok(size)
    } else if json.is_object() {
      let obj = Object::try_from(&json).unwrap();
      Ok(Size::from(obj.clone()))
    } else {
      Err(JsValue::from_str("Invalid JSON value"))
    }
  }
}
