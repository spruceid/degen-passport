#Degen Passport Chrome Extension

In order for this extension to work [Credible](https://github.com/spruceid/credible) must be in the same root folder.

##How to build Credible for this extension
Since chrome extension doesn't support WASM we have to first build an ASM target in [DIDKit](https://github.com/spruceid/didkit), this can be achieved by executing the following command in DIDKit's folder:
```make -C lib ../target/test/asmjs.stamp```

For more details on how to build de ASM target please refeer to [ASM Target](https://github.com/spruceid/didkit/tree/feature/asmjs/lib/wasm#asm-target)

After building the correct DIDKit dependencies for this extension it's time to build Credible, first make sure you are in the correct branch `feature/ext-wip`, then execute the following command:
```flutter build web --no-sound-null-safety --csp --web-renderer html --release```

##How to use
- Build Credible for chrome extension
- Enable Developer mode in [Chrome extensions](chrome://extensions/)
- Load unpacked extension in this folder
