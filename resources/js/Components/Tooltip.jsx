/**
 * Tooltip Component
 * 
 * @description Displays a tooltip to the user to add further context or explanations to a control.
 */
import React from "react";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export default function Tooltip({ text, children, delay=500, variant='dark' }) {
  return (
    <div>
      <div 
        data-tooltip-id="flow-tooltip"
        data-tooltip-content={text}
        data-tooltip-delay-hide={1000}
        data-tooltip-delay-show={delay}
        data-tooltip-variant={variant}>
          {children}
      </div>
      <ReactTooltip id='flow-tooltip' content={text} />
    </div>
  );
}
