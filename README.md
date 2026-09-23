This program uses a compiling mechanism, i.e., compile while editing. It finds
the smallest dirty node, and recompiles that node only, reusing unrelated nodes
within the dirty node. So it is very efficient for structured editing.

Following formats are (partially) implemented:

- html: [./src/lib/compiling/html/](./src/lib/compiling/html)
- css
- set: [./src/lib/compiling/set/](./src/lib/compiling/set)
- uri
- plain
- mdext: [./src/lib/compiling/mdext/](./src/lib/compiling/mdext)

## Unittest

```bash
cd /path_to/compiling.ts
# deno 2.7.13
deno test -R --reporter=dot . # 13 passed (9113 steps)
```

