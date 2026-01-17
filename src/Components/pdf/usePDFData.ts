import { useMemo } from 'react';
import { PDFDocumentProps } from './PDFDocument';
import { MethodStateData } from '../../applet/methodDataType';
import { getStateData, ObjectNode } from 'url-safe-bitpacking';

interface UsePDFDataProps {
  methodStateData: MethodStateData;
  indexMapping: number[];
  stateNode: ObjectNode;
  currentResult: number[];
}

export const usePDFData = ({
  methodStateData,
  indexMapping,
  stateNode,
  currentResult
}: UsePDFDataProps): {
  inputValues: PDFDocumentProps['inputValues'];
  resultValues: PDFDocumentProps['resultValues'];
} => {
  const inputValues = useMemo(() => {
    const children = stateNode.getChildren();
    const variableValues = Object.fromEntries(
      Object.values(getStateData(stateNode.toDataEntry()) as Record<number, number>).map((v, i) => [indexMapping[i], v])
    );

    return children.map((child, index) => {
      const inputIndex = indexMapping[index];
      const input = methodStateData.inputValues[inputIndex];

      return {
        symbol: input.symbol,
        subscript: input.subscript,
        name: input.name,
        value: variableValues[inputIndex] ?? 0
      };
    });
  }, [methodStateData, indexMapping, stateNode]);

  const resultValues = useMemo(() => {
    return currentResult.map((value, index) => {
      const methodValue = methodStateData.methodValues[index];
      return {
        symbol: methodValue.symbol,
        subscript: methodValue.subscript,
        name: methodValue.name,
        value: value
      };
    });
  }, [currentResult, methodStateData]);

  return { inputValues, resultValues };
};
