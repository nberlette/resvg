#[macro_export]
macro_rules! impl_from_enum {
  ($from:ty => $to:path { $($variant:ident),+ $(,)? } $(,)?) => {
    impl ::core::convert::From<$from> for $to {
      fn from(value: $from) -> $to {
        match value {
          $( <$from>::$variant => <$to>::$variant, )+
        }
      }
    }
    impl ::core::convert::From<$to> for $from {
      fn from(value: $to) -> $from {
        match value {
          $( <$to>::$variant => <$from>::$variant, )+
        }
      }
    }
    impl<'f> ::core::convert::From<&'f $from> for $to {
      fn from(value: &'f $from) -> $to {
        match value { $( <$from>::$variant => <$to>::$variant ),+ }
      }
    }
    impl<'t> ::core::convert::From<$from> for &'t $to {
      fn from(value: $from) -> &'t $to {
        match value { $( <$from>::$variant => &<$to>::$variant ),+ }
      }
    }
    impl<'tf> ::core::convert::From<&'tf $from> for &'tf $to {
      fn from(value: &'tf $from) -> &'tf $to {
        match value { $( <$from>::$variant => &<$to>::$variant ),+ }
      }
    }
    impl<'f> ::core::convert::From<$to> for &'f $from {
      fn from(value: $to) -> &'f $from {
        match value { $( <$to>::$variant => &<$from>::$variant ),+ }
      }
    }
    impl<'t> ::core::convert::From<&'t $to> for $from {
      fn from(value: &'t $to) -> $from {
        match value { $( <$to>::$variant => <$from>::$variant ),+ }
      }
    }
    impl<'tf> ::core::convert::From<&'tf $to> for &'tf $from {
      fn from(value: &'tf $to) -> &'tf $from {
        match value { $( <$to>::$variant => &<$from>::$variant ),+ }
      }
    }
    impl ::std::ops::Deref for $from {
      type Target = $to;
      fn deref(&self) -> &Self::Target { self.into() }
    }
    impl ::core::convert::AsRef<$to> for $from {
      fn as_ref(&self) -> &$to { self.into() }
    }
    impl<'tf> ::core::convert::AsRef<$from> for &'tf $to {
      fn as_ref(&self) -> &'tf $from { (*self).into() }
    }
  };
}
