
// src/components/TableBlock.tsx
import React, { useState } from 'react';
import './TableBlock.css';

interface TableData {
  rows: number;
  cols: number;
  cells: string[][];
}

interface Props {
  blockProps: {
    onUpdate: (data: TableData) => void;
    onRemove: () => void;
    data: TableData;
  };
}

const TableBlock: React.FC<Props> = ({ blockProps }) => {
  const { data, onUpdate, onRemove } = blockProps;
  const [tableData, setTableData] = useState<TableData>(data);

  const handleCellChange = (row: number, col: number, value: string) => {
    const newCells = [...tableData.cells];
    newCells[row][col] = value;
    const newData = { ...tableData, cells: newCells };
    setTableData(newData);
    onUpdate(newData);
  };

  const addRow = () => {
    const newRow = new Array(tableData.cols).fill('');
    const newCells = [...tableData.cells, newRow];
    const newData = { 
      ...tableData, 
      rows: tableData.rows + 1, 
      cells: newCells 
    };
    setTableData(newData);
    onUpdate(newData);
  };

  const addColumn = () => {
    const newCells = tableData.cells.map(row => [...row, '']);
    const newData = { 
      ...tableData, 
      cols: tableData.cols + 1, 
      cells: newCells 
    };
    setTableData(newData);
    onUpdate(newData);
  };

  return (
    <div className="table-block">
      <div className="table-controls">
        <button onClick={addRow}>Add Row</button>
        <button onClick={addColumn}>Add Column</button>
        <button onClick={onRemove}>Remove Table</button>
      </div>
      <table>
        <tbody>
          {tableData.cells.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                    placeholder="..."
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableBlock;