#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct ParseError<T> {
  pub(crate) _priv: ::core::marker::PhantomData<T>,
}

#[macro_export]
macro_rules! impl_linked_enum {
  (
    $(
      $(#[$outer_meta:meta])*
      $vis:vis
      $from:ident =>
      $to:path { $($(#[$inner_meta:meta])* $variant:ident = $value:expr $(=> $alias:literal)?),+ $(,)? }
    ),+ $(,)?
  ) => {
    $(
      $(#[$outer_meta])*
      $vis enum $from {
        $( $(#[$inner_meta])* $variant = $value, )+
      }
      $crate::impl_from_enum!($from => $to { $( $variant ),+ });
      $crate::impl_from_numeric! {
        [u8, u16, u64, usize, i8, i16, i32, i64, isize] for $from
      }

      impl $from {
        pub fn as_str(&self) -> &'static str {
          match self {
            $( <$from>::$variant => {
              #[allow(unused_mut, unused_assignments)]
              let mut s = stringify!($variant);
              $( s = $alias; )?
              s
            } ),+
          }
        }
      }
      impl ::core::convert::From<u32> for $from {
        fn from(value: u32) -> Self {
          match value {
            $( $value => $from::$variant, )+
            _ => panic!("Invalid value for {}", stringify!($from))
          }
        }
      }
      impl ::core::fmt::Display for $from {
        fn fmt(&self, f: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
          write!(f, "{}", match self {
            $( <$from>::$variant => stringify!($variant), )+
          })
        }
      }

      $crate::impl_linked_enum!(@from_str $from => ParseError<$from> { $( $variant = $value $( => $alias )? ),+ });

      impl ::core::convert::From<$from> for String {
        fn from(mode: $from) -> String {
          mode.as_str().to_string()
        }
      }
      impl ::core::convert::From<$from> for &'static str {
        fn from(mode: $from) -> &'static str {
          match mode {
            $( <$from>::$variant => mode.as_str(), )+
          }
        }
      }
      impl ::core::convert::From<::wasm_bindgen::JsValue> for $from {
        fn from(value: ::wasm_bindgen::JsValue) -> Self {
          if let Some(f) = value.as_f64() {
            return (f as u32).into();
          } else if let Some(s) = value.as_string() {
            return s.parse::<$from>().unwrap();
          } else {
            panic!("Invalid value for {}", stringify!($from));
          }
        }
      }
      impl<'de> ::serde::Deserialize<'de> for $from {
        fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
        where
          D: ::serde::Deserializer<'de>,
        {
          struct Visitor;

          impl<'de> ::serde::de::Visitor<'de> for Visitor {
            type Value = $from;

            fn expecting(&self, formatter: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
              formatter.write_str("a valid string or numeric value")
            }

            fn visit_str<E>(self, value: &str) -> Result<Self::Value, E>
            where
              E: ::serde::de::Error,
            {
              value.parse::<$from>().map_err(E::custom)
            }

            fn visit_u64<E>(self, value: u64) -> Result<Self::Value, E>
            where
              E: ::serde::de::Error,
            {
              Ok((value as u32).into())
            }

            fn visit_f64<E>(self, value: f64) -> Result<Self::Value, E>
            where
              E: ::serde::de::Error,
            {
              Ok((value as u32).into())
            }

            fn visit_i64<E>(self, value: i64) -> Result<Self::Value, E>
            where
              E: ::serde::de::Error,
            {
              Ok((value as u32).into())
            }

            fn visit_u32<E>(self, value: u32) -> Result<Self::Value, E>
            where
              E: ::serde::de::Error,
            {
              Ok(value.into())
            }

            fn visit_i32<E>(self, value: i32) -> Result<Self::Value, E>
            where
              E: ::serde::de::Error,
            {
              Ok((value as u32).into())
            }
          }

          deserializer.deserialize_any(Visitor)
        }
      }
    )+
  };

  (
    @from_str
    $from:ident =>
    $error:ty { $($variant:ident = $value:expr $(=> $alias:literal)?),+ $(,)? } $(,)?
  ) => {

    impl ::core::fmt::Display for $crate::macros::impl_linked_enum::ParseError<$from> {
      fn fmt(&self, f: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
        write!(f, "Invalid value for {}", stringify!($from))
      }
    }

    impl ::core::str::FromStr for $from {
      type Err = $crate::macros::impl_linked_enum::ParseError<$from>;

      fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
          $(
            stringify!($variant) | stringify!($value) $( | $alias )? => {
              Ok($from::$variant)
            },
          )+
          _ => Err(
            $crate::macros::impl_linked_enum::ParseError::<$from> {
              _priv: ::core::marker::PhantomData,
            }
          )
        }
      }
    }
  };
}

#[cfg(test)]
mod impl_linked_enum_tests {
  use ::usvg::ImageRendering as ExternalEnum;

  impl_linked_enum! {
    #[derive(Debug, Clone, Default, PartialEq, Eq)]
    pub(crate) PubCrateLocalEnum => ExternalEnum {
      #[default]
      OptimizeQuality = 0,
      OptimizeSpeed = 1,
    }
  }

  #[test]
  fn test_linked_enum() {
    let opt_quality: PubCrateLocalEnum = ExternalEnum::OptimizeQuality.into();
    let opt_speed: PubCrateLocalEnum = ExternalEnum::OptimizeSpeed.into();
    let opt_quality: ExternalEnum = opt_quality.into();
    let opt_speed: ExternalEnum = opt_speed.into();

    assert_eq!(opt_quality, ExternalEnum::OptimizeQuality);
    assert_eq!(opt_speed, ExternalEnum::OptimizeSpeed);
  }

  #[test]
  fn test_linked_enum_deref_as_ref() {
    let opt_quality: ExternalEnum = *PubCrateLocalEnum::OptimizeQuality;
    assert_eq!(opt_quality, ExternalEnum::OptimizeQuality);

    let opt_speed: ExternalEnum = *PubCrateLocalEnum::OptimizeSpeed;
    assert_eq!(opt_speed, ExternalEnum::OptimizeSpeed);

    let opt_quality: &ExternalEnum = PubCrateLocalEnum::OptimizeQuality.as_ref();
    assert_eq!(opt_quality, &ExternalEnum::OptimizeQuality);

    let opt_speed: &ExternalEnum = PubCrateLocalEnum::OptimizeSpeed.as_ref();
    assert_eq!(opt_speed, &ExternalEnum::OptimizeSpeed);

    assert_eq!(
      ExternalEnum::OptimizeQuality,
      *PubCrateLocalEnum::OptimizeQuality,
    );

    assert_eq!(
      &ExternalEnum::OptimizeSpeed,
      &*PubCrateLocalEnum::OptimizeSpeed,
    );
  }

  #[test]
  fn test_linked_enum_from_str() {
    let opt_quality: PubCrateLocalEnum = "OptimizeQuality".parse().unwrap();
    assert_eq!(opt_quality, PubCrateLocalEnum::OptimizeQuality);

    let opt_speed: PubCrateLocalEnum = "OptimizeSpeed".parse().unwrap();
    assert_eq!(opt_speed, PubCrateLocalEnum::OptimizeSpeed);

    let opt_quality: PubCrateLocalEnum = "0".parse().unwrap();
    assert_eq!(opt_quality, PubCrateLocalEnum::OptimizeQuality);

    let opt_speed: PubCrateLocalEnum = "1".parse().unwrap();
    assert_eq!(opt_speed, PubCrateLocalEnum::OptimizeSpeed);
  }
}
