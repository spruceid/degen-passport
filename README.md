# Degen Passport Chrome Extension

In order for this extension to work [Credible](https://github.com/spruceid/credible) must be in the same root folder.

## How to build Credible for this extension
Since chrome extension doesn't support WASM we have to first build an ASM target in [DIDKit](https://github.com/spruceid/didkit), this can be achieved by executing the following command in DIDKit's folder:

```
make -C lib ../target/test/asmjs.stamp
```

For more details on how to build de ASM target please refeer to [ASM Target](https://github.com/spruceid/didkit/tree/feature/asmjs/lib/wasm#asm-target)

After building the correct DIDKit dependencies for this extension it's time to build Credible, first make sure you are in the correct branch `feature/ext-wip`, then execute the following command:

```bash
flutter build web \
  --no-sound-null-safety \
  --csp \
  --dart-define=FLUTTER_WEB_CANVASKIT_URL=/vendor/ \
  --release
```

## How to use

- Build Credible for chrome extension
- Enable Developer mode in [Chrome extensions](chrome://extensions/)
- Load unpacked extension in this folder

## `canvaskit`

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
cd modules/canvaskit
make debug
```

- Replace this line on `$SKIA/modules/canvaskit/canvaskit/bin/canvaskit.js`

```
618c618
< var isNode = !(new Function('try {return this===window;}catch(e){ return false;}')());
---
> var isNode = false;
```

- Copy `$SKIA/modules/canvaskit/canvaskit/bin/canvaskit.js` to `$CREDIBLE/web/vendor/`

- Build Credible as described above.
