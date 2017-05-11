import React from 'react';
import HamburgerDropdown, { styles as dropdownStyles } from '../_common/components/hamburgerDropdown';

export const actionTypes = {
  PRINT: 'PRINT',
  PNG: 'PNG',
  JPEG: 'JPEG',
  PDF: 'PDF',
  SVG: 'SVG',
  CSV: 'CSV'
};

/*
 * This function triggers an method, depending on the given actionType.
 */
export function downloadFile (chartRef, actionType = actionTypes.PNG) {
  const chart = chartRef.getChart();
  actionType === actionTypes.PRINT && chart.print();
  actionType === actionTypes.PNG && chart.exportChart();
  actionType === actionTypes.JPEG && chart.exportChart({ type: 'image/jpeg' });
  actionType === actionTypes.PDF && chart.exportChart({ type: 'application/pdf' });
  actionType === actionTypes.SVG && chart.exportChart({ type: 'image/svg+xml' });
  actionType === actionTypes.CSV && chart.downloadCSV();
}

export function renderHamburgerDropdown (highchartRef) {
  return (
    <HamburgerDropdown style={{ marginLeft: 'auto' }}>
      <div key='print' style={dropdownStyles.floatOption} onClick={() => downloadFile(highchartRef, actionTypes.PRINT)}>Print</div>
      <div key='png' style={dropdownStyles.floatOption} onClick={() => downloadFile(highchartRef, actionTypes.PNG)}>Download PNG</div>
      <div key='jpeg' style={dropdownStyles.floatOption} onClick={() => downloadFile(highchartRef, actionTypes.JPEG)}>Download JPEG</div>
      <div key='pdf' style={dropdownStyles.floatOption} onClick={() => downloadFile(highchartRef, actionTypes.PDF)}>Download PDF</div>
      <div key='svg' style={dropdownStyles.floatOption} onClick={() => downloadFile(highchartRef, actionTypes.SVG)}>Download SVG</div>
      <div key='csv' style={dropdownStyles.floatOption} onClick={() => downloadFile(highchartRef, actionTypes.CSV)}>Download CSV</div>
    </HamburgerDropdown>
  );
}
