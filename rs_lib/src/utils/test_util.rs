use std::env::temp_dir;

use usvg::fontdb::FaceInfo;

use crate::{FontFace, FontFamilies, Options, Size};

pub(crate) fn get_options_with_custom_font_faces() -> Options {
  let font_faces = vec![
    FontFace {
      kind: "sans-serif".into(),
      name: "Inter".into(),
      data: include_bytes!("../../../fonts/Inter/Inter-Regular.ttf.br").to_vec(),
      default: true,
    },
    FontFace {
      kind: "sans-serif".into(),
      name: "Inter".into(),
      data: include_bytes!("../../../fonts/Inter/Inter-Bold.ttf.br").to_vec(),
      default: false,
    },
    FontFace {
      kind: "serif".into(),
      name: "Bitter".into(),
      data: include_bytes!("../../../fonts/Bitter/Bitter-Regular.ttf.br").to_vec(),
      default: true,
    },
    FontFace {
      kind: "serif".into(),
      name: "Bitter".into(),
      data: include_bytes!("../../../fonts/Bitter/Bitter-Bold.ttf.br").to_vec(),
      default: false,
    },
    FontFace {
      kind: "monospace".into(),
      name: "JetBrains Mono".into(),
      data: include_bytes!("../../../fonts/JetBrainsMono/JetBrainsMono-VariableFont_wght.ttf.br")
        .to_vec(),
      default: true,
    },
  ];

  let font_families = FontFamilies {
    default: "Bitter".into(),
    sans_serif: "Inter".into(),
    serif: "Bitter".into(),
    monospace: "JetBrains Mono".into(),
    cursive: "Comic Sans MS".into(),
    fantasy: "Decimal".into(),
  };

  Options {
    font_families,
    font_faces,
    font_size: 24.0,
    default_size: Size {
      width: 400.0,
      height: 200.0,
    },
    ..Default::default()
  }
}

pub(crate) fn debug_font_face(f: &FaceInfo) {
  let id = &f.id;
  let name = &f.post_script_name.clone();
  let style = &f.style;
  let weight = &f.weight;
  let stretch = &f.stretch;
  let families = &f.families;
  let family_name = families
    .iter()
    .map(|f| f.0.to_string())
    .collect::<Vec<_>>()
    .join(", ");
  println!(
    "\x1b[0;1;4;92m{name}\x1b[0;2m\t{}/\t\x1b[0;95m{weight:?}\x1b[0;2m\t/\t\x1b[0;38;5;\
       187m{style:?}\x1b[0;2m\t/\t\x1b[0;38;5;169m{stretch:?}\x1b[0m",
    if name.len() > 23 {
      ""
    } else if name.len() > 18 {
      "\t"
    } else if name.len() > 14 {
      "\t\t"
    } else if name.len() > 11 {
      "\t\t\t"
    } else {
      "\t\t\t\t"
    }
  );
  println!("   \x1b[2munique id:\x1b[0;1;93m {id:?}\x1b[0;2m ({id})\x1b[0m");
  println!("   \x1b[2m   family:\x1b[0;1;96m {family_name:?}\x1b[0m");
  // println!("   \x1b[2m families:\x1b[0;1;96m {families:?}\x1b[0m");
  // println!(
  //   "   \x1b[2;3m(\x1b[1;3;96m{:?}\x1b[0;2;3m)\x1b[0m",
  //   f.families
  //     .iter()
  //     .map(|f| f.0.to_string())
  //     .collect::<Vec<_>>()
  //     .join(", ")
  // );
  println!("");
}

pub(crate) fn write_png_to_tmp_file(actual: &[u8]) {
  use ::std::fs::File;
  use ::std::io::Write;
  use ::std::time::SystemTime;

  // write it to a temporary file and log the path to the terminal
  let path = temp_dir().join(&format!(
    "custom-fonts-{}.png",
    SystemTime::now()
      .duration_since(SystemTime::UNIX_EPOCH)
      .unwrap()
      .as_secs()
  ));

  let mut file: File = File::create(path.clone()).unwrap();
  file.write_all(&actual).unwrap();

  println!("\x1b[1;94m   --> rendered to \x1b[96m{:?}\x1b[0m", path);
}

pub(crate) fn write_png_to_terminal(actual: &[u8]) {
  // log the image directly into the terminal using special escape sequence
  #[allow(deprecated)]
  let escaped = format!(
    "\x1b]1337;File=inline=1;preserveAspectRatio=1;size={};width=100%;height=100%:{}\x07",
    actual.len(),
    ::base64::encode(&actual)
  );

  println!("{}", escaped);
}
