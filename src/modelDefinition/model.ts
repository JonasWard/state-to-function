import { createParserObject } from 'url-safe-bitpacking'
import { verionArrayDefinition0 } from './types/version0'
import { verionArrayDefinition1 } from './types/version1'

export const parserObjects = createParserObject([verionArrayDefinition0, verionArrayDefinition1], 16)
