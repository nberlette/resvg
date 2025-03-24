#![allow(dead_code)]

use wasm_bindgen::prelude::*;

cfg_if::cfg_if! {
  if #[cfg(feature = "internal-debug")] {
    #[wasm_bindgen]
    extern "C" {
      #[wasm_bindgen(js_namespace = console)]
      pub fn console_log(s: &str);

      #[wasm_bindgen(js_namespace = console)]
      pub fn console_error(s: &str);

      #[wasm_bindgen(js_namespace = console)]
      pub fn console_warn(s: &str);

      #[wasm_bindgen(js_namespace = console)]
      pub fn console_table(o: JsValue);
    }
  } else {
    pub fn console_log(_: &str) {}
    pub fn console_error(_: &str) {}
    pub fn console_warn(_: &str) {}
    pub fn console_table(_: JsValue) {}
  }
}

#[macro_export]
macro_rules! console {
  (@table $($t:tt $(,)?)+) => ($crate::macros::console::console_table(::serde_wasm_bindgen::to_value([$($t),+]).unwrap()));

  (@warn $($t:tt $(,)?)+) => ($crate::macros::console::console_warn(&::core::format_args!($($t)+).to_string()));

  (@error $($t:tt $(,)?)+) => ($crate::macros::console::console_error(&::core::format_args!($($t)+).to_string()));

  (@log $($t:tt $(,)?)+) => ($crate::macros::console::console_log(&::core::format_args!($($t)+).to_string()));

  ($($t:tt),* $(,)?) => ($crate::macros::console::console_warn(&::core::format_args!($($t),*).to_string()));
}
