use serde::Serialize;
use wasm_bindgen::prelude::*;

crate::impl_linked_enum! {
  /// Represents the `text-rendering` attribute on an SVG element.
  #[wasm_bindgen]
  #[derive(Debug, Clone, Copy, PartialEq, Serialize, Default)]
  #[serde(rename_all = "camelCase")]
  pub TextRendering => ::usvg::TextRendering {
    OptimizeSpeed = 0 => "optimizeSpeed",
    #[default]
    OptimizeLegibility = 1 => "optimizeLegibility",
    GeometricPrecision = 2 => "geometricPrecision",
  },

  /// Represents the `shape-rendering` attribute on an SVG element.
  #[wasm_bindgen]
  #[derive(Debug, Clone, Copy, PartialEq, Serialize, Default)]
  #[serde(rename_all = "camelCase")]
  pub ShapeRendering => ::usvg::ShapeRendering {
    OptimizeSpeed = 0 => "optimizeSpeed",
    CrispEdges = 1 => "crispEdges",
    #[default]
    GeometricPrecision = 2 => "geometricPrecision",
  },

  /// Represents the `image-rendering` attribute on an SVG element.
  #[wasm_bindgen]
  #[derive(Debug, Clone, Copy, PartialEq, Serialize, Default)]
  #[serde(rename_all = "camelCase")]
  pub ImageRendering => ::usvg::ImageRendering {
    #[default]
    OptimizeQuality = 0 => "optimizeQuality",
    OptimizeSpeed = 1 => "optimizeSpeed",
  },
}
