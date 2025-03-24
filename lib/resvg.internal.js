// @generated file from wasmbuild -- do not edit
// @ts-nocheck: generated
// deno-lint-ignore-file
// deno-fmt-ignore-file

let wasm;
export function __wbg_set_wasm(val) {
  wasm = val;
}

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) {
  return heap[idx];
}

let heap_next = heap.length;

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];

  heap[idx] = obj;
  return idx;
}

function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    wasm.__wbindgen_export_0(addHeapObject(e));
  }
}

function dropObject(idx) {
  if (idx < 132) return;
  heap[idx] = heap_next;
  heap_next = idx;
}

function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}

const lTextDecoder = typeof TextDecoder === "undefined"
  ? (0, module.require)("util").TextDecoder
  : TextDecoder;

let cachedTextDecoder = new lTextDecoder("utf-8", {
  ignoreBOM: true,
  fatal: true,
});

cachedTextDecoder.decode();

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
  if (
    cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0
  ) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(
    getUint8ArrayMemory0().subarray(ptr, ptr + len),
  );
}

function isLikeNone(x) {
  return x === undefined || x === null;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
  if (
    cachedDataViewMemory0 === null ||
    cachedDataViewMemory0.buffer.detached === true ||
    (cachedDataViewMemory0.buffer.detached === undefined &&
      cachedDataViewMemory0.buffer !== wasm.memory.buffer)
  ) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
  }
  return cachedDataViewMemory0;
}

function debugString(val) {
  // primitive types
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`;
  }
  if (type == "string") {
    return `"${val}"`;
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`;
    } else {
      return "Function";
    }
  }
  // objects
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = "[";
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ", " + debugString(val[i]);
    }
    debug += "]";
    return debug;
  }
  // Test for built-in
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches && builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    // Failed to match the standard '[object ClassName]'
    return toString.call(val);
  }
  if (className == "Object") {
    // we're a user defined class or Object
    // JSON.stringify avoids problems with cycles, and is generally much
    // easier than looping through ownProperties of `val`.
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  // errors
  if (val instanceof Error) {
    return `${val.name}: ${val.message}\n${val.stack}`;
  }
  // TODO we could test for more things here, like `Set`s and `Map`s.
  return className;
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === "undefined"
  ? (0, module.require)("util").TextEncoder
  : TextEncoder;

let cachedTextEncoder = new lTextEncoder("utf-8");

const encodeString = typeof cachedTextEncoder.encodeInto === "function"
  ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
  }
  : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
      read: arg.length,
      written: buf.length,
    };
  };

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;

  const mem = getUint8ArrayMemory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7F) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`);
  }
}

function passArrayJsValueToWasm0(array, malloc) {
  const ptr = malloc(array.length * 4, 4) >>> 0;
  const mem = getDataViewMemory0();
  for (let i = 0; i < array.length; i++) {
    mem.setUint32(ptr + 4 * i, addHeapObject(array[i]), true);
  }
  WASM_VECTOR_LEN = array.length;
  return ptr;
}

function getArrayJsValueFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  const mem = getDataViewMemory0();
  const result = [];
  for (let i = ptr; i < ptr + 4 * len; i += 4) {
    result.push(takeObject(mem.getUint32(i, true)));
  }
  return result;
}

function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1, 1) >>> 0;
  getUint8ArrayMemory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}
/**
 * Renders an SVG string into a PNG image as a byte array.
 *
 * Optionally accepts a `Options` object to customize the rendering,
 * such as setting the font family, font size, and custom fonts.
 *
 * @param {string} svg The SVG string to render.
 * @param {Options} [options] Custom rendering options (if any).
 * @returns {Uint8Array} A rasterized PNG image encoded as a byte array.
 * @throws {Error} If the SVG string is invalid or rendering fails.
 */
export function render(svg, options) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(
      svg,
      wasm.__wbindgen_export_1,
      wasm.__wbindgen_export_2,
    );
    const len0 = WASM_VECTOR_LEN;
    wasm.render(
      retptr,
      ptr0,
      len0,
      isLikeNone(options) ? 0 : addHeapObject(options),
    );
    var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
    var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
    var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
    var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
    if (r3) {
      throw takeObject(r2);
    }
    var v2 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_export_3(r0, r1 * 1, 1);
    return v2;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

/**
 * r" Represents the `image-rendering` attribute on an SVG element.
 * @enum {0 | 1}
 */
export const ImageRendering = Object.freeze({
  OptimizeQuality: 0,
  "0": "OptimizeQuality",
  OptimizeSpeed: 1,
  "1": "OptimizeSpeed",
});
/**
 * r" Represents the `shape-rendering` attribute on an SVG element.
 * @enum {0 | 1 | 2}
 */
export const ShapeRendering = Object.freeze({
  OptimizeSpeed: 0,
  "0": "OptimizeSpeed",
  CrispEdges: 1,
  "1": "CrispEdges",
  GeometricPrecision: 2,
  "2": "GeometricPrecision",
});
/**
 * r" Represents the `text-rendering` attribute on an SVG element.
 * @enum {0 | 1 | 2}
 */
export const TextRendering = Object.freeze({
  OptimizeSpeed: 0,
  "0": "OptimizeSpeed",
  OptimizeLegibility: 1,
  "1": "OptimizeLegibility",
  GeometricPrecision: 2,
  "2": "GeometricPrecision",
});

const FontFaceFinalization = (typeof FinalizationRegistry === "undefined")
  ? { register: () => {}, unregister: () => {} }
  : new FinalizationRegistry((ptr) => wasm.__wbg_fontface_free(ptr >>> 0, 1));

export class FontFace {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(FontFace.prototype);
    obj.__wbg_ptr = ptr;
    FontFaceFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  static __unwrap(jsValue) {
    if (!(jsValue instanceof FontFace)) {
      return 0;
    }
    return jsValue.__destroy_into_raw();
  }

  toJSON() {
    return {
      kind: this.kind,
      name: this.name,
      data: this.data,
      default: this.default,
      type: this.type,
    };
  }

  toString() {
    return JSON.stringify(this);
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    FontFaceFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_fontface_free(ptr, 0);
  }
  /**
   * @returns {string}
   */
  get kind() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.__wbg_get_fontface_kind(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @param {string} arg0
   */
  set kind(arg0) {
    const ptr0 = passStringToWasm0(
      arg0,
      wasm.__wbindgen_export_1,
      wasm.__wbindgen_export_2,
    );
    const len0 = WASM_VECTOR_LEN;
    wasm.__wbg_set_fontface_kind(this.__wbg_ptr, ptr0, len0);
  }
  /**
   * @returns {string}
   */
  get name() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.__wbg_get_fontface_name(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @param {string} arg0
   */
  set name(arg0) {
    const ptr0 = passStringToWasm0(
      arg0,
      wasm.__wbindgen_export_1,
      wasm.__wbindgen_export_2,
    );
    const len0 = WASM_VECTOR_LEN;
    wasm.__wbg_set_fontface_name(this.__wbg_ptr, ptr0, len0);
  }
  /**
   * @returns {Uint8Array}
   */
  get data() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.__wbg_get_fontface_data(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var v1 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_export_3(r0, r1 * 1, 1);
      return v1;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} arg0
   */
  set data(arg0) {
    const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    wasm.__wbg_set_fontface_data(this.__wbg_ptr, ptr0, len0);
  }
  /**
   * @returns {boolean}
   */
  get default() {
    const ret = wasm.__wbg_get_fontface_default(this.__wbg_ptr);
    return ret !== 0;
  }
  /**
   * @param {boolean} arg0
   */
  set default(arg0) {
    wasm.__wbg_set_fontface_default(this.__wbg_ptr, arg0);
  }
  /**
   * @param {string | null} [kind]
   * @param {string | null} [name]
   * @param {Uint8Array | null} [data]
   * @param {boolean | null} [is_default]
   */
  constructor(kind, name, data, is_default) {
    var ptr0 = isLikeNone(kind)
      ? 0
      : passStringToWasm0(
        kind,
        wasm.__wbindgen_export_1,
        wasm.__wbindgen_export_2,
      );
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = isLikeNone(name)
      ? 0
      : passStringToWasm0(
        name,
        wasm.__wbindgen_export_1,
        wasm.__wbindgen_export_2,
      );
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = isLikeNone(data)
      ? 0
      : passArray8ToWasm0(data, wasm.__wbindgen_export_1);
    var len2 = WASM_VECTOR_LEN;
    const ret = wasm.fontface_new(
      ptr0,
      len0,
      ptr1,
      len1,
      ptr2,
      len2,
      isLikeNone(is_default) ? 0xFFFFFF : is_default ? 1 : 0,
    );
    this.__wbg_ptr = ret >>> 0;
    FontFaceFinalization.register(this, this.__wbg_ptr, this);
    return this;
  }
  /**
   * @returns {FontFace}
   */
  static defaultFontFace() {
    const ret = wasm.fontface_defaultFontFace();
    return FontFace.__wrap(ret);
  }
  /**
   * @returns {string}
   */
  get type() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.fontface_type(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @param {string} kind
   */
  set type(kind) {
    const ptr0 = passStringToWasm0(
      kind,
      wasm.__wbindgen_export_1,
      wasm.__wbindgen_export_2,
    );
    const len0 = WASM_VECTOR_LEN;
    wasm.fontface_set_type(this.__wbg_ptr, ptr0, len0);
  }
}

const FontFamiliesFinalization = (typeof FinalizationRegistry === "undefined")
  ? { register: () => {}, unregister: () => {} }
  : new FinalizationRegistry((ptr) =>
    wasm.__wbg_fontfamilies_free(ptr >>> 0, 1)
  );
/**
 * Represents the default font families for each of the five generic font
 * types that can be used in an SVG document, as well as the default font
 * family if no generic type is specified at all.
 */
export class FontFamilies {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(FontFamilies.prototype);
    obj.__wbg_ptr = ptr;
    FontFamiliesFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  toJSON() {
    return {
      default: this.default,
      sans_serif: this.sans_serif,
      serif: this.serif,
      monospace: this.monospace,
      cursive: this.cursive,
      fantasy: this.fantasy,
    };
  }

  toString() {
    return JSON.stringify(this);
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    FontFamiliesFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_fontfamilies_free(ptr, 0);
  }
  /**
   * The font family to use when no `font-family` attribute is set in the SVG.
   * @returns {string}
   */
  get default() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.__wbg_get_fontfamilies_default(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * The font family to use when no `font-family` attribute is set in the SVG.
   * @param {string} arg0
   */
  set default(arg0) {
    const ptr0 = passStringToWasm0(
      arg0,
      wasm.__wbindgen_export_1,
      wasm.__wbindgen_export_2,
    );
    const len0 = WASM_VECTOR_LEN;
    wasm.__wbg_set_fontface_kind(this.__wbg_ptr, ptr0, len0);
  }
  /**
   * The `sans-serif` font family.
   * @returns {string}
   */
  get sans_serif() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.__wbg_get_fontfamilies_sans_serif(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * The `sans-serif` font family.
   * @param {string} arg0
   */
  set sans_serif(arg0) {
    const ptr0 = passStringToWasm0(
      arg0,
      wasm.__wbindgen_export_1,
      wasm.__wbindgen_export_2,
    );
    const len0 = WASM_VECTOR_LEN;
    wasm.__wbg_set_fontface_name(this.__wbg_ptr, ptr0, len0);
  }
  /**
   * The `serif` font family.
   * @returns {string}
   */
  get serif() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.__wbg_get_fontfamilies_serif(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * The `serif` font family.
   * @param {string} arg0
   */
  set serif(arg0) {
    const ptr0 = passStringToWasm0(
      arg0,
      wasm.__wbindgen_export_1,
      wasm.__wbindgen_export_2,
    );
    const len0 = WASM_VECTOR_LEN;
    wasm.__wbg_set_fontface_data(this.__wbg_ptr, ptr0, len0);
  }
  /**
   * The `monospace` font family.
   * @returns {string}
   */
  get monospace() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.__wbg_get_fontfamilies_monospace(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * The `monospace` font family.
   * @param {string} arg0
   */
  set monospace(arg0) {
    const ptr0 = passStringToWasm0(
      arg0,
      wasm.__wbindgen_export_1,
      wasm.__wbindgen_export_2,
    );
    const len0 = WASM_VECTOR_LEN;
    wasm.__wbg_set_fontfamilies_monospace(this.__wbg_ptr, ptr0, len0);
  }
  /**
   * The `cursive` font family.
   * @returns {string}
   */
  get cursive() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.__wbg_get_fontfamilies_cursive(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * The `cursive` font family.
   * @param {string} arg0
   */
  set cursive(arg0) {
    const ptr0 = passStringToWasm0(
      arg0,
      wasm.__wbindgen_export_1,
      wasm.__wbindgen_export_2,
    );
    const len0 = WASM_VECTOR_LEN;
    wasm.__wbg_set_fontfamilies_cursive(this.__wbg_ptr, ptr0, len0);
  }
  /**
   * The `fantasy` font family.
   * @returns {string}
   */
  get fantasy() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.__wbg_get_fontfamilies_fantasy(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * The `fantasy` font family.
   * @param {string} arg0
   */
  set fantasy(arg0) {
    const ptr0 = passStringToWasm0(
      arg0,
      wasm.__wbindgen_export_1,
      wasm.__wbindgen_export_2,
    );
    const len0 = WASM_VECTOR_LEN;
    wasm.__wbg_set_fontfamilies_fantasy(this.__wbg_ptr, ptr0, len0);
  }
  /**
   * Converts a plain JavaScript object - or a JSON string that can be parsed
   * into such an object with a valid structure - into a `FontFamilies`
   * instance.
   *
   * This is a convenience method that is used internally to convert userland
   * POJOs into valid `FontFamilies` instances that can be used by the
   * renderer.
   *
   * @param {string | object} json - The JavaScript object or JSON string to
   * convert.
   * @returns {FontFamilies} - The converted `FontFamilies` instance.
   */
  static fromJSON(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.fontfamilies_fromJSON(retptr, addHeapObject(json));
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
      if (r2) {
        throw takeObject(r1);
      }
      return FontFamilies.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Converts the `FontFamilies` instance into a plain JavaScript object.
   * @returns {object}
   */
  toObject() {
    const ret = wasm.fontfamilies_toObject(this.__wbg_ptr);
    return takeObject(ret);
  }
}

const OptionsFinalization = (typeof FinalizationRegistry === "undefined")
  ? { register: () => {}, unregister: () => {} }
  : new FinalizationRegistry((ptr) => wasm.__wbg_options_free(ptr >>> 0, 1));
/**
 * Options for rendering SVGs.
 *
 * This is an intermediate conversion type that is used to convert userland
 * options into the correct `UsvgOptions` type.
 */
export class Options {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Options.prototype);
    obj.__wbg_ptr = ptr;
    OptionsFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  toJSON() {
    return {
      autofix: this.autofix,
      dpi: this.dpi,
      scale: this.scale,
      size: this.size,
      defaultSize: this.defaultSize,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
      fontFaces: this.fontFaces,
      fontFamilies: this.fontFamilies,
      shapeRendering: this.shapeRendering,
      textRendering: this.textRendering,
      imageRendering: this.imageRendering,
      styles: this.styles,
      languages: this.languages,
    };
  }

  toString() {
    return JSON.stringify(this);
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    OptionsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_options_free(ptr, 0);
  }
  /**
   * By default, the renderer runs a series of syntax tests on its SVG inputs,
   * looking for several common problems that often cause the renderer to fail
   * or produce a bad image. If this option is set to `true` or omitted, these
   * issues will be automatically fixed where possible. If this behavior isn't
   * desired, setting this to `false` will disable the autofixing process.
   *
   * @remarks The `usvg` library that this package uses under the hood is
   * rather strict about the SVGs it accepts. Scenarios that will be
   * automatically fixed:
   *
   * - Missing `xmlns` attribute
   * - Missing `version` attribute
   * - Missing closing `</svg>` tag
   * - Missing XML document declaration (panics from this seem intermittent)
   *
   * Be aware that if this option is set to `false`, the renderer will be
   * passed the input SVG exactly as-is. Think of disabling this option as
   * being analogous to enabling a "strict" mode: if there are any syntax
   * issues or missing attributes, errors will be thrown by the renderer.
   *
   * @default {true}
   */
  get autofix() {
    const ret = wasm.__wbg_get_options_autofix(this.__wbg_ptr);
    return ret !== 0;
  }
  /**
   * By default, the renderer runs a series of syntax tests on its SVG inputs,
   * looking for several common problems that often cause the renderer to fail
   * or produce a bad image. If this option is set to `true` or omitted, these
   * issues will be automatically fixed where possible. If this behavior isn't
   * desired, setting this to `false` will disable the autofixing process.
   *
   * @remarks The `usvg` library that this package uses under the hood is
   * rather strict about the SVGs it accepts. Scenarios that will be
   * automatically fixed:
   *
   * - Missing `xmlns` attribute
   * - Missing `version` attribute
   * - Missing closing `</svg>` tag
   * - Missing XML document declaration (panics from this seem intermittent)
   *
   * Be aware that if this option is set to `false`, the renderer will be
   * passed the input SVG exactly as-is. Think of disabling this option as
   * being analogous to enabling a "strict" mode: if there are any syntax
   * issues or missing attributes, errors will be thrown by the renderer.
   *
   * @default {true}
   */
  set autofix(arg0) {
    wasm.__wbg_set_options_autofix(this.__wbg_ptr, arg0);
  }
  /**
   * Automatic
   * Target DPI (dots per inch) for the SVG rendering. This value is used to
   * convert units in the SVG to pixels. As such, the value of this setting
   * directly impacts unit conversion behavior. For example, if the DPI is set
   * to 96, then a 1-inch line in the SVG will be rendered as a 96-pixel line
   * on the output image.
   *
   * @default {96}
   */
  get dpi() {
    const ret = wasm.__wbg_get_options_dpi(this.__wbg_ptr);
    return ret;
  }
  /**
   * Automatic
   * Target DPI (dots per inch) for the SVG rendering. This value is used to
   * convert units in the SVG to pixels. As such, the value of this setting
   * directly impacts unit conversion behavior. For example, if the DPI is set
   * to 96, then a 1-inch line in the SVG will be rendered as a 96-pixel line
   * on the output image.
   *
   * @default {96}
   */
  set dpi(arg0) {
    wasm.__wbg_set_options_dpi(this.__wbg_ptr, arg0);
  }
  /**
   * Set an explicit scale factor to use when rendering the SVG. This will
   * cause the SVG to be rendered at a different size than normal, and its
   * dimensions will be multiplied by the scale factor.
   *
   * For example, setting this to `2.0` will double the size of the rendered
   * image, while setting it to `0.5` will render the image at half of the
   * original size.The default value of `1.0` is a no-op.
   *
   * If you need to set the width and height of the output image explicitly,
   * use {@linkcode Options.size} instead. If both are set, the scale will
   * be applied to the dimensions set in the `size` property.
   *
   * @default {1.0}
   */
  get scale() {
    const ret = wasm.__wbg_get_options_scale(this.__wbg_ptr);
    return ret;
  }
  /**
   * Set an explicit scale factor to use when rendering the SVG. This will
   * cause the SVG to be rendered at a different size than normal, and its
   * dimensions will be multiplied by the scale factor.
   *
   * For example, setting this to `2.0` will double the size of the rendered
   * image, while setting it to `0.5` will render the image at half of the
   * original size.The default value of `1.0` is a no-op.
   *
   * If you need to set the width and height of the output image explicitly,
   * use {@linkcode Options.size} instead. If both are set, the scale will
   * be applied to the dimensions set in the `size` property.
   *
   * @default {1.0}
   */
  set scale(arg0) {
    wasm.__wbg_set_options_scale(this.__wbg_ptr, arg0);
  }
  /**
   * Set the width and height of the output image. This is used to set the
   * dimensions of the rendered image. The dimensions are set in pixels. If
   * a scale factor is also set, the dimensions will be multiplied by that
   * scale factor.
   *
   * @default {undefined}
   */
  get size() {
    const ret = wasm.__wbg_get_options_size(this.__wbg_ptr);
    return ret === 0 ? undefined : Size.__wrap(ret);
  }
  /**
   * Set the width and height of the output image. This is used to set the
   * dimensions of the rendered image. The dimensions are set in pixels. If
   * a scale factor is also set, the dimensions will be multiplied by that
   * scale factor.
   *
   * @default {undefined}
   */
  set size(arg0) {
    let ptr0 = 0;
    if (!isLikeNone(arg0)) {
      _assertClass(arg0, Size);
      ptr0 = arg0.__destroy_into_raw();
    }
    wasm.__wbg_set_options_size(this.__wbg_ptr, ptr0);
  }
  /**
   * Default viewport size. These dimensions are used if there is no `viewBox`
   * attribute on the outermost (root) `<svg>` element and the `width` or
   * `height` attributes are relative.
   *
   * @default {{width:100,height:100}}
   * @returns {Size}
   */
  get defaultSize() {
    const ret = wasm.__wbg_get_options_defaultSize(this.__wbg_ptr);
    return Size.__wrap(ret);
  }
  /**
   * Default viewport size. These dimensions are used if there is no `viewBox`
   * attribute on the outermost (root) `<svg>` element and the `width` or
   * `height` attributes are relative.
   *
   * @default {{width:100,height:100}}
   * @param {Size} arg0
   */
  set defaultSize(arg0) {
    _assertClass(arg0, Size);
    var ptr0 = arg0.__destroy_into_raw();
    wasm.__wbg_set_options_defaultSize(this.__wbg_ptr, ptr0);
  }
  /**
   * Default font size to use when no `font-size` attribute is set in the SVG.
   *
   * Default: 12
   * @returns {number}
   */
  get fontSize() {
    const ret = wasm.__wbg_get_options_fontSize(this.__wbg_ptr);
    return ret;
  }
  /**
   * Default font size to use when no `font-size` attribute is set in the SVG.
   *
   * Default: 12
   * @param {number} arg0
   */
  set fontSize(arg0) {
    wasm.__wbg_set_options_fontSize(this.__wbg_ptr, arg0);
  }
  /**
   * @param {number | null} [maybe_dpi]
   * @param {number | null} [maybe_scale]
   * @param {Size | null} [maybe_size]
   * @param {number | null} [maybe_font_size]
   * @param {FontFace[] | null} [maybe_font_faces]
   * @param {string | null} [maybe_font_family]
   * @param {FontFamilies | null} [maybe_font_families]
   * @param {string | null} [maybe_style_sheet]
   * @param {boolean | null} [maybe_autofix]
   * @param {Size | null} [maybe_default_size]
   * @param {ShapeRendering | null} [maybe_shape_rendering]
   * @param {TextRendering | null} [maybe_text_rendering]
   * @param {ImageRendering | null} [maybe_image_rendering]
   * @param {string[] | null} [maybe_languages]
   */
  constructor(
    maybe_dpi,
    maybe_scale,
    maybe_size,
    maybe_font_size,
    maybe_font_faces,
    maybe_font_family,
    maybe_font_families,
    maybe_style_sheet,
    maybe_autofix,
    maybe_default_size,
    maybe_shape_rendering,
    maybe_text_rendering,
    maybe_image_rendering,
    maybe_languages,
  ) {
    let ptr0 = 0;
    if (!isLikeNone(maybe_size)) {
      _assertClass(maybe_size, Size);
      ptr0 = maybe_size.__destroy_into_raw();
    }
    var ptr1 = isLikeNone(maybe_font_faces)
      ? 0
      : passArrayJsValueToWasm0(maybe_font_faces, wasm.__wbindgen_export_1);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = isLikeNone(maybe_font_family)
      ? 0
      : passStringToWasm0(
        maybe_font_family,
        wasm.__wbindgen_export_1,
        wasm.__wbindgen_export_2,
      );
    var len2 = WASM_VECTOR_LEN;
    let ptr3 = 0;
    if (!isLikeNone(maybe_font_families)) {
      _assertClass(maybe_font_families, FontFamilies);
      ptr3 = maybe_font_families.__destroy_into_raw();
    }
    var ptr4 = isLikeNone(maybe_style_sheet)
      ? 0
      : passStringToWasm0(
        maybe_style_sheet,
        wasm.__wbindgen_export_1,
        wasm.__wbindgen_export_2,
      );
    var len4 = WASM_VECTOR_LEN;
    let ptr5 = 0;
    if (!isLikeNone(maybe_default_size)) {
      _assertClass(maybe_default_size, Size);
      ptr5 = maybe_default_size.__destroy_into_raw();
    }
    var ptr6 = isLikeNone(maybe_languages)
      ? 0
      : passArrayJsValueToWasm0(maybe_languages, wasm.__wbindgen_export_1);
    var len6 = WASM_VECTOR_LEN;
    const ret = wasm.options_new(
      isLikeNone(maybe_dpi) ? 0x100000001 : Math.fround(maybe_dpi),
      isLikeNone(maybe_scale) ? 0x100000001 : Math.fround(maybe_scale),
      ptr0,
      isLikeNone(maybe_font_size) ? 0x100000001 : Math.fround(maybe_font_size),
      ptr1,
      len1,
      ptr2,
      len2,
      ptr3,
      ptr4,
      len4,
      isLikeNone(maybe_autofix) ? 0xFFFFFF : maybe_autofix ? 1 : 0,
      ptr5,
      isLikeNone(maybe_shape_rendering) ? 3 : maybe_shape_rendering,
      isLikeNone(maybe_text_rendering) ? 3 : maybe_text_rendering,
      isLikeNone(maybe_image_rendering) ? 2 : maybe_image_rendering,
      ptr6,
      len6,
    );
    this.__wbg_ptr = ret >>> 0;
    OptionsFinalization.register(this, this.__wbg_ptr, this);
    return this;
  }
  /**
   * Creates a new `Options` object with default values.
   * @returns {Options}
   */
  static defaultOptions() {
    const ret = wasm.options_defaultOptions();
    return Options.__wrap(ret);
  }
  /**
   * Creates a new `Options` object with default values, converts it into a
   * plain JavaScript object, and returns it. This is more or less the same
   * as calling `Options.default().toJSON()`, but the conversion takes place
   * entirely in Rust instead of in the JavaScript glue code.
   *
   * @returns {object} The default options object.
   */
  static defaultObject() {
    const ret = wasm.options_defaultObject();
    return takeObject(ret);
  }
  /**
   * Creates a new `Options` object from a JSON string or object.
   *
   * @param {string | object} json The JSON string or object to parse.
   * @returns {Options} The parsed options object.
   */
  static fromJSON(json) {
    const ret = wasm.options_fromJSON(addHeapObject(json));
    return Options.__wrap(ret);
  }
  /**
   * Default font family for when a `font-family` attribute is not in the SVG.
   *
   * Default: Times New Roman
   * @returns {string}
   */
  get fontFamily() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.options_get_font_family(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @param {string} font_family
   */
  set fontFamily(font_family) {
    const ptr0 = passStringToWasm0(
      font_family,
      wasm.__wbindgen_export_1,
      wasm.__wbindgen_export_2,
    );
    const len0 = WASM_VECTOR_LEN;
    wasm.options_set_font_family(this.__wbg_ptr, ptr0, len0);
  }
  /**
   * Font faces to register with the font database, making them available for
   * use in the SVG document.
   * @returns {FontFace[]}
   */
  get fontFaces() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.options_get_font_faces(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
      wasm.__wbindgen_export_3(r0, r1 * 4, 4);
      return v1;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {FontFace[]} value
   */
  set fontFaces(value) {
    const ptr0 = passArrayJsValueToWasm0(value, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    wasm.options_set_font_faces(this.__wbg_ptr, ptr0, len0);
  }
  /**
   * Specifies the default font family to be used for each of the five generic
   * font family names. This is used when an SVG element's `font-family` is
   * set to `serif`, `sans-serif`, `cursive`, `fantasy`, or `monospace`.
   *
   * Family names must be registered with the font database using the
   * `font_faces` property, and must **exactly** match the internal family
   * name of a font face. Otherwise, there's a chance that no text will be
   * rendered at all.
   * @returns {FontFamilies}
   */
  get fontFamilies() {
    const ret = wasm.options_get_font_families(this.__wbg_ptr);
    return FontFamilies.__wrap(ret);
  }
  /**
   * @param {FontFamilies} value
   */
  set fontFamilies(value) {
    _assertClass(value, FontFamilies);
    var ptr0 = value.__destroy_into_raw();
    wasm.options_set_font_families(this.__wbg_ptr, ptr0);
  }
  /**
   * Specifies the default shape rendering method to be used when an SVG
   * element's `shape-rendering` property is set to `auto`.
   *
   * @default {ShapeRendering.GeometricPrecision}
   * @returns {ShapeRendering}
   */
  get shapeRendering() {
    const ret = wasm.options_get_shape_rendering(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {ShapeRendering | `${ShapeRendering}` | null | undefined} value
   */
  set shapeRendering(value) {
    wasm.options_set_shape_rendering(this.__wbg_ptr, addHeapObject(value));
  }
  /**
   * Specifies the default text rendering method to be used when an SVG
   * element's `text-rendering` property is set to `auto`.
   *
   * @default {TextRendering.OptimizeLegibility}
   * @returns {TextRendering}
   */
  get textRendering() {
    const ret = wasm.options_get_text_rendering(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {TextRendering | `${TextRendering}` | null | undefined} value
   */
  set textRendering(value) {
    wasm.options_set_text_rendering(this.__wbg_ptr, addHeapObject(value));
  }
  /**
   * Specifies the default image rendering method to be used when an SVG
   * element's `image-rendering` property is set to `auto`.
   *
   * @default {ImageRendering.OptimizeQuality}
   * @returns {ImageRendering}
   */
  get imageRendering() {
    const ret = wasm.options_get_image_rendering(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {ImageRendering | `${ImageRendering}` | null | undefined} value
   */
  set imageRendering(value) {
    wasm.options_set_image_rendering(this.__wbg_ptr, addHeapObject(value));
  }
  /**
   * A CSS stylesheet that should be injected into the SVG. Can be used to
   * overwrite certain attributes.
   * @returns {string}
   */
  get styles() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.options_get_style_sheet(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @param {any} value
   */
  set_style_sheet(value) {
    wasm.options_set_style_sheet(this.__wbg_ptr, addHeapObject(value));
  }
  /**
   * Language list used to resolve a `systemLanguage` conditional attribute.
   *
   * Format: `en`, `en-US`. Default: `[en]`
   * @returns {string[]}
   */
  get languages() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.options_get_languages(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
      wasm.__wbindgen_export_3(r0, r1 * 4, 4);
      return v1;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string[]} value
   */
  set languages(value) {
    const ptr0 = passArrayJsValueToWasm0(value, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    wasm.options_set_languages(this.__wbg_ptr, ptr0, len0);
  }
}

const SizeFinalization = (typeof FinalizationRegistry === "undefined")
  ? { register: () => {}, unregister: () => {} }
  : new FinalizationRegistry((ptr) => wasm.__wbg_size_free(ptr >>> 0, 1));

export class Size {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Size.prototype);
    obj.__wbg_ptr = ptr;
    SizeFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  toJSON() {
    return {
      width: this.width,
      height: this.height,
    };
  }

  toString() {
    return JSON.stringify(this);
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    SizeFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_size_free(ptr, 0);
  }
  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    const ret = wasm.size_new(width, height);
    this.__wbg_ptr = ret >>> 0;
    SizeFinalization.register(this, this.__wbg_ptr, this);
    return this;
  }
  /**
   * @returns {number}
   */
  get width() {
    const ret = wasm.size_width(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {number} width
   */
  set width(width) {
    wasm.size_set_width(this.__wbg_ptr, width);
  }
  /**
   * @returns {number}
   */
  get height() {
    const ret = wasm.size_height(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {number} height
   */
  set height(height) {
    wasm.size_set_height(this.__wbg_ptr, height);
  }
  /**
   * Converts `Size` to a JavaScript object.
   * @returns {object}
   */
  toObject() {
    const ret = wasm.size_toObject(this.__wbg_ptr);
    return takeObject(ret);
  }
  /**
   * Converts a JSON-encoded string or object into a `Size` instance.
   * @param {any} json
   * @returns {Size}
   */
  static fromJSON(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.size_fromJSON(retptr, addHeapObject(json));
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
      if (r2) {
        throw takeObject(r1);
      }
      return Size.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

export function __wbg_buffer_609cc3eee51ed158(arg0) {
  const ret = getObject(arg0).buffer;
  return addHeapObject(ret);
}

export function __wbg_call_672a4d21634d4a24() {
  return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
  }, arguments);
}

export function __wbg_done_769e5ede4b31c67b(arg0) {
  const ret = getObject(arg0).done;
  return ret;
}

export function __wbg_entries_3265d4158b33e5dc(arg0) {
  const ret = Object.entries(getObject(arg0));
  return addHeapObject(ret);
}

export function __wbg_fontface_new(arg0) {
  const ret = FontFace.__wrap(arg0);
  return addHeapObject(ret);
}

export function __wbg_fontface_unwrap(arg0) {
  const ret = FontFace.__unwrap(takeObject(arg0));
  return ret;
}

export function __wbg_get_67b2ba62fc30de12() {
  return handleError(function (arg0, arg1) {
    const ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
  }, arguments);
}

export function __wbg_get_b9b93047fe3cf45b(arg0, arg1) {
  const ret = getObject(arg0)[arg1 >>> 0];
  return addHeapObject(ret);
}

export function __wbg_getwithrefkey_1dc361bd10053bfe(arg0, arg1) {
  const ret = getObject(arg0)[getObject(arg1)];
  return addHeapObject(ret);
}

export function __wbg_instanceof_ArrayBuffer_e14585432e3737fc(arg0) {
  let result;
  try {
    result = getObject(arg0) instanceof ArrayBuffer;
  } catch (_) {
    result = false;
  }
  const ret = result;
  return ret;
}

export function __wbg_instanceof_Map_f3469ce2244d2430(arg0) {
  let result;
  try {
    result = getObject(arg0) instanceof Map;
  } catch (_) {
    result = false;
  }
  const ret = result;
  return ret;
}

export function __wbg_instanceof_Uint8Array_17156bcf118086a9(arg0) {
  let result;
  try {
    result = getObject(arg0) instanceof Uint8Array;
  } catch (_) {
    result = false;
  }
  const ret = result;
  return ret;
}

export function __wbg_isArray_a1eab7e0d067391b(arg0) {
  const ret = Array.isArray(getObject(arg0));
  return ret;
}

export function __wbg_isSafeInteger_343e2beeeece1bb0(arg0) {
  const ret = Number.isSafeInteger(getObject(arg0));
  return ret;
}

export function __wbg_iterator_9a24c88df860dc65() {
  const ret = Symbol.iterator;
  return addHeapObject(ret);
}

export function __wbg_length_a446193dc22c12f8(arg0) {
  const ret = getObject(arg0).length;
  return ret;
}

export function __wbg_length_e2d2a49132c1b256(arg0) {
  const ret = getObject(arg0).length;
  return ret;
}

export function __wbg_new_405e22f390576ce2() {
  const ret = new Object();
  return addHeapObject(ret);
}

export function __wbg_new_78feb108b6472713() {
  const ret = new Array();
  return addHeapObject(ret);
}

export function __wbg_new_a12002a7f91c75be(arg0) {
  const ret = new Uint8Array(getObject(arg0));
  return addHeapObject(ret);
}

export function __wbg_next_25feadfc0913fea9(arg0) {
  const ret = getObject(arg0).next;
  return addHeapObject(ret);
}

export function __wbg_next_6574e1a8a62d1055() {
  return handleError(function (arg0) {
    const ret = getObject(arg0).next();
    return addHeapObject(ret);
  }, arguments);
}

export function __wbg_parse_def2e24ef1252aff() {
  return handleError(function (arg0, arg1) {
    const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
  }, arguments);
}

export function __wbg_set_37837023f3d740e8(arg0, arg1, arg2) {
  getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
}

export function __wbg_set_3f1d0b984ed272ed(arg0, arg1, arg2) {
  getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
}

export function __wbg_set_65595bdd868b3009(arg0, arg1, arg2) {
  getObject(arg0).set(getObject(arg1), arg2 >>> 0);
}

export function __wbg_set_bb8cecf6a62b9f46() {
  return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    return ret;
  }, arguments);
}

export function __wbg_value_cd1ffa7b1ab794f1(arg0) {
  const ret = getObject(arg0).value;
  return addHeapObject(ret);
}

export function __wbindgen_as_number(arg0) {
  const ret = +getObject(arg0);
  return ret;
}

export function __wbindgen_bigint_from_i64(arg0) {
  const ret = arg0;
  return addHeapObject(ret);
}

export function __wbindgen_bigint_from_u64(arg0) {
  const ret = BigInt.asUintN(64, arg0);
  return addHeapObject(ret);
}

export function __wbindgen_bigint_get_as_i64(arg0, arg1) {
  const v = getObject(arg1);
  const ret = typeof v === "bigint" ? v : undefined;
  getDataViewMemory0().setBigInt64(
    arg0 + 8 * 1,
    isLikeNone(ret) ? BigInt(0) : ret,
    true,
  );
  getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
}

export function __wbindgen_boolean_get(arg0) {
  const v = getObject(arg0);
  const ret = typeof v === "boolean" ? (v ? 1 : 0) : 2;
  return ret;
}

export function __wbindgen_debug_string(arg0, arg1) {
  const ret = debugString(getObject(arg1));
  const ptr1 = passStringToWasm0(
    ret,
    wasm.__wbindgen_export_1,
    wasm.__wbindgen_export_2,
  );
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbindgen_error_new(arg0, arg1) {
  const ret = new Error(getStringFromWasm0(arg0, arg1));
  return addHeapObject(ret);
}

export function __wbindgen_in(arg0, arg1) {
  const ret = getObject(arg0) in getObject(arg1);
  return ret;
}

export function __wbindgen_is_array(arg0) {
  const ret = Array.isArray(getObject(arg0));
  return ret;
}

export function __wbindgen_is_bigint(arg0) {
  const ret = typeof (getObject(arg0)) === "bigint";
  return ret;
}

export function __wbindgen_is_function(arg0) {
  const ret = typeof (getObject(arg0)) === "function";
  return ret;
}

export function __wbindgen_is_null(arg0) {
  const ret = getObject(arg0) === null;
  return ret;
}

export function __wbindgen_is_object(arg0) {
  const val = getObject(arg0);
  const ret = typeof val === "object" && val !== null;
  return ret;
}

export function __wbindgen_is_string(arg0) {
  const ret = typeof (getObject(arg0)) === "string";
  return ret;
}

export function __wbindgen_is_undefined(arg0) {
  const ret = getObject(arg0) === undefined;
  return ret;
}

export function __wbindgen_jsval_eq(arg0, arg1) {
  const ret = getObject(arg0) === getObject(arg1);
  return ret;
}

export function __wbindgen_jsval_loose_eq(arg0, arg1) {
  const ret = getObject(arg0) == getObject(arg1);
  return ret;
}

export function __wbindgen_memory() {
  const ret = wasm.memory;
  return addHeapObject(ret);
}

export function __wbindgen_number_get(arg0, arg1) {
  const obj = getObject(arg1);
  const ret = typeof obj === "number" ? obj : undefined;
  getDataViewMemory0().setFloat64(
    arg0 + 8 * 1,
    isLikeNone(ret) ? 0 : ret,
    true,
  );
  getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
}

export function __wbindgen_number_new(arg0) {
  const ret = arg0;
  return addHeapObject(ret);
}

export function __wbindgen_object_clone_ref(arg0) {
  const ret = getObject(arg0);
  return addHeapObject(ret);
}

export function __wbindgen_object_drop_ref(arg0) {
  takeObject(arg0);
}

export function __wbindgen_string_get(arg0, arg1) {
  const obj = getObject(arg1);
  const ret = typeof obj === "string" ? obj : undefined;
  var ptr1 = isLikeNone(ret)
    ? 0
    : passStringToWasm0(
      ret,
      wasm.__wbindgen_export_1,
      wasm.__wbindgen_export_2,
    );
  var len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbindgen_string_new(arg0, arg1) {
  const ret = getStringFromWasm0(arg0, arg1);
  return addHeapObject(ret);
}

export function __wbindgen_throw(arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1));
}

export function __wbindgen_typeof(arg0) {
  const ret = typeof getObject(arg0);
  return addHeapObject(ret);
}
