# Protocol Buffer Definitions

This directory should contain the `.proto` files from which the JavaScript/TypeScript classes are generated.

It is highly recommended to populate this directory by adding the `phenopacket-schema` repository (or its `src/main/proto` content) as a Git submodule.

Example:

```bash
git submodule add https://github.com/phenopackets/phenopacket-schema.git phenopacket-schema-source
```

Then, the `generate-protos.sh` script should be configured to look for protos within `protos/phenopacket-schema-source/src/main/proto/`.

Ensure all necessary `.proto` files are present, including:

- `google/protobuf/timestamp.proto` (if not provided by `protoc` or `grpc-tools` includes)
- `phenopackets/schema/v2/core/*.proto`
- `phenopackets/schema/v2/phenopackets.proto`
- `phenopackets/vrs/v1/vrs.proto`
- `phenopackets/vrsatile/v1/vrsatile.proto`
