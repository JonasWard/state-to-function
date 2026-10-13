import React from 'react';
import { Document, Font, Image, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import mathGreek from '@fontsource/stix-two-text/files/stix-two-text-greek-400-italic.woff?url';
import mathLatin from '@fontsource/stix-two-text/files/stix-two-text-latin-400-italic.woff?url';
import mono from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff?url';
import { ExportRow } from '../../model/exportRows';
import { formatNumber } from '../../model/numeric';
import { palette } from '../../theme/palette';

// bundled fonts, so the export works offline; Greek symbols fall back to the second family
Font.register({ family: 'MathLatin', src: mathLatin });
Font.register({ family: 'MathGreek', src: mathGreek });
Font.register({ family: 'Mono', src: mono });
Font.registerHyphenationCallback((word) => [word]);

const MATH = ['MathLatin', 'MathGreek'];

// the bundled latin subsets lack the narrow no-break space and ∞
const pdfNumber = (n: number) => formatNumber(n).replace(/\u202F/g, ' ').replace('∞', 'Infinity');

const styles = StyleSheet.create({
  page: { padding: 36, fontFamily: 'Helvetica', fontSize: 10, color: palette.ink },
  title: { fontFamily: 'Mono', fontSize: 12, color: palette.accent800 },
  meta: { marginTop: 2, marginBottom: 14, fontSize: 8, color: palette.inkMuted },
  section: {
    marginTop: 12,
    paddingBottom: 3,
    fontSize: 8,
    letterSpacing: 1,
    color: palette.inkMuted,
    borderBottom: `1pt solid ${palette.lineStrong}`
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, borderBottom: `0.5pt solid ${palette.line}` },
  symbol: { width: 60, flexDirection: 'row', alignItems: 'flex-end' },
  symbolText: { fontFamily: MATH, fontSize: 13 },
  subscriptText: { fontFamily: MATH, fontSize: 8, marginLeft: 1 },
  name: { flex: 1, color: palette.inkMuted },
  value: { width: 140, textAlign: 'right', fontFamily: 'Mono' },
  qr: { marginTop: 'auto', alignItems: 'center', paddingTop: 20 },
  qrImage: { width: 120, height: 120 },
  url: { marginTop: 4, fontSize: 6, color: palette.inkSubtle, textAlign: 'center' }
});

const Rows: React.FC<{ title: string; rows: ExportRow[] }> = ({ title, rows }) => (
  <>
    <Text style={styles.section}>{title.toUpperCase()}</Text>
    {rows.map((r, i) => (
      <View key={i} style={styles.row} wrap={false}>
        <View style={styles.symbol}>
          <Text style={styles.symbolText}>{r.symbol}</Text>
          {r.subscript && <Text style={styles.subscriptText}>{r.subscript}</Text>}
        </View>
        <Text style={styles.name}>{r.name || '—'}</Text>
        <Text style={styles.value}>{pdfNumber(r.value)}</Text>
      </View>
    ))}
  </>
);

export interface PDFDocumentProps {
  inputs: ExportRow[];
  results: ExportRow[];
  qrCodeDataUrl: string;
  url: string;
}

export const PDFDocumentComponent: React.FC<PDFDocumentProps> = ({ inputs, results, qrCodeDataUrl, url }) => (
  <Document title="State-to-Function export">
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>State-to-Function</Text>
      <Text style={styles.meta}>
        Generated {new Date().toLocaleString()} · <Link src="https://github.com/JonasWard/state-to-function">JonasWard/state-to-function</Link>
      </Text>
      {inputs.length > 0 && <Rows title="Inputs" rows={inputs} />}
      <Rows title="Results" rows={results} />
      <View style={styles.qr} wrap={false}>
        <Image style={styles.qrImage} src={qrCodeDataUrl} />
        <Text style={styles.url}>{url.match(/.{1,120}/g)?.join('\n')}</Text>
      </View>
    </Page>
  </Document>
);
