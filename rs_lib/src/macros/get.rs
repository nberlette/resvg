#[macro_export]
macro_rules! get {
  ($obj:expr,[$key1:literal, $($key:literal),+ $(,)?] $(,)?) => {{
    let mut value = None;
    $(
      value = get!($obj, $key);
      if value.is_some() {
        return value;
      }
    )+
    // first key gets first priority
    get!($obj, $key1)
  }};
  ($obj:expr, $key:literal $(,)?) => {{
    use ::serde_wasm_bindgen::{to_value, from_value};
    use ::js_sys::Reflect;

    let js_value = Reflect::get(&$obj, &to_value($key).unwrap());
    from_value(js_value.unwrap_or_default())
  }};
  ($obj:expr,[$key1:literal, $($key:literal),+ $(,)?], $default:expr $(,)?) => {{
    let mut value = get!($obj, $key1, $default);
    $(
      value = get!($obj, $key, value);
    )+
    // first key gets first priority
    value
  }};
  ($obj:expr, $key:literal, $default:expr $(,)?) => {{
    use ::serde_wasm_bindgen::{to_value, from_value};
    use ::js_sys::Reflect;

    let js_value = Reflect::get(&$obj, &to_value($key).unwrap());
    let value = $default;
    from_value(js_value.unwrap_or_default()).unwrap_or(value)
  }};
}

#[macro_export]
macro_rules! get_from {
  ($obj:expr,[$key1:literal, $($key:literal),+ $(,)?] $(,)?) => {{
    $(
      if let Some(value) = get_from!($obj, $key) {
        return value;
      }
    )+
    // first key gets first priority
    get_from!($obj, $key1, value)
  }};
  ($obj:expr, $key:literal $(,)?) => {{
    use ::serde_wasm_bindgen::to_value;
    use ::js_sys::Reflect;

    let js_value = Reflect::get(&$obj, &to_value($key).unwrap());
    let value = js_value.unwrap_or_default();
    value.into()
  }};
  ($ty:ty => $obj:expr, $key:literal $(,)?) => {{
    use ::serde_wasm_bindgen::{to_value, from_value};
    use ::js_sys::Reflect;

    let js_value = Reflect::get(&$obj, &to_value($key).unwrap());
    let value: $ty = from_value(js_value).unwrap_or_default();
    value.into()
  }};
  ($ty:ty => $obj:expr,[$key1:literal, $($key:literal),+ $(,)?], $default:expr $(,)?) => {{
    let mut value: $ty = get_from!($obj, $key1, $default);
    $(
      value = get_from!($obj, $key, value);
    )+
    value
  }};
  ($ty:ty => $obj:expr, $key:literal, $default:expr $(,)?) => {{
    use ::serde_wasm_bindgen::to_value;
    use ::js_sys::Reflect;

    let js_value = Reflect::get(&$obj, &to_value($key).unwrap());
    let default_value = $default;
    let value: $ty = js_value.unwrap_or_default().into();
    value.unwrap_or(default_value)
  }};
  ($obj:expr, $key:literal, $default:expr $(,)?) => {{
    use ::serde_wasm_bindgen::to_value;
    use ::js_sys::Reflect;

    let js_value = Reflect::get(&$obj, &to_value($key).unwrap());
    let default_value = $default;
    let value = js_value.unwrap_or(to_value(&default_value).unwrap());
    value.into()
  }};
}
