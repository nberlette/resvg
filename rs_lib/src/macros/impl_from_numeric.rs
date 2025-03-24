#[macro_export]
macro_rules! impl_from_numeric {
  ($([$($from:ty),* $(,)?]for $to:path $(,)?),+ $(,)?) => {
    $(
      impl Into<u32> for $to {
        fn into(self) -> u32 {
          self as u32
        }
      }

      $(
        impl From<$from> for $to {
          fn from(from: $from) -> $to {
            <$to>::from(from as u32)
          }
        }
        impl From<$to> for $from where $to: Into<u32>,
        {
          fn from(to: $to) -> $from {
            let intermediate: u32 = to.into();
            intermediate as $from
          }
        }
      )*
    )+
  };
}
