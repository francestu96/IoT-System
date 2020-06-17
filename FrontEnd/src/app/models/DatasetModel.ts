export class DatasetModel {
  scannerId: string;
  colorIndex: number;
  datasetChart: {
    data: number[];
    fill: boolean;
    label: string;
  }
}
