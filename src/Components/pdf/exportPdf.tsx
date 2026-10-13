import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { PDFDocumentComponent, PDFDocumentProps } from './PDFDocument';

/** Loaded on demand: react-pdf is most of the bundle and only needed when exporting. */
export const renderPdf = (props: PDFDocumentProps) => pdf(<PDFDocumentComponent {...props} />).toBlob();
