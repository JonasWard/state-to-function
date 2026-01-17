import React, { useRef, useEffect, useState } from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { pdf } from '@react-pdf/renderer';
import { QRCodeCanvas } from 'qrcode.react';
import { PDFDocumentComponent, PDFDocumentProps } from './PDFDocument';

interface PDFDownloadButtonProps {
  inputValues: PDFDocumentProps['inputValues'];
  resultValues: PDFDocumentProps['resultValues'];
  fileName?: string;
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  inputValues,
  resultValues,
  fileName = 'state-to-function-report.pdf'
}) => {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Get the current URL
  const currentUrl = window.location.href;

  // Generate QR code data URL
  useEffect(() => {
    if (qrRef.current) {
      const dataUrl = qrRef.current.toDataURL('image/png');
      setQrCodeDataUrl(dataUrl);
    }
  }, [currentUrl]);

  const handleDownload = async () => {
    if (!qrCodeDataUrl) {
      console.error('QR code not ready');
      return;
    }

    setIsGenerating(true);

    try {
      // Create the PDF document
      const doc = (
        <PDFDocumentComponent
          inputValues={inputValues}
          resultValues={resultValues}
          qrCodeDataUrl={qrCodeDataUrl}
          currentUrl={currentUrl}
        />
      );

      // Generate the PDF blob
      const blob = await pdf(doc).toBlob();

      // Create a download link and trigger it
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Hidden QR Code Canvas */}
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <QRCodeCanvas ref={qrRef} value={currentUrl} size={512} level="H" />
      </div>

      {/* Download Button */}
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={handleDownload}
        loading={isGenerating}
        disabled={!qrCodeDataUrl}
      >
        {isGenerating ? 'Generating PDF...' : 'Download PDF'}
      </Button>
    </>
  );
};
