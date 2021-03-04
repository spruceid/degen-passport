# Degen Passport Chrome Extension

In order for this extension to work you will need to have
[Credible](https://github.com/spruceid/credible),
[DIDKit](https://github.com/spruceid/didkit) and
[SSI](https://github.com/spruceid/ssi) in the same folder.

## How to build Credible for this extension

In order to build Credible for this extension you will need to first be able to
build the `ASM.js` target in [DIDKit](https://github.com/spruceid/didkit), for
this some dependencies must be installed: `rust`, `wasm-pack` and
[binaryen](https://github.com/WebAssembly/binaryen).

For installing `rust` we recomend using
[rustup](https://github.com/rust-lang/rustup), which can be achieved by running
the following command:
```bash
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

`wasm-pack` is using for generating `wasm` targets from `rust` code, it can be
obtained via the following command inside DIDKit's folder:

```bash
$ cd ../didkit
$ make -C lib install-wasm-pack
```

[binaryen](https://github.com/WebAssembly/binaryen) is a compiler and toolchain
library for WebAssembly. We use it to generate `ASM.js` from the previous built
`WASM` target. To build it simply clone their repo and run:

```bash
$ git clone https://github.com/WebAssembly/binaryen
$ cd binaryen
$ cmake . && make
```

[Here](https://github.com/WebAssembly/binaryen#building) you can find more
details about another build methods.

After install all dependencies run the following command inside DIDKit's folder:

```bash
$ make -C lib ../target/test/asmjs.stamp
```

If your `binaryen` install folder is different of your `${HOME}` you will need
to set the `BINARYEN_ROOT` variable with it's root location.
```bash
$ BINARYEN_ROOT=${CUSTOM_BINARYEN_ROOT} make -C lib ../target/test/asmjs.stamp
```

For more details on how to build de ASM target please refeer to [ASM Target](https://github.com/spruceid/didkit/tree/feature/asmjs/lib/wasm#asm-target)

After building the correct DIDKit dependencies for this extension it's time to build Credible.

First make sure you are in the correct branch `feature/ext-wip`, then execute the following command:

```bash
$ flutter build web \
  --no-sound-null-safety \
  --csp \
  --dart-define=FLUTTER_WEB_CANVASKIT_URL=/vendor/ \
  --release
```

## How to use

- Build Credible for chrome extension
- Enable Developer mode in [Chrome extensions](chrome://extensions/)
- Load unpacked extension in this folder

## `canvaskit` (OPTIONAL)

Since by default `canvaskit` comes in a `WASM` build, which is not currently
supported in chrome extensions, some changes were made in order to make it work
in pure Javascript and without `unsafe-eval` enabled.

Vendored `canvaskit` is included in the Credible web folder.

But if you want to build it by yourself, follow these steps:

- [Install `emscripten`](https://emscripten.org/docs/getting_started/downloads.html)

- [Clone Skia repository and pull its dependencies](https://skia.org/user/download)

```bash
git clone https://skia.googlesource.com/skia.git --depth 1 --branch canvaskit/0.22.0
cd skia
python2 tools/git-sync-deps
```

- Modify build script `compile.sh`

```
diff --git a/modules/canvaskit/compile.sh b/modules/canvaskit/compile.sh
index 6ba58bfae9..51f0297eb6 100755
--- a/modules/canvaskit/compile.sh
+++ b/modules/canvaskit/compile.sh
@@ -397,6 +397,7 @@ EMCC_DEBUG=1 ${EMCXX} \
     -s MODULARIZE=1 \
     -s NO_EXIT_RUNTIME=1 \
     -s INITIAL_MEMORY=128MB \
-    -s WASM=1 \
+    -s WASM=0 \
+    -s NO_DYNAMIC_EXECUTION=1 \
     $STRICTNESS \
     -o $BUILD_DIR/canvaskit.js
```

- Build `canvaskit`

```bash
$ cd modules/canvaskit
$ make debug
```

- Replace this line on `$SKIA/modules/canvaskit/canvaskit/bin/canvaskit.js`

```git
618c618
< var isNode = !(new Function('try {return this===window;}catch(e){ return false;}')());
---
> var isNode = false;
```

- Copy `$SKIA/modules/canvaskit/canvaskit/bin/canvaskit.js` to
`$CREDIBLE/web/vendor/`

- Build Credible as described above.
