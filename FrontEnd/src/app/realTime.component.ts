import { Component, Input, } from '@angular/core';
import { DataModel } from './models/DataModel';
import { DatasetModel } from './models/DatasetModel';
import * as moment from 'moment';

@Component({
  selector: 'app-real-time',
  templateUrl: './realTime.component.html',
  styleUrls: ['./app.component.scss']
})
export class RealTimeComponent {
  @Input()
  private peopleLimit: number;
  @Input()
  private datasetSize: number;
  chartType = 'line';

  private colorIndex = 0;
  private dataset: DatasetModel[] = [];
  public chartDatasets: any[] = [];
  public chartLabels: string[] = [];

  public chartColors: Array<any> = [
    {
      borderColor: 'aquamarine',
      originalColor: 'aquamarine',
      borderWidth: 2,
    },
    {
      borderColor: 'bisque',
      originalColor: 'bisque',
      borderWidth: 2,
    },
    {
      borderColor: 'cadetblue',
      originalColor: 'cadetblue',
      borderWidth: 2,
    },
    {
      borderColor: 'darkslateblue',
      originalColor: 'darkslateblue',
      borderWidth: 2,
    },
    {
      borderColor: 'darkgoldenrod',
      originalColor: 'darkgoldenrod',
      borderWidth: 2,
    },
    {
      borderColor: 'coral',
      originalColor: 'coral',
      borderWidth: 2,
    }
  ];

  public chartOptions: any = {
    title: {
        display: true,
        text: 'Real time data'
    },
    responsive: true
  };

  @Input()
  set setLastData(clientsData: DataModel[]){
    if(clientsData){
      if(this.chartLabels.length > this.datasetSize){
        this.chartLabels.shift();
      }
      this.chartLabels.push(moment().format('HH:mm:ss'));

      if(clientsData.length === 0){
        for(var chartDataset of  this.chartDatasets){
          if(chartDataset.data.length > this.datasetSize){
            chartDataset.data.shift();
          }
          if(chartDataset.data.length > 0){
            chartDataset.data.push(chartDataset.data[chartDataset.data.length - 1])
          }
        }
      }

      for(var clientData of clientsData){
        const exists = this.dataset.find(x => x.scannerId === clientData.clientId);
        if (exists) {
          if(exists.datasetChart.data.length > this.datasetSize) {
            exists.datasetChart.data.shift();
          }
          this.checkPeopleExceed(clientData, exists.colorIndex);
          exists.datasetChart.data.push(clientData.people);
        }
        else {
          var people = [];
          for(var i = 0; i < this.chartLabels.length - 1; i++){
            people.push(0);
          }
          people.push(clientData.people);
          this.dataset.push({ scannerId: clientData.clientId, colorIndex: this.colorIndex++, datasetChart: { data: people, label: clientData.topicDesc, fill: false } });
        }
      }

      this.chartDatasets = this.dataset.map(x => x.datasetChart);
    }
  };

  checkPeopleExceed(data: DataModel, chartColorsIndex: number){
    if(data.people >= this.peopleLimit){
      this.chartColors[chartColorsIndex].borderColor = 'red';
    }
    else{
      this.chartColors[chartColorsIndex].borderColor = this.chartColors[chartColorsIndex].originalColor;
    }
  }
}
