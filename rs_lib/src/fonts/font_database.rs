#![allow(unused_mut)]
#![allow(unused_macros)]

use std::ops::{Deref, DerefMut};
use std::sync::Arc;

use lazy_static::lazy_static;
use usvg::fontdb::*;
use usvg::Options as UsvgOptions;

use super::FontFace;
use crate::Options;

macro_rules! inc {
  ($file:expr) => {
    if cfg!(feature = "brotli") {
      inc!(@inner concat!($file, ".br"))
    } else {
      inc!(@inner $file)
    }
  };

  (@inner $file:expr) => {
    Arc::new($crate::utils::decompress(include_bytes!(concat!(
      "../../../fonts/",
      $file
    ))))
  };
}

lazy_static! {
  /// Default font faces bundled with the binary.
  pub(crate) static ref DEFAULT_FONT_FACES: Vec<Arc<dyn AsRef<[u8]> + Send + Sync + 'static>> = if cfg!(feature = "lite") {
    vec![]
  } else {
    vec![
      // [serif] SentinelSSm-Book
      #[cfg(feature = "font-sentinel")]
      inc!("Sentinel/SentinelSSm-Book.otf"),
      #[cfg(feature = "font-sentinel")]
      inc!("Sentinel/SentinelSSm-Bold.otf"),

      // [sans-serif] GothamNarrSSm-Book
      #[cfg(feature = "font-gotham")]
      inc!("Gotham/GothamNarrSSm-Book.otf"),
      #[cfg(feature = "font-gotham")]
      inc!("Gotham/GothamNarrSSm-Bold.otf"),

      // [monospace] OperatorMonoNerd-Book
      #[cfg(feature = "font-operator-nerd")]
      inc!("OperatorMonoNerd/OperatorMonoNerd-Book.ttf"),
      // // [monospace] OperatorMonoNerd-Italics
      // inc!("OperatorMonoNerd/OperatorMonoNerd-Italic.ttf"),

      // [cursive] InkwellScript-Book
      #[cfg(feature = "font-inkwell")]
      inc!("Inkwell/InkwellScript-Book.otf"),
      // [fantasy] InkwellBlackletter-Book
      #[cfg(feature = "font-inkwell")]
      inc!("Inkwell/InkwellBlackletter-Book.otf"),
      // [fantasy] InkwellBlackletter-Bold
      #[cfg(feature = "font-inkwell")]
      inc!("Inkwell/InkwellBlackletter-Bold.otf"),

      // // [fantasy] Obsidian-Roman
      #[cfg(feature = "font-obsidian")]
      inc!("Obsidian/Obsidian-Roman.otf"),
      // [fantasy] Obsidian-Italic
      #[cfg(feature = "font-obsidian")]
      inc!("Obsidian/Obsidian-Italic.otf"),

      // [other] Numbers
      #[cfg(feature = "font-numbers")]
      inc!("Numbers/Numbers.ttc"),

      // [sans-serif] Decimal
      #[cfg(feature = "font-decimal")]
      inc!("Decimal/Decimal-Thin.ttf"),
      #[cfg(feature = "font-decimal")]
      inc!("Decimal/Decimal-Book.ttf"),
      #[cfg(feature = "font-decimal")]
      inc!("Decimal/Decimal-Ultra.ttf"),

      // Jetbrains Mono
      #[cfg(feature = "font-jetbrains")]
      inc!("JetBrainsMono/JetBrainsMono-VariableFont_wght.ttf"),

      // Bitter
      #[cfg(feature = "font-bitter")]
      inc!("Bitter/Bitter-Regular.ttf"),
      #[cfg(feature = "font-bitter")]
      inc!("Bitter/Bitter-Bold.ttf"),

      // Inter
      #[cfg(feature = "font-inter")]
      inc!("Inter/Inter-Regular.ttf"),
      #[cfg(feature = "font-inter")]
      inc!("Inter/Inter-Bold.ttf"),
    ]
  };
}

thread_local! {
  pub(crate) static DEFAULT_FONTDB: FontDatabase = {
    let mut fontdb = Arc::from(Database::new());

    if cfg!(not(feature = "lite")) {
      let db: &mut Database = Arc::make_mut(&mut fontdb);

      // we don't use a 'for' loop here to avoid having to clone the default
      // font face data. this is a bit more verbose, but it's more efficient.
      let mut i = 0;
      while i < DEFAULT_FONT_FACES.len() {
        // preload default font faces, in case the user doesn't provide any.
        // these are bundled into the compiled webassembly binary. we have
        // to be conservative here due to the increased binary size.
        let source = Source::Binary(DEFAULT_FONT_FACES[i].clone());
        let ids = db.load_font_source(source);
        let mut j = 0;
        while j < ids.len() {
          let id = ids[j];
          unsafe { db.make_shared_face_data(id); };
          j += 1;
        }
        i += 1;
      }

      if cfg!(feature = "font-sentinel") {
        db.set_serif_family("Sentinel ScreenSmart");
      } else if cfg!(feature = "font-bitter") {
        db.set_serif_family("Bitter");
      }
      if cfg!(feature = "font-gotham") {
        db.set_sans_serif_family("Gotham Narrow ScreenSmart");
      } else if cfg!(feature = "font-inter") {
        db.set_sans_serif_family("Inter");
      }
      if cfg!(feature = "font-operator-nerd") {
        db.set_monospace_family("OperatorMono Nerd Font");
      } else if cfg!(feature = "font-jetbrains") {
        db.set_monospace_family("JetBrains Mono");
      }
      if cfg!(feature = "font-inkwell") {
        db.set_cursive_family("Inkwell Script");
        db.set_fantasy_family("Inkwell Blackletter");
      }
      if cfg!(feature = "font-obsidian") {
        db.set_fantasy_family("Obsidian");
      } else if cfg!(feature = "font-numbers") {
        db.set_fantasy_family("Numbers");
      }
    }

    fontdb.into()
  };
}

#[derive(Debug, Clone)]
pub struct FontDatabase {
  pub(crate) db: Arc<Database>,
}

impl FontDatabase {
  pub fn new(db: Option<Arc<Database>>) -> Self {
    FontDatabase {
      db: db.unwrap_or_default(),
    }
  }
}

impl Default for FontDatabase {
  fn default() -> Self {
    DEFAULT_FONTDB.with(|db| FontDatabase {
      db: db.db.clone().into(),
    })
  }
}

impl Deref for FontDatabase {
  type Target = Database;

  fn deref(&self) -> &Self::Target { &self.db }
}

impl AsRef<Database> for FontDatabase {
  fn as_ref(&self) -> &Database { &self.db }
}

impl DerefMut for FontDatabase {
  fn deref_mut(&mut self) -> &mut Database { Arc::make_mut(&mut self.db) }
}

impl AsMut<FontDatabase> for FontDatabase {
  fn as_mut(&mut self) -> &mut FontDatabase { self }
}

impl From<Database> for FontDatabase {
  fn from(db: Database) -> Self {
    let db: Arc<Database> = db.into();
    FontDatabase { db }
  }
}

impl From<&mut Database> for FontDatabase {
  fn from(db: &mut Database) -> Self {
    FontDatabase {
      db: Arc::new(db.clone()),
    }
  }
}

// impl<'a, 'b> From<&'a mut Database> for &'b mut FontDatabase {
//   fn from(db: &'a mut Database) -> &'b mut FontDatabase {
//     let fontdb: &'b mut FontDatabase = db.into();
//     fontdb.as_mut()
//   }
// }

impl From<FontDatabase> for Database {
  fn from(container: FontDatabase) -> Self { container.db.as_ref().clone() }
}

// impl From<&FontDatabase> for Database {
//   fn from(container: &FontDatabase) -> Self { container.db.as_ref().clone() }
// }

impl From<FontDatabase> for Arc<Database> {
  fn from(container: FontDatabase) -> Self { container.db.clone() }
}

impl From<&FontDatabase> for Arc<Database> {
  fn from(container: &FontDatabase) -> Self { container.db.clone() }
}

impl From<Arc<Database>> for FontDatabase {
  fn from(db: Arc<Database>) -> Self { FontDatabase { db: db.clone() } }
}

impl From<Arc<Database>> for &'static mut FontDatabase {
  fn from(db: Arc<Database>) -> &'static mut FontDatabase {
    let fontdb: &mut FontDatabase = db.into();
    fontdb.as_mut()
  }
}

impl From<&Arc<Database>> for FontDatabase {
  fn from(db: &Arc<Database>) -> Self { FontDatabase { db: db.clone() } }
}

impl From<Options> for FontDatabase {
  fn from(options: Options) -> Self {
    let mut db: FontDatabase = FontDatabase::default();
    let fontdb: &mut Database = db.as_mut();

    // set family names from the `font_families` property
    if cfg!(not(feature = "lite")) {
      fontdb.set_sans_serif_family(options.font_families.sans_serif);
      fontdb.set_serif_family(options.font_families.serif);
      fontdb.set_monospace_family(options.font_families.monospace);
      fontdb.set_cursive_family(options.font_families.cursive);
      fontdb.set_fantasy_family(options.font_families.fantasy);
    }

    let mut i = 0;
    while i < options.font_faces.len() {
      let FontFace {
        kind,
        name,
        data,
        default,
      } = options.font_faces[i].clone();

      let buf = crate::utils::decompress(data.as_slice().as_ref());
      let source = Source::Binary(Arc::new(buf));
      fontdb.load_font_source(source);

      if default == true {
        match kind.as_str() {
          "sans-serif" | "sans" | "sans_serif" => fontdb.set_sans_serif_family(name),
          "serif" | "roman" | "default" => fontdb.set_serif_family(name),
          "monospaced" | "monospace" | "mono" => fontdb.set_monospace_family(name),
          "cursive" | "script" | "handwriting" => fontdb.set_cursive_family(name),
          "fantasy" | "decorative" | "display" => fontdb.set_fantasy_family(name),
          _ => fontdb.set_serif_family(name),
        }
      }
      i += 1;
    }

    fontdb.into()
  }
}

// impl From<JsValue> for FontDatabase {
//   fn from(value: JsValue) -> Self {
//     let obj: Object = value.into();
//     obj.into()
//   }
// }

// impl From<Object> for FontDatabase {
//   fn from(obj: Object) -> Self {
//     let options: Options = obj.into();
//     options.into()
//   }
// }

impl From<UsvgOptions<'static>> for FontDatabase {
  fn from(options: UsvgOptions<'static>) -> Self {
    // let fontdb = options.fontdb.clone();
    FontDatabase::from(options.fontdb.clone())
  }
}
