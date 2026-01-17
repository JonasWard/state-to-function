import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font, Link } from '@react-pdf/renderer';

// Register a font that supports Greek characters and other Unicode symbols
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 'normal'
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 'bold'
    }
  ]
});

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Roboto'
  },
  title: {
    fontSize: 12,
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  timestamp: {
    fontSize: 9,
    marginBottom: 8,
    textAlign: 'center',
    color: '#666'
  },
  table: {
    width: '100%',
    marginBottom: 10
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 5,
    fontWeight: 'bold',
    fontSize: 12,
    borderBottom: '1pt solid #000'
  },
  tableRow: {
    flexDirection: 'row',
    padding: 4,
    fontSize: 10,
    borderBottom: '1pt solid #e0e0e0'
  },
  tableCol: {
    flex: 1,
    textAlign: 'left'
  },
  tableColName: {
    flex: 2,
    textAlign: 'left'
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 5,
    marginTop: 5,
    fontWeight: 'bold'
  },
  qrCodeContainer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingTop: 20
  },
  qrCodeLabel: {
    fontSize: 10,
    marginBottom: 5,
    textAlign: 'center'
  },
  qrCode: {
    width: 150,
    height: 150
  },
  urlText: {
    fontSize: 8,
    marginTop: 5,
    textAlign: 'center',
    color: '#666'
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  symbolText: {
    fontSize: 10
  },
  subscriptText: {
    fontSize: 7,
    marginLeft: 1
  },
  resultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '0 10px'
  },
  resultCard: {
    width: '48%',
    padding: 4,
    borderBottom: '1pt solid #e0e0e0',
    flexDirection: 'row',
    fontSize: 10
  }
});

export interface PDFDocumentProps {
  inputValues: Array<{
    symbol: string;
    subscript: string;
    name: string;
    value: number | string;
  }>;
  resultValues: Array<{
    symbol: string;
    subscript: string;
    name: string;
    value: number;
  }>;
  qrCodeDataUrl: string;
  currentUrl: string;
}

export const PDFDocumentComponent: React.FC<PDFDocumentProps> = ({
  inputValues,
  resultValues,
  qrCodeDataUrl,
  currentUrl
}) => {
  const renderSymbol = (symbol: string, subscript: string) => {
    if (subscript) {
      return (
        <View style={styles.symbolContainer}>
          <Text style={styles.symbolText}>{symbol}</Text>
          <Text style={styles.subscriptText}>{subscript}</Text>
        </View>
      );
    }
    return <Text style={styles.symbolText}>{symbol}</Text>;
  };

  const formatValue = (value: number | string) => {
    if (typeof value === 'number') {
      // Format numbers with appropriate precision
      if (Number.isInteger(value)) {
        return value.toString();
      }
      // Show up to 6 decimal places, removing trailing zeros
      return value.toFixed(6).replace(/\.?0+$/, '');
    }
    return value;
  };

  const currentDate = new Date().toLocaleString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          State to Function by <Link href="https://github.com/JonasWard">JonasWard</Link>
        </Text>
        <Text style={styles.timestamp}>Generated on {currentDate}</Text>

        {/* Input Values Table */}
        <Text style={styles.sectionTitle}>Input Values</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCol}>Symbol</Text>
            <Text style={styles.tableColName}>Name</Text>
            <Text style={styles.tableCol}>Value</Text>
          </View>
          {inputValues.map((input, index) => (
            <View key={`input-${index}`} style={styles.tableRow}>
              <View style={styles.tableCol}>{renderSymbol(input.symbol, input.subscript)}</View>
              <Text style={styles.tableColName}>{input.name || '—'}</Text>
              <Text style={styles.tableCol}>{formatValue(input.value)}</Text>
            </View>
          ))}
        </View>

        {/* Result Values Table */}
        <Text style={styles.sectionTitle}>Result Values</Text>
        <View style={styles.resultGrid}>
          {resultValues.map((result, index) => (
            <View key={`result-${index}`} style={styles.resultCard}>
              <View style={styles.tableCol}>{renderSymbol(result.symbol, result.subscript)}</View>
              <Text style={styles.tableColName}>{result.name || '—'}</Text>
              <Text style={styles.tableCol}>{formatValue(result.value)}</Text>
            </View>
          ))}
        </View>

        {/* QR Code */}
        <View style={styles.qrCodeContainer}>
          <Text style={styles.qrCodeLabel}>Scan to view this configuration:</Text>
          <Image style={styles.qrCode} src={qrCodeDataUrl} />
          <Text style={styles.urlText}>{currentUrl}</Text>
        </View>
      </Page>
    </Document>
  );
};
