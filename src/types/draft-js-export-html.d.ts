declare module 'draft-js-export-html' {
  import { ContentState } from 'draft-js';

  export interface Options {}

  export function stateToHTML(content: ContentState, options?: Options): string;
}
