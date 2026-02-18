# XWalk Converter - Quick Visual Reference

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER BROWSER                              │
│                  https://lifesciences.danaher.com                   │
│                      /us/en/solutions.html                          │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   EDGE DELIVERY SERVICES (EDS)                      │
│                                                                     │
│  1. Check if page exists in Git repository                         │
│     └─ If yes: Serve from Git                                      │
│     └─ If no: Call XWalk Converter                                 │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      XWALK CONVERTER                                │
│                  (Adobe I/O Runtime Function)                       │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 1. ROUTING DECISION (index.js)                                │ │
│  │    - Check converter-paths-config.js                          │ │
│  │    - Determine: Convert or Pass-through?                      │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                             │                                       │
│                   ┌─────────┴─────────┐                             │
│                   ▼                   ▼                             │
│  ┌──────────────────────┐  ┌──────────────────────┐                │
│  │   PASS-THROUGH       │  │   CONVERT            │                │
│  │   (EDS Pages)        │  │   (AEM Pages)        │                │
│  └──────────────────────┘  └──────────┬───────────┘                │
│                                       │                             │
│                                       ▼                             │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 2. PATH MAPPING (paths.json)                                  │ │
│  │    /us/en/solutions.html                                      │ │
│  │         ↓                                                     │ │
│  │    /content/danaher/ls/us/en/solutions.html                  │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                             │                                       │
│                             ▼                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 3. FETCH FROM AEM                                             │ │
│  │    https://author-p93411-e849552.adobeaemcloud.com            │ │
│  │    /bin/franklin.delivery/hlxsites/danaher-ls-aem-prod/main   │ │
│  │    /content/danaher/ls/us/en/solutions.html?wcmmode=disabled  │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                             │                                       │
│                             ▼                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 4. TRANSFORM (import.js + transformers)                       │ │
│  │    HTML → Process DOM → Apply Transformers → Markdown        │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                             │                                       │
│                             ▼                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 5. POST-PROCESS (utils.js)                                    │ │
│  │    - Fix links (append .html)                                 │ │
│  │    - Fix image URLs                                           │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                             │                                       │
└─────────────────────────────┼───────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      MARKDOWN CONTENT                               │
│                   (Returned to EDS)                                 │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           USER BROWSER                              │
│                      (Rendered Page)                                │
└─────────────────────────────────────────────────────────────────────┘
```

## Transformation Pipeline Detail

```
                    AEM HTML DOCUMENT
                           │
                           ▼
    ┌──────────────────────────────────────────┐
    │  SYNC TRANSFORMERS (in order)            │
    ├──────────────────────────────────────────┤
    │  1. table                                │
    │  2. videoEmbed                           │
    │  3. callToAction                         │
    │  4. accordion                            │
    │  5. banner                               │
    │  6. carousel                             │
    │  7. logoCloud                            │
    │  8. heroVideo                            │
    │  9. breadcrumb                           │
    │  10. cards                               │
    │  11. eventCards                          │
    │  12. heading                             │
    │  13. image                               │
    │  14. workflowContainer                   │
    │  15. featureImage                        │
    │  ... (40+ transformers)                  │
    │  └─ productCategoryList (for solutions)  │
    └──────────────────────────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────┐
    │  ASYNC TRANSFORMERS                      │
    ├──────────────────────────────────────────┤
    │  - productHero (fetches product data)    │
    └──────────────────────────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────┐
    │  XF TRANSFORMERS (if no XF in page)      │
    ├──────────────────────────────────────────┤
    │  - footer                                │
    │  - stickyFooter                          │
    │  - header (async)                        │
    └──────────────────────────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────┐
    │  REMOVE UNWANTED ELEMENTS                │
    ├──────────────────────────────────────────┤
    │  - header                                │
    │  - footer                                │
    │  - component                             │
    │  - div.social                            │
    │  - div.cloudservice.testandtarget        │
    └──────────────────────────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────┐
    │  POST TRANSFORMERS                       │
    ├──────────────────────────────────────────┤
    │  - postProcessSVGIcons                   │
    │  - metadata (critical!)                  │
    └──────────────────────────────────────────┘
                           │
                           ▼
              TRANSFORMED HTML (main element)
                           │
                           ▼
           CROSSWALK CONVERTER (HTML → Markdown)
                           │
                           ▼
                    MARKDOWN OUTPUT
```

## File Dependency Graph

```
                        ┌─────────────────┐
                        │   index.js      │  ← Main Entry Point
                        │  (main export)  │
                        └────────┬────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
         ┌──────────────┐  ┌──────────┐  ┌────────────────────────┐
         │converter.yaml│  │paths.json│  │converter-paths-config.js│
         └──────────────┘  └──────────┘  └────────────────────────┘
                    │
                    ├──────────────┐
                    ▼              ▼
            ┌──────────────┐  ┌─────────────┐
            │  utils.js    │  │  import.js  │ ← Transformation Orchestrator
            │ (pipeline)   │  └──────┬──────┘
            └──────────────┘         │
                                     │
                            ┌────────┴────────────────────┐
                            ▼                             ▼
                ┌─────────────────────┐      ┌──────────────────────────┐
                │transformers/index.js│      │  crosswalk-converter     │
                │ (transformer list)  │      │   (npm package)          │
                └──────────┬──────────┘      └──────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┬──────────────┬────────────┐
        ▼                  ▼                  ▼              ▼            ▼
  ┌──────────┐      ┌──────────┐      ┌──────────┐   ┌──────────┐  ┌──────────┐
  │metadata  │      │ heading  │      │  image   │   │  cards   │  │ banner   │
  │   .js    │      │   .js    │      │   .js    │   │   .js    │  │   .js    │
  └──────────┘      └──────────┘      └──────────┘   └──────────┘  └──────────┘
        │                  │                  │              │            │
        └──────────────────┴──────────────────┴──────────────┴────────────┘
                                           │
                                           └─── [40+ more transformers]
```

## Solutions Page Transformation Example

```
INPUT: AEM HTML for /us/en/solutions.html
┌────────────────────────────────────────────────────────────┐
│ <html>                                                     │
│   <body>                                                   │
│     <div class="banner">                                   │
│       <h1>Solutions</h1>                                   │
│       <p>Discover our solutions...</p>                     │
│     </div>                                                 │
│     <div class="productcategorylist">                      │
│       <div class="product-card">...</div>                  │
│       <div class="product-card">...</div>                  │
│     </div>                                                 │
│     <div class="columns">                                  │
│       <div>Column 1</div>                                  │
│       <div>Column 2</div>                                  │
│     </div>                                                 │
│   </body>                                                  │
│ </html>                                                    │
└────────────────────────────────────────────────────────────┘
                           │
                           │ TRANSFORMERS APPLIED:
                           │ 1. banner.js
                           │ 2. productCategoryList.js
                           │ 3. columns.js
                           │ 4. metadata.js
                           │
                           ▼
OUTPUT: Markdown
┌────────────────────────────────────────────────────────────┐
│ ## Banner                                                  │
│ | Solutions | Discover our solutions... |                  │
│                                                            │
│ ## Product Card (solutions)                                │
│ | Product 1 | Product 2 |                                  │
│                                                            │
│ ## Columns                                                 │
│ | Column 1 | Column 2 |                                    │
│                                                            │
│ ---                                                        │
│                                                            │
│ ## Metadata                                                │
│ | Title | Solutions |                                      │
│ | Description | ... |                                      │
│ | Template | ... |                                         │
│ | solution | analytical |                                  │
└────────────────────────────────────────────────────────────┘
```

## Configuration Flow for Solutions Page

```
REQUEST: /us/en/solutions.html
         │
         ▼
┌────────────────────────────────────────┐
│ skipConverter() check                  │
├────────────────────────────────────────┤
│ Path: /us/en/solutions.html            │
│ Check: includeStagePaths               │
│ Match: 'solutions' ✓                   │
│ Decision: USE CONVERTER                │
└────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ mapInbound() - Path mapping            │
├────────────────────────────────────────┤
│ Input: /us/en/solutions.html           │
│ Mapping: /content/.../us/en/:/us/en/   │
│ Output: /content/danaher/ls/us/en/     │
│         solutions.html                 │
└────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ fetchContentWithFranklinDelivery()     │
├────────────────────────────────────────┤
│ Origin: converter.yaml                 │
│ Final URL:                             │
│ https://author-p93411-e849552.         │
│   adobeaemcloud.com/bin/franklin.      │
│   delivery/hlxsites/danaher-ls-aem-    │
│   prod/main/content/danaher/ls/us/en/  │
│   solutions.html?wcmmode=disabled      │
└────────────────────────────────────────┘
         │
         ▼
    [TRANSFORMATION]
         │
         ▼
    [MARKDOWN OUTPUT]
```

## Minimal vs Full Implementation

### Minimal Implementation (Proof of Concept)
```
your-project/
├── converter.yaml (5 KB)
├── paths.json (1 KB)
└── tools/
    ├── actions/convert/src/
    │   ├── index.js (15 KB)
    │   ├── converter-paths-config.js (1 KB)
    │   └── utils.js (2 KB)
    └── importer/
        ├── import.js (3 KB)
        └── transformers/
            ├── index.js (2 KB)
            ├── metadata.js (8 KB)
            └── heading.js (1 KB)
```
**Total: ~38 KB, 9 files**

### Production Implementation (Full Featured)
```
your-project/
├── converter.yaml
├── paths.json
└── tools/
    ├── actions/convert/
    │   ├── src/ (4 files, ~20 KB)
    │   ├── webpack.config.js (2 KB)
    │   └── .eslintrc.js (1 KB)
    └── importer/
        ├── import.js (3 KB)
        └── transformers/ (50+ files, ~100 KB)
```
**Total: ~126 KB, 60+ files**

## Quick Decision Tree

```
                    START
                      │
                      ▼
        Do you have AEM content to convert?
                      │
            ┌─────────┴─────────┐
            │                   │
           NO                  YES
            │                   │
            ▼                   ▼
    Use standard EDS    Do you need custom
    (no converter)      component transformations?
                                │
                      ┌─────────┴─────────┐
                      │                   │
                     NO                  YES
                      │                   │
                      ▼                   ▼
            Use basic transformers  Copy full transformer
            (10 files, ~40 KB)      library (60+ files)
                      │                   │
                      └─────────┬─────────┘
                                ▼
                    Customize for your needs:
                    - Update paths in config files
                    - Modify transformer selectors
                    - Add custom transformers
                    - Test and deploy
```

## Environment-Specific Configuration

```
┌─────────────────────────────────────────────────────────────┐
│                     STAGE ENVIRONMENT                       │
├─────────────────────────────────────────────────────────────┤
│ internalHost: main--danaher-ls-aem--hlxsites.hlx.live       │
│ origin: author-p93411-e849552.adobeaemcloud.com             │
│                                                             │
│ includeStagePaths:                                          │
│   - solutions  ← All solution pages converted               │
│   - products/                                               │
│   - blog                                                    │
│   - news                                                    │
│   ...                                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   PRODUCTION ENVIRONMENT                    │
├─────────────────────────────────────────────────────────────┤
│ internalHost: main--danaher-ls-aem-prod--hlxsites.hlx.live  │
│ origin: author-p93411-e849552.adobeaemcloud.com             │
│                                                             │
│ includeProdPaths:                                           │
│   - solutions/analytical  ← Only specific solutions         │
│   - solutions/digital/products                              │
│   - products/                                               │
│   - blog                                                    │
│   ...                                                       │
└─────────────────────────────────────────────────────────────┘
```

## Troubleshooting Flowchart

```
                    Problem Detected
                           │
                           ▼
              Is the page being converted?
                           │
              ┌────────────┴────────────┐
              │                         │
             NO                        YES
              │                         │
              ▼                         ▼
    Check converter-paths-    Does content look right?
    config.js includes                  │
              │              ┌──────────┴──────────┐
              │             NO                    YES
              ▼              │                     │
    Add path to        Check transformers          ▼
    includePaths       for missing/broken      All good!
              │        component handling
              │              │
              └──────────────┘
                      │
                      ▼
              Is transformer applied?
                      │
          ┌───────────┴───────────┐
         NO                      YES
          │                       │
          ▼                       ▼
    Check transformers/     Check CSS selectors
    index.js - is it        match AEM structure
    imported?                     │
          │                       │
          └───────────────────────┘
                      │
                      ▼
                Test in isolation
                      │
                      ▼
                  Fix & Redeploy
```

---

**Legend:**
- `│` `└` `┌` `┐` `┘` : Flow connectors
- `▼` : Direction of flow
- `✓` : Success/Match
- `...` : Additional items not shown

For detailed explanations, see:
- `XWALK_CONVERTER_GUIDE.md` - Complete guide
- `XWALK_FILES_REFERENCE.md` - File-by-file reference
