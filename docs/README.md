# XWalk Converter Documentation

This directory contains comprehensive documentation about the XWalk (Crosswalk) converter used in this project to transform AEM pages into Edge Delivery Services (EDS) pages.

## Documents Overview

### 📘 [XWALK_CONVERTER_GUIDE.md](./XWALK_CONVERTER_GUIDE.md)
**The complete guide to understanding and using the XWalk converter**

This is the main documentation that explains:
- What the XWalk converter is and how it works
- Step-by-step explanation of the transformation process
- Example walkthrough: How `https://lifesciences.danaher.com/us/en/solutions.html` gets converted
- How to use this converter in another project
- Testing and debugging tips
- Common issues and solutions

**Start here if you want to understand the overall architecture and workflow.**

### 📋 [XWALK_FILES_REFERENCE.md](./XWALK_FILES_REFERENCE.md)
**Detailed file-by-file reference guide**

This document provides:
- Complete list of all files needed for the converter
- Purpose and function of each file
- Customization requirements for each file
- Minimal vs full implementation file sets
- NPM dependencies and scripts
- Quick start checklist

**Use this when you're ready to copy files to your project and need to know exactly what each file does.**

### 🎨 [XWALK_VISUAL_REFERENCE.md](./XWALK_VISUAL_REFERENCE.md)
**Visual diagrams and flowcharts**

This document contains:
- Architecture diagrams
- Transformation pipeline visualization
- File dependency graphs
- Configuration flow diagrams
- Decision trees
- Troubleshooting flowcharts

**Perfect for visual learners or when you need a quick overview of how components connect.**

## Quick Start

### I want to understand how the converter works
👉 Read **XWALK_CONVERTER_GUIDE.md** from top to bottom

### I want to copy this to my project
👉 Follow this sequence:
1. Read "How to Use This in Another Project" in **XWALK_CONVERTER_GUIDE.md**
2. Use **XWALK_FILES_REFERENCE.md** to identify which files you need
3. Follow the "Quick Start Checklist" in **XWALK_FILES_REFERENCE.md**
4. Reference **XWALK_VISUAL_REFERENCE.md** for diagrams as needed

### I'm debugging an issue
👉 Check:
1. "Common Issues and Solutions" in **XWALK_CONVERTER_GUIDE.md**
2. "Troubleshooting Flowchart" in **XWALK_VISUAL_REFERENCE.md**
3. "Testing Individual Transformers" in **XWALK_FILES_REFERENCE.md**

## Key Concepts

### What is XWalk Converter?
The XWalk (Crosswalk) converter is a bridge between Adobe Experience Manager (AEM) and Edge Delivery Services (EDS). It:
- Fetches content from AEM on-demand
- Transforms AEM components into EDS blocks
- Returns markdown content to EDS
- Enables gradual migration from AEM to EDS

### How Does It Transform a Solutions Page?

```
AEM Page (/content/danaher/ls/us/en/solutions.html)
    ↓
[Path Mapping via paths.json]
    ↓
[Fetch from AEM Author]
    ↓
[Apply 40+ Component Transformers]
    ↓
[Generate Metadata]
    ↓
Markdown Content
    ↓
EDS Page (/us/en/solutions.html)
```

### Essential Files to Copy

For a basic implementation, you need:

1. **Configuration** (2 files):
   - `converter.yaml` - AEM URLs and converter settings
   - `paths.json` - Path mappings between AEM and EDS

2. **Converter Core** (3 files):
   - `tools/actions/convert/src/index.js` - Main converter logic
   - `tools/actions/convert/src/converter-paths-config.js` - Path filtering
   - `tools/actions/convert/src/utils.js` - Utility functions

3. **Transformation** (5+ files):
   - `tools/importer/import.js` - Transformation orchestrator
   - `tools/importer/transformers/index.js` - Transformer registry
   - `tools/importer/transformers/metadata.js` - Metadata extraction
   - `tools/importer/transformers/[component].js` - Component transformers as needed

### Solutions Page Specific Transformers

For transforming solutions pages like the example, these are the key transformers:

- `metadata.js` - Detects and tags solutions pages
- `productCategoryList.js` - Product cards on solutions pages
- `cards.js` - Card grids
- `columns.js` - Multi-column layouts
- `banner.js` - Hero banners

## File Organization in This Project

```
/
├── converter.yaml                    # Main converter config
├── paths.json                        # Path mappings
├── docs/                            # This directory
│   ├── README.md                    # You are here
│   ├── XWALK_CONVERTER_GUIDE.md     # Complete guide
│   ├── XWALK_FILES_REFERENCE.md     # File reference
│   └── XWALK_VISUAL_REFERENCE.md    # Visual diagrams
└── tools/
    ├── actions/convert/             # Converter implementation
    │   └── src/
    │       ├── index.js             # Main entry point
    │       ├── converter-paths-config.js
    │       ├── utils.js
    │       └── dev-server.js
    └── importer/                    # Transformation logic
        ├── import.js                # Orchestrator
        └── transformers/            # 50+ component transformers
            ├── index.js
            ├── metadata.js
            ├── heading.js
            ├── image.js
            └── ...
```

## NPM Scripts

The following scripts are available for working with the converter:

```bash
# Build the converter bundle
npm run converter:build

# Build for production (minified)
npm run converter:build:prod

# Run converter tests
npm run converter:test

# Start local development server
npm run converter:serve

# Deploy converter to Adobe I/O Runtime
npm run converter:deploy

# Remove deployed converter
npm run converter:undeploy
```

## Example: Solutions Page Transformation

When a user visits `https://lifesciences.danaher.com/us/en/solutions.html`:

1. **EDS** checks if the page exists in the Git repository
2. **Not found** → EDS calls the XWalk converter
3. **Converter** checks `converter-paths-config.js`:
   - Path `/us/en/solutions.html` contains `'solutions'`
   - `'solutions'` is in `includeStagePaths` → **CONVERT**
4. **Path Mapping** via `paths.json`:
   - `/us/en/solutions.html` → `/content/danaher/ls/us/en/solutions.html`
5. **Fetch** from AEM author instance
6. **Transform** HTML using 40+ transformers including:
   - Banner transformer for hero section
   - ProductCategoryList transformer for product cards
   - Columns transformer for layout
   - Metadata transformer to extract page metadata
7. **Return** markdown content to EDS
8. **EDS** renders the page for the user

## Environment Configuration

The converter behavior differs between stage and production:

**Stage**: More paths are converted (wider net for testing)
```javascript
includeStagePaths: ['solutions', 'products/', 'blog', ...]
```

**Production**: Only specific paths are converted (controlled rollout)
```javascript
includeProdPaths: ['solutions/analytical', 'solutions/digital/products', ...]
```

This is configured in `tools/actions/convert/src/converter-paths-config.js`.

## Technologies Used

- **crosswalk-converter** - Adobe's converter framework
- **jsdom** - DOM manipulation in Node.js
- **unist-util-visit** - MDAST tree traversal
- **webpack** - Bundle converter for deployment
- **Adobe I/O Runtime** - Serverless deployment platform

## Common Questions

### Q: Do I need all 50+ transformers?
**A**: No. Start with essential transformers (metadata, heading, image, table) and add component-specific transformers as needed.

### Q: Can I use this with a different CMS?
**A**: The transformer architecture is flexible. You'd need to modify the fetch logic in `index.js` to fetch from your CMS instead of AEM, but the transformation pipeline can remain similar.

### Q: How do I test transformers locally?
**A**: Use `npm run converter:serve` to start a local development server, then visit `http://localhost:3000/your/path.html` in your browser.

### Q: What if my AEM components are different?
**A**: You'll need to customize the transformers. Look at existing transformers as examples and update the CSS selectors and DOM manipulation logic to match your AEM component structure.

### Q: How do I deploy the converter?
**A**: Run `npm run converter:deploy`. You'll need Adobe I/O Runtime credentials configured. See the crosswalk-converter documentation for setup details.

## Additional Resources

- **Adobe Edge Delivery Services**: https://www.hlx.live/docs/
- **Crosswalk Converter**: https://github.com/adobe/crosswalk-converter
- **Helix Importer**: https://github.com/adobe/helix-importer
- **AEM Franklin Integration**: https://www.hlx.live/developer/aem-integration

## Support

If you have questions or need help:

1. Check the three main documentation files in this directory
2. Review the code in the `tools/` directory
3. Test transformers individually to isolate issues
4. Compare AEM HTML output with expected markdown output

## Contributing

When adding new transformers or modifying existing ones:

1. Document the transformer's purpose
2. Add it to the appropriate array in `transformers/index.js`
3. Test it thoroughly with different content variations
4. Update this documentation if adding significant new functionality

## Version History

- **Current**: Comprehensive documentation for XWalk converter
  - Complete guide with solutions page example
  - File-by-file reference
  - Visual diagrams and flowcharts

---

**Last Updated**: February 2026

For questions or clarifications about this documentation, please refer to the individual documentation files or review the actual implementation in the `tools/` directory.
