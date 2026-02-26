# XWalk Converter Guide

## Overview

This document explains how the **xwalk converter** (crosswalk converter) transforms AEM pages into Edge Delivery Services (EDS) pages. The xwalk converter acts as a bridge between AEM author instances and Edge Delivery Services, converting AEM HTML content into markdown-based EDS content on-the-fly.

## What is XWalk Converter?

The xwalk converter is a serverless converter that:
1. Fetches content from AEM author instances
2. Transforms AEM HTML into structured markdown
3. Applies custom transformations for different component types
4. Maps AEM paths to EDS paths
5. Serves the converted content to Edge Delivery Services

## How It Works - High Level Flow

```
Browser Request → EDS → XWalk Converter → AEM Author → Transform → Return Markdown
```

1. **User visits**: `https://lifesciences.danaher.com/us/en/solutions.html`
2. **EDS checks**: If page exists in repository (Git), serve it; otherwise call converter
3. **Converter fetches**: Gets AEM page from author instance
4. **Transformation**: Applies all transformers to convert AEM components to EDS blocks
5. **Return**: Markdown content is returned to EDS and rendered

## Example: Solutions Page Transformation

Let's trace how `https://lifesciences.danaher.com/us/en/solutions.html` gets converted:

### Step 1: Path Mapping (paths.json)

The converter uses `paths.json` to map AEM content paths to EDS paths:

```json
{
  "mappings": [
    "/content/danaher/ls/us/en/:/us/en/"
  ]
}
```

- AEM Path: `/content/danaher/ls/us/en/solutions.html`
- EDS Path: `/us/en/solutions.html`

### Step 2: Converter Decision (converter-paths-config.js)

The `skipConverter()` function in `tools/actions/convert/src/index.js` determines if a path should use the converter or pass through directly.

For solutions page:
- Stage environment: `'solutions'` is in `includeStagePaths` → **CONVERTED**
- Production environment: `'solutions/analytical'` and `'solutions/digital/products'` are in `includeProdPaths` → **CONVERTED** (specific solution pages only)

### Step 3: Fetch from AEM (index.js)

The converter fetches the page from AEM author:

```javascript
// Origin from converter.yaml
origin: https://author-p93411-e849552.adobeaemcloud.com/

// Final URL fetched:
https://author-p93411-e849552.adobeaemcloud.com/bin/franklin.delivery/hlxsites/danaher-ls-aem-prod/main/us/en/solutions.html?wcmmode=disabled
```

### Step 4: HTML Transformation (import.js + transformers)

The `tools/importer/import.js` orchestrates the transformation through multiple transformer functions:

1. **Component Transformers** (applied in order):
   - `table.js` - Converts AEM tables
   - `videoEmbed.js` - Handles video embeds
   - `accordion.js` - Converts accordions
   - `banner.js` - Transforms banners
   - `carousel.js` - Handles carousels
   - `cards.js` - Converts card components
   - `columns.js` - Handles column layouts
   - `heading.js` - Processes headings
   - `image.js` - Optimizes images
   - And many more... (see full list in transformers/index.js)

2. **Metadata Transformer** (metadata.js):
   - Detects solution pages via URL pattern
   - Extracts solution metadata
   - Creates metadata block

Example metadata transformation for solutions:
```javascript
// In metadata.js
if (url.pathname.match(/^\/content\/danaher\/ls\/us\/en\/solutions\//)) {
  const solution = url.pathname.replace(/^\/content\/danaher\/ls\/us\/en\/solutions\//, '')
    .replace(/\.html$/, '')
    .split('/');
  meta.solution = solution.at(1);
}
```

### Step 5: MDAST Transformation (utils.js)

The markdown AST (Abstract Syntax Tree) is processed to:
- Append `.html` extensions to internal links
- Ensure proper link formatting
- Apply custom transformations

### Step 6: Return Markdown

The final markdown is returned to EDS and rendered as the solutions page.

## Key Files for XWalk Converter

If you want to reuse this converter in another project, you need these files:

### Core Configuration Files

1. **converter.yaml** - Main converter configuration
   - AEM origin URL
   - Live site URLs
   - Internal host configuration
   - Redirect paths

2. **paths.json** - Path mapping configuration
   - Maps AEM content paths to EDS paths
   - Defines includes for content sync

### Converter Implementation

3. **tools/actions/convert/src/index.js** - Main converter logic
   - Entry point for converter
   - Path routing logic
   - Fetch from AEM
   - Pipeline orchestration

4. **tools/actions/convert/src/converter-paths-config.js** - Path filtering
   - Defines which paths go through converter
   - Separate configs for production and stage
   - Include/exclude path patterns

5. **tools/actions/convert/src/utils.js** - Utility functions
   - Creates conversion pipeline
   - MDAST transformations
   - Link rewriting

6. **tools/actions/convert/webpack.config.js** - Build configuration
   - Bundles converter for deployment

### Transformation Logic

7. **tools/importer/import.js** - Main transformation orchestrator
   - Applies all transformers in sequence
   - Handles async transformers
   - Creates header/footer
   - Generates document path

8. **tools/importer/transformers/** - Component transformers
   All files in this directory transform specific AEM components:
   - `accordion.js` - Accordion components
   - `banner.js` - Banner components
   - `carousel.js` - Carousel/slider components
   - `cards.js` - Card grid components
   - `columns.js` - Column layouts
   - `heading.js` - Heading transformations
   - `image.js` - Image optimization
   - `metadata.js` - **Critical for solutions** - Extracts page metadata
   - `productCategoryList.js` - Product category cards (used on some solutions pages)
   - And ~40+ more transformers

### Build & Deployment Files

9. **tools/actions/convert/package.json** - Dependencies for converter
10. **tools/actions/convert/.eslintrc.js** - Linting configuration

## How to Use This in Another Project

### Step 1: Copy Essential Files

Copy these files/directories to your project:

```
your-project/
├── converter.yaml              # Update with your AEM URLs
├── paths.json                  # Update with your path mappings
└── tools/
    ├── actions/
    │   └── convert/
    │       ├── src/
    │       │   ├── index.js                    # Main converter (may need customization)
    │       │   ├── converter-paths-config.js   # Update with your paths
    │       │   └── utils.js
    │       ├── webpack.config.js
    │       └── package.json                    # Or merge dependencies
    └── importer/
        ├── import.js
        └── transformers/                       # Copy all or only needed ones
            ├── index.js                        # Update to import only your transformers
            ├── metadata.js                     # Customize for your metadata
            └── [other transformers you need]
```

### Step 2: Update Configuration

#### converter.yaml
```yaml
origin: https://author-YOUR-PROGRAM-YOUR-ENV.adobeaemcloud.com/
suffix: ".html?wcmmode=disabled"
internalHost: https://main--YOUR-REPO--YOUR-ORG.hlx.live
host: https://publish-YOUR-PROGRAM-YOUR-ENV.adobeaemcloud.com
liveUrls:
  - https://www.yoursite.com
```

#### paths.json
```json
{
  "mappings": [
    "/content/your-site/us/en/:/us/en/"
  ],
  "includes": [
    "/content/your-site/us/en"
  ]
}
```

#### converter-paths-config.js
```javascript
// Define which paths should go through converter
export const excludeProdPaths = ['no-convert-path'];
export const includeProdPaths = ['solutions', 'products', 'about'];
```

### Step 3: Customize Transformers

1. Review `tools/importer/transformers/index.js`
2. Remove transformers you don't need
3. Customize existing transformers for your AEM components
4. Add new transformers for custom components

### Step 4: Install Dependencies

```bash
npm install --save-dev \
  crosswalk-converter \
  jsdom \
  unist-util-visit \
  webpack \
  copy-webpack-plugin
```

### Step 5: Build and Deploy

```bash
# Build converter
npm run converter:build

# Test locally
npm run converter:serve

# Deploy to production
npm run converter:deploy
```

## Solutions Page Specific Transformations

For solutions pages specifically, these transformers are most relevant:

1. **metadata.js** - Detects and tags solutions pages
2. **productCategoryList.js** - Renders solution product cards
3. **cards.js** - Generic card grids often used on solutions
4. **columns.js** - Multi-column layouts
5. **banner.js** - Hero banners
6. **heading.js** - Page headings and sections

## Testing Your Converter

### Local Testing
```bash
# Start dev server
npm run converter:serve

# Visit in browser
http://localhost:3000/us/en/solutions.html
```

### Debugging Tips

1. **Check converter logs** - Look for transformation errors
2. **Verify path mapping** - Ensure paths.json maps correctly
3. **Test individual transformers** - Comment out transformers to isolate issues
4. **Compare AEM vs EDS output** - Ensure all content is transformed

## Common Issues and Solutions

### Issue: Page not going through converter
**Solution**: Check `converter-paths-config.js` - ensure path is in `includePaths` and not in `excludePaths`

### Issue: Missing components
**Solution**: Add the corresponding transformer from this repository or create a new one

### Issue: Incorrect path mapping
**Solution**: Verify `paths.json` mappings match your AEM structure

### Issue: Metadata not showing
**Solution**: Customize `metadata.js` transformer for your page types

## Advanced Topics

### Custom Transformers

Create a custom transformer for your AEM component:

```javascript
// tools/importer/transformers/mycomponent.js
export default function myComponentTransformer(main, document) {
  // Find AEM component
  const components = main.querySelectorAll('.my-aem-component');
  
  components.forEach((component) => {
    // Extract data
    const title = component.querySelector('h2').textContent;
    
    // Create EDS block
    const block = document.createElement('div');
    block.innerHTML = `
      <div class="my-block">
        <div>${title}</div>
      </div>
    `;
    
    // Replace AEM component with EDS block
    component.replaceWith(block);
  });
}
```

Then add to `transformers/index.js`:
```javascript
import myComponent from './mycomponent.js';

export const transformers = [
  // ... other transformers
  myComponent,
];
```

## Additional Resources

- **Crosswalk Converter Docs**: https://github.com/adobe/crosswalk-converter
- **Helix Importer**: https://github.com/adobe/helix-importer
- **Edge Delivery Services Docs**: https://www.hlx.live/docs/

## Summary

The xwalk converter is a powerful tool that bridges AEM and Edge Delivery Services. For solutions pages specifically:

1. **Configuration**: paths.json + converter.yaml + converter-paths-config.js
2. **Transformation**: import.js orchestrates ~40+ transformers
3. **Key Transformers**: metadata.js, cards.js, columns.js, productCategoryList.js
4. **Output**: Markdown content served to EDS

To reuse in your project, copy the files listed above, update configuration for your AEM instance, customize transformers for your components, and deploy.
