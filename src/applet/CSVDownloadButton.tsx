import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { generateCSV } from './csvHelpers';

interface CSVDownloadButtonProps {
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
  fileName?: string;
}

export const CSVDownloadButton: React.FC<CSVDownloadButtonProps> = ({
  inputValues,
  resultValues,
  fileName = 'state-to-function-export.csv'
}) => {
  const handleDownload = () => {
    try {
      // Generate CSV content
      const csvContent = generateCSV(inputValues, resultValues);

      // Create a Blob from the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      // Create a download link and trigger it
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating CSV:', error);
    }
  };

  return (
    <Button icon={<DownloadOutlined />} onClick={handleDownload}>
      Download CSV
    </Button>
  );
};
