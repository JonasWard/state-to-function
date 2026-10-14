import { Download } from 'lucide-react';

import { QRCodeCanvas } from 'qrcode.react';
import React, { useRef, useState } from 'react';
import { resolveInputValues } from '../model/appletSchema';
import { evaluate } from '../model/evaluate';
import { buildExportRows } from '../model/exportRows';
import { useDocumentStore } from '../state/documentStore';
import { buildQrUrl, buildShareUrl } from '../state/hashSync';
import { notify } from '../state/notify';
import { generateCSV } from './csvHelpers';
import styles from './applet.module.css';
import { downloadBlob } from './download';
import { Button } from '../Components/ui/Button';

/** Rows from the store at the moment of export, never from a render-time snapshot. */
const currentRows = () => {
  const { definition, overrides } = useDocumentStore.getState();
  const values = resolveInputValues(definition, overrides);
  return buildExportRows(definition, values, evaluate(definition, values));
};

export const ExportButtons: React.FC = () => {
  useDocumentStore((s) => s.defString + s.appletString); // keep the QR code's URL current
  const qrRef = useRef<HTMLCanvasElement>(null);
  const [busy, setBusy] = useState(false);
  const url = buildShareUrl();

  const exportCsv = () => {
    const { inputs, results } = currentRows();
    // BOM so spreadsheet apps read Greek symbols as UTF-8
    downloadBlob(new Blob(['﻿', generateCSV(inputs, results)], { type: 'text/csv;charset=utf-8' }), 'state-to-function.csv');
  };

  const exportPdf = async () => {
    setBusy(true);
    try {
      const { renderPdf } = await import('../Components/pdf/exportPdf');
      const blob = await renderPdf({ ...currentRows(), qrCodeDataUrl: qrRef.current!.toDataURL('image/png'), url });
      downloadBlob(blob, 'state-to-function.pdf');
    } catch (e) {
      console.error(e);
      notify.error('The PDF could not be generated.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <QRCodeCanvas ref={qrRef} value={buildQrUrl()} size={512} level="L" className={styles.hidden} />
      <Button icon={<Download />} onClick={exportCsv}>
        CSV
      </Button>
      <Button variant="primary" icon={<Download />} loading={busy} onClick={exportPdf}>
        PDF
      </Button>
    </>
  );
};
