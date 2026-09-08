// The browser build aliases React to preact-compat. Match that runtime boundary
// without importing React's global JSX declarations into the Preact application.
import { Component, ComponentChildren } from "preact";
export interface TooltipStyles {
  wrapper: { [property: string]: string | number };
  tooltip: { [property: string]: string | number };
  content: { [property: string]: string | number };
  arrow: { [property: string]: string | number };
  gap: { [property: string]: string | number };
}
export class Tooltip extends Component<
  { content: ComponentChildren; styles?: TooltipStyles },
  {}
> {}
