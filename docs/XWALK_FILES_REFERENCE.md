# XWalk Converter - Essential Files Reference

This document provides a complete reference of all files needed to implement the xwalk converter in another project.

## Configuration Files (Root Level)

### converter.yaml
**Location**: `/converter.yaml`
**Purpose**: Main converter configuration
**Key Settings**:
- `origin`: AEM author instance URL
- `suffix`: Query parameters to append to AEM requests
- `internalHost`: Edge Delivery Services internal hostname
- `host`: AEM publish instance URL (for redirects)
- `liveUrls`: Production site URLs (for link rewriting)
- `redirectPaths`: Paths that should redirect to AEM publisher

**Required Changes for New Project**:
- Update all URLs to match your AEM program and environment
- Update `internalHost` with your EDS repo/org/ref
- Update `liveUrls` with your production domains

### paths.json
**Location**: `/paths.json`
**Purpose**: Path mapping between AEM and EDS
**Key Settings**:
- `mappings`: Array of AEM-to-EDS path mappings (format: `"aem-path:eds-path"`)
- `includes`: AEM content paths to include in sync

**Required Changes for New Project**:
- Replace all `/content/danaher/ls/` paths with your AEM content structure
- Update mappings to match your site hierarchy
- Update includes to match content you want to convert

## Converter Core Files

### tools/actions/convert/src/index.js
**Location**: `/tools/actions/convert/src/index.js`
**Purpose**: Main converter entry point and orchestration
**Key Functions**:
- `main(params)`: Main entry point called by EDS
- `skipConverter(path)`: Determines if a path should use converter
- `fetchContentWithFranklinDeliveryServlet()`: Fetches content from AEM
- `rewriteLinksAndImages()`: Post-processes HTML to fix links and images
- `mapInbound()`: Maps EDS paths back to AEM paths

**Dependencies**:
- `crosswalk-converter` (npm package)
- `jsdom` (npm package)
- Imports from `converter.yaml`, `paths.json`, `utils.js`, `converter-paths-config.js`
- Imports transformation function from `import.js`

**Customization Notes**:
- Modify `skipConverter()` logic for your path routing needs
- Update `mediaTypes` object if you have custom binary types
- Adjust link rewriting logic if needed

### tools/actions/convert/src/converter-paths-config.js
**Location**: `/tools/actions/convert/src/converter-paths-config.js`
**Purpose**: Defines which paths go through converter vs pass-through
**Key Exports**:
- `excludeProdPaths`: Paths that should NOT be converted in production
- `includeProdPaths`: Paths that SHOULD be converted in production
- `excludeStagePaths`: Paths that should NOT be converted in staging
- `includeStagePaths`: Paths that SHOULD be converted in staging

**Required Changes for New Project**:
- Define your own include/exclude patterns
- Consider different paths for stage vs production environments
- Use path fragments that match your content structure

### tools/actions/convert/src/utils.js
**Location**: `/tools/actions/convert/src/utils.js`
**Purpose**: Utility functions for the converter pipeline
**Key Functions**:
- `createPipeline()`: Creates the conversion pipeline
- `appendDotHtml()`: MDAST transformer to append .html to links

**Dependencies**:
- `unist-util-visit` (npm package)
- `crosswalk-converter` (npm package)

**Customization Notes**:
- Usually doesn't need changes unless you need custom MDAST transformations

### tools/actions/convert/src/dev-server.js
**Location**: `/tools/actions/convert/src/dev-server.js`
**Purpose**: Local development server for testing converter
**Usage**: Started with `npm run converter:serve`

## Build Configuration

### tools/actions/convert/webpack.config.js
**Location**: `/tools/actions/convert/webpack.config.js`
**Purpose**: Webpack configuration to bundle converter for deployment
**Output**: Creates `dist/index.js.zip` for deployment to Adobe I/O Runtime

**Customization Notes**:
- Usually doesn't need changes
- May need to adjust if you add external dependencies

### tools/actions/convert/package.json (if separate)
**Location**: `/tools/actions/convert/package.json`
**Purpose**: Dependencies specific to converter
**Note**: In this project, converter dependencies are in root `package.json`

## Transformation Files

### tools/importer/import.js
**Location**: `/tools/importer/import.js`
**Purpose**: Main transformation orchestrator
**Key Exports**:
- `transformDOM()`: Main function that applies all transformers
- `generateDocumentPath()`: Generates the output path for converted content

**Process Flow**:
1. Applies synchronous transformers
2. Applies async transformers
3. Applies XF (Experience Fragment) transformers for header/footer
4. Removes unwanted elements
5. Applies post-transformers (including metadata)

**Customization Notes**:
- Update imports in transformer files you use
- Modify element removal list if needed
- Keep the structure but adjust transformer lists

### tools/importer/transformers/index.js
**Location**: `/tools/importer/transformers/index.js`
**Purpose**: Central registry of all transformers
**Key Exports**:
- `transformers`: Array of synchronous transformers
- `asyncTransformers`: Array of async transformers
- `xfTransformers`: Transformers for Experience Fragments
- `xfAsyncTransformers`: Async transformers for Experience Fragments
- `postTransformers`: Transformers applied after main transformation

**Required Changes for New Project**:
- Import only the transformers you need
- Remove unused transformer imports
- Add your custom transformers
- Adjust the order if needed (order matters!)

## Individual Transformers

All located in `/tools/importer/transformers/`

### Essential Transformers (Likely Needed in Most Projects)

#### metadata.js
**Purpose**: Creates metadata block for pages
**Key Features**:
- Extracts title, description, keywords
- Detects page types (solutions, products, articles, etc.)
- Sets canonical URLs
- Handles solution-specific metadata
- Handles product category metadata
- Handles SKU metadata

**Customization Required**: 
- **HIGH** - Update URL pattern matching for your content structure
- Modify metadata extraction logic
- Add/remove metadata fields

#### heading.js
**Purpose**: Transforms AEM heading components
**Customization Required**: LOW - Usually works as-is

#### image.js
**Purpose**: Optimizes and transforms images
**Customization Required**: LOW - May need to adjust image URL patterns

#### table.js
**Purpose**: Converts AEM tables to EDS format
**Customization Required**: LOW

#### columns.js
**Purpose**: Converts multi-column layouts
**Customization Required**: MEDIUM - Adjust for your column component structure

### Solutions Page Specific Transformers

#### productCategoryList.js
**Purpose**: Converts product category list components
**Features**:
- Used on solutions pages to display product cards
- Handles multiple card types
- Supports SKU and family product cards

**Customization Required**: MEDIUM - Update selectors for your component structure

#### cards.js
**Purpose**: Generic card grid components
**Customization Required**: MEDIUM

#### banner.js
**Purpose**: Hero banners and promotional banners
**Customization Required**: MEDIUM

#### carousel.js
**Purpose**: Image/content carousels
**Customization Required**: MEDIUM

### Other Transformers (Copy as Needed)

- `accordion.js` - Accordion/collapsible components
- `breadcrumb.js` - Breadcrumb navigation
- `callToAction.js` - CTA buttons and blocks
- `videoEmbed.js` - Video embeds (YouTube, Vimeo, etc.)
- `footer.js` - Footer transformation
- `header.js` - Header/navigation transformation
- `product.js` - Product detail pages
- `productHero.js` - Product hero sections
- And 30+ more...

**General Approach**:
1. Start with essential transformers
2. Add transformers as you encounter the components
3. Customize each for your AEM component structure

## NPM Scripts (add to package.json)

```json
{
  "scripts": {
    "converter:build": "cd tools/actions/convert && rimraf dist/ && webpack",
    "converter:build:prod": "cd tools/actions/convert && rimraf dist/ && webpack --mode=production",
    "converter:test": "cd tools/actions/convert && instant-mocha --spec test/**/*.test.js --require test/setup-env.esm.mjs --timeout 10000",
    "converter:serve": "npm-run-all converter:build --parallel converter:serve:*",
    "converter:serve:build": "cd tools/actions/convert && webpack ./src/dev-server.js --watch",
    "converter:serve:server": "nodemon -r dotenv/config --inspect tools/actions/convert/dist/index.js --watch tools/actions/convert/dist",
    "converter:deploy": "node node_modules/crosswalk-converter/bin/deploy.mjs tools/actions/convert/dist/index.js.zip",
    "converter:undeploy": "node node_modules/crosswalk-converter/bin/undeploy.mjs"
  }
}
```

## Required NPM Dependencies

Add to your `package.json`:

```json
{
  "dependencies": {
    "@adobe/helix-importer": "github:adobe/helix-importer",
    "crosswalk-converter": "github:buuhuu/crosswalk-converter",
    "jsdom": "^24.0.0",
    "unist-util-visit": "^5.0.0"
  },
  "devDependencies": {
    "copy-webpack-plugin": "^11.0.0",
    "webpack": "^5.0.0",
    "webpack-cli": "^5.0.0",
    "nodemon": "^3.0.0",
    "rimraf": "^5.0.0"
  }
}
```

## Minimal File Set for Basic Converter

If you want to start with the absolute minimum:

```
your-project/
├── converter.yaml                                    # Configure
├── paths.json                                        # Configure
└── tools/
    ├── actions/convert/src/
    │   ├── index.js                                  # Use as-is, update imports
    │   ├── converter-paths-config.js                 # Configure
    │   └── utils.js                                  # Use as-is
    └── importer/
        ├── import.js                                 # Use as-is
        └── transformers/
            ├── index.js                              # Update transformer list
            ├── metadata.js                           # Customize
            ├── heading.js                            # Use as-is
            └── image.js                              # Use as-is
```

## Recommended File Set for Production

For a production-ready converter:

```
your-project/
├── converter.yaml
├── paths.json
└── tools/
    ├── actions/convert/
    │   ├── src/
    │   │   ├── index.js
    │   │   ├── converter-paths-config.js
    │   │   ├── utils.js
    │   │   └── dev-server.js
    │   ├── webpack.config.js
    │   └── .eslintrc.js
    └── importer/
        ├── import.js
        └── transformers/
            ├── index.js
            ├── metadata.js                           # Customize
            ├── heading.js
            ├── image.js
            ├── table.js
            ├── columns.js
            ├── cards.js
            ├── banner.js
            ├── videoEmbed.js
            ├── accordion.js
            ├── footer.js
            ├── header.js
            └── [add others as needed]
```

## Solutions Page Specific Files

For converting solutions pages like `https://lifesciences.danaher.com/us/en/solutions.html`:

**Must Have**:
1. `metadata.js` - Detects and tags solutions pages
2. `productCategoryList.js` - Product cards on solutions pages
3. `cards.js` - General card grids
4. `columns.js` - Multi-column layouts
5. `banner.js` - Hero banners

**Nice to Have**:
1. `carousel.js` - If you have carousels
2. `accordion.js` - If you have accordions
3. `videoEmbed.js` - If you embed videos
4. `callToAction.js` - For CTA buttons

## File Dependencies Diagram

```
index.js (main entry)
├── converter.yaml (config)
├── paths.json (config)
├── converter-paths-config.js (path filtering)
├── utils.js (pipeline)
└── import.js (transformation orchestrator)
    └── transformers/index.js (transformer registry)
        ├── metadata.js
        ├── heading.js
        ├── image.js
        ├── [40+ other transformers]
        └── [your custom transformers]
```

## Quick Start Checklist

- [ ] Copy converter.yaml and update URLs
- [ ] Copy paths.json and update path mappings
- [ ] Copy tools/actions/convert/ directory
- [ ] Copy tools/importer/ directory
- [ ] Update converter-paths-config.js with your paths
- [ ] Customize transformers/index.js (remove unused transformers)
- [ ] Customize metadata.js for your page types
- [ ] Install npm dependencies
- [ ] Test locally with `npm run converter:serve`
- [ ] Deploy with `npm run converter:deploy`

## Testing Individual Transformers

To test a specific transformer in isolation:

1. Create a test file in `tools/actions/convert/test/`
2. Import the transformer
3. Load sample AEM HTML
4. Apply transformer
5. Verify output

Example:
```javascript
import metadata from '../../../importer/transformers/metadata.js';

describe('Metadata Transformer', () => {
  it('should detect solutions pages', () => {
    const url = 'https://author.../content/danaher/ls/us/en/solutions/test.html';
    // Test logic here
  });
});
```

## Additional Notes

- **Order Matters**: Transformers are applied in the order listed in `transformers/index.js`
- **Selector Specificity**: Update CSS selectors in transformers to match your AEM component class names
- **Image Paths**: Adjust image URL transformation in `image.js` if your DAM structure differs
- **Async Transformers**: Use async transformers for operations that require external API calls or complex processing
- **Post Transformers**: Applied after main transformation, use for metadata and final processing

## Support and Resources

- Review transformer code in this repository for examples
- Test transformers individually before integration
- Use browser DevTools to inspect AEM HTML structure
- Compare AEM output with EDS markdown output to debug

---

For detailed explanation of how the converter works, see `XWALK_CONVERTER_GUIDE.md`.
