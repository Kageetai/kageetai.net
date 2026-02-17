---
created: 2026-02-09T17:18+01:00
changed: 2026-02-17T14:19+01:00
image: "[[TIL React PDF renderer-1771334310711.webp]]"
publish: true
published: 2026-02-17
summary: "TIL: Generate Figma-perfect PDFs server-side in Next.js with `@react-pdf/renderer` – React components, ~2MB footprint, no headless browser bloat!"
---
  
Ever struggled to generate PDFs in Next.js that perfectly match your Figma designs? With custom branding, coloured skill badges, and multi-page layouts? I did too – that's exactly what we needed for candidate reports. Today I implemented it using `@react-pdf/renderer`, and it was a game-changer. Here are some notes about what I learned along the way.  
  
## The Problem  
  
We needed to generate downloadable candidate reports as PDFs from a Next.js API route. The reports had to match a Figma design with branding, skills ratings with coloured badges, and multi-page layout.  
  
## Why @react-pdf/renderer?  
  
| Option                  | Size   | Approach                                    |  
| ----------------------- | ------ | ------------------------------------------- |  
| Puppeteer/Playwright    | ~300MB | Headless browser, render HTML to PDF        |  
| **@react-pdf/renderer** | ~2MB   | Direct PDF generation from React components |  
| pdfkit                  | ~3MB   | Imperative API (drawText, drawRect)         |  
  
The winner: `@react-pdf/renderer` - lightweight, familiar React component model, works server-side in API routes.  
  
## Key Concepts  
  
### 1. It's React, But Not Quite  
  
You write components with JSX, but use PDF-specific primitives:  
  
```tsx  
import { Document, Page, View, Text, Image } from '@react-pdf/renderer';  
  
// Regular React patterns work  
function MyPDF({ data }) {  
  return (  
    <Document>  
      <Page size="A4">  
        <View><Text>{data.title}</Text></View>  
      </Page>  
    </Document>  
  );  
}  
```  
  
**What's different:**  
- No `div`, `span`, `p` - use `View` and `Text`  
- No CSS classes - use `StyleSheet.create()`  
- Flexbox works, but it's the default (no `display: flex` needed)  
- No CSS Grid  
  
### 2. Styling with StyleSheet  
  
```tsx  
import { StyleSheet } from '@react-pdf/renderer';  
  
const styles = StyleSheet.create({  
  page: {  
    padding: 40,  
    fontFamily: 'Helvetica',  // Built-in fonts work  
    fontSize: 10,  
    color: '#1C1C1C'  
  },  
  header: {  
    flexDirection: 'row',     // Flexbox is default  
    justifyContent: 'space-between',  
    borderBottomWidth: 2,  
    borderBottomColor: '#FF7F40'  
  }  
});  
  
// Apply like React Native  
<View style={styles.header}>  
```  
  
**Dynamic styles** work with array syntax:  
  
```tsx  
<Text style={[styles.badge, { backgroundColor: getBgColor(score) }]}>  
  {label}  
</Text>  
```  
  
### 3. Images Need Absolute Paths  
  
In server-side rendering, relative paths don't work. Use `process.cwd()`:  
  
```tsx  
import path from 'path';  
  
const logoPath = path.join(process.cwd(), 'public', 'img', 'logo.png');  
  
// Note: no alt prop - @react-pdf/renderer Image doesn't support it  
<Image src={logoPath} style={styles.logo} />  
```  
  
**SVGs have limited support** - convert to PNG for reliable rendering.  
  
### 4. Dynamic Page Numbers  
  
The `render` prop gives you page context:  
  
```tsx  
<Text render={({ pageNumber, totalPages }) =>  
  `Page ${pageNumber} of ${totalPages}`  
} />  
```  
  
### 5. Fixed Headers Across Pages  
  
Use the `fixed` prop for elements that should repeat:  
  
```tsx  
<View style={styles.header} fixed>  
  <Image src={logoPath} />  
  <Text>Candidate Report</Text>  
</View>  
```  
  
## API Route Integration  
  
```tsx  
// route.tsx  
import { renderToBuffer } from '@react-pdf/renderer';  
  
export async function GET(req: NextRequest) {  
  const data = await fetchData();  
  
  // Generate PDF buffer  
  const buffer = await renderToBuffer(<CandidateReport data={data} />);  
  
  // Return with download headers  
  return new NextResponse(new Uint8Array(buffer), {  
    headers: {  
      'Content-Type': 'application/pdf',  
      'Content-Disposition': `attachment; filename="Report.pdf"`  
    }  
  });  
}  
```  
  
## Project Structure  
  
```  
pdf-templates/  
└── CandidateReport/  
    ├── index.tsx           # Main <Document> with <Page> components  
    ├── styles.ts           # StyleSheet.create() definitions  
    ├── types.ts            # TypeScript types for report data  
    ├── components/  
    │   ├── PageHeader.tsx  # Logo + title (fixed across pages)  
    │   ├── CandidateProfile.tsx  
    │   ├── SkillItem.tsx   # Reusable skill rating component  
    │   └── ...  
    └── utils/  
        └── scoreLabels.ts  # Score → label/color mapping  
```  
  
## Deep Dive: Why Custom Fonts Failed (and the Fix)  
  
### The Original Approach  
  
The initial implementation tried to load Inter from Google Fonts:  
  
```tsx  
// index.tsx (original)  
import { Document, Font, Page, View } from '@react-pdf/renderer';  
  
Font.register({  
  family: 'Inter',  
  fonts: [  
    {  
      src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',  
      fontWeight: 'normal'  
    },  
    {  
      src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2',  
      fontWeight: 'bold'  
    }  
  ]  
});  
```  
  
Then in styles:  
  
```tsx  
page: {  
  fontFamily: 'Inter',  // Reference the registered font  
  // ...  
}  
```  
  
### What Went Wrong  
  
The PDF generated, but **all text was invisible or missing**. Several potential causes:  
  
1. **Network latency in serverless environments**: The font fetch happens at render time. In cold-start scenarios, the network request might timeout or fail silently.  
2. **WOFF2 format issues**: `@react-pdf/renderer` has better support for TTF/OTF formats than WOFF2. The Google Fonts URL serves WOFF2, which can cause rendering problems.  
3. **Async font loading race condition**: `Font.register()` initiates the download, but `renderToBuffer()` might execute before the font is fully loaded. There's no built-in way to await font readiness.  
4. **CORS in certain environments**: Some deployment environments restrict outbound requests to external font CDNs.  
  
### The Quick Fix: Built-in Fonts  
  
Rather than debug remote font loading, we switched to a built-in font:  
  
```tsx  
// styles.ts (fixed)  
page: {  
  fontFamily: 'Helvetica',  // Built-in, always available  
  // ...  
}  
```  
  
**Built-in fonts available in @react-pdf/renderer:**  
- Courier  
- Helvetica  
- Times-Roman  
- Symbol  
- ZapfDingbats  
  
### If You Really Need Custom Fonts  
  
Here's what would work more reliably:  
  
**Option 1: Self-host the font file (TTF format)**  
  
```tsx  
import path from 'path';  
  
const interRegular = path.join(process.cwd(), 'public', 'fonts', 'Inter-Regular.ttf');  
const interBold = path.join(process.cwd(), 'public', 'fonts', 'Inter-Bold.ttf');  
  
Font.register({  
  family: 'Inter',  
  fonts: [  
    { src: interRegular, fontWeight: 'normal' },  
    { src: interBold, fontWeight: 'bold' }  
  ]  
});  
```  
  
**Option 2: Use base64-encoded font**  
  
```tsx  
const interBase64 = 'data:font/truetype;base64,AAEAAAARAQAABAAQR0...';  
  
Font.register({  
  family: 'Inter',  
  src: interBase64  
});  
```  
  
**Option 3: Pre-fetch with explicit await** (requires wrapper)  
  
```tsx  
// Ensure font is loaded before render  
await fetch(fontUrl).then(res => res.arrayBuffer());  
Font.register({ family: 'Inter', src: fontUrl });  
const buffer = await renderToBuffer(<MyDoc />);  
```  
  
### Lesson Learned  
  
For MVPs and time-constrained features, **built-in fonts are your friend**. Helvetica is clean, professional, and works 100% of the time. Save custom font debugging for when branding requirements are strict.  
  
The visual difference between Inter and Helvetica is subtle enough that most stakeholders won't notice, but the reliability difference is significant.  
  
## Gotchas  
  
1. **ESLint false positives**: `renderToBuffer` triggers testing-library lint rules. Disable with:  
  
```tsx  
// eslint-disable-next-line testing-library/render-result-naming-convention  
const buffer = await renderToBuffer(<MyDoc />);  
```  
  
1. **No conditional `<Page>`**: All pages render. Use conditional content *within* pages instead.  
2. **Text must be in `<Text>`**: Unlike HTML, raw strings outside `<Text>` will error.  
3. **`gap` property**: Works in `flexDirection: 'row'`, but use `marginBottom` for vertical spacing.  
  
## Summary  
  
All of this really helped me with the problem of candidate report exports and `@react-pdf/renderer` is great for generating PDFs from React components server-side. The mental model is "React Native for PDFs" - familiar component patterns with PDF-specific primitives and styling. The lightweight footprint (~2MB vs 300MB for browser-based solutions) makes it ideal for serverless deployments.  
Hope this also helps someone else with understanding the process as well. This is my first try at a "TIL" post, mainly to help myself understand things like this better, especially for my own future-self.  
