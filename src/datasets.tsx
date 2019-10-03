import * as React from 'react';
import { Widget } from '@phosphor/widgets';
import { ReactWidget } from '@jupyterlab/apputils';

// type Props = {
//   label: string;
//   count: number;
//   onIncrement: () => void;
// };

const DatasetList: React.FC/*<>*/ = () => {
  return (<div>My widget</div>);
}

const PhosphorDatasetList: Widget = ReactWidget.create(<DatasetList />);

export default PhosphorDatasetList
