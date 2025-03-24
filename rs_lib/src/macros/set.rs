#[macro_export]
macro_rules! set {
  ($obj:expr, $key:literal, $value:expr $(,)?) => {{
    use ::js_sys::Reflect;
    use ::serde_wasm_bindgen::to_value;

    let key = to_value(&$key).unwrap();
    let value = to_value(&$value).unwrap_or_default();
    Reflect::set(&$obj, &key, &value).unwrap_throw()
  }};
}
