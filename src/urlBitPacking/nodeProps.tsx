import React from 'react';
import { SpecificTypeNode } from 'url-safe-bitpacking';

export type TNodeUIProps<T extends SpecificTypeNode> = { node: T; forceRender: () => void };
export type NodeUIProps = TNodeUIProps<SpecificTypeNode>;

export type WrapperComponentFunction = (node: SpecificTypeNode, forceRender: () => void) => React.ReactNode;

export type GeneralChildrenRenderer = (
  children: (SpecificTypeNode | null)[],
  stateChange: React.ReactNode,
  forceRender: () => void
) => React.ReactNode;
