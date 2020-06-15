import {Component, OnInit} from '@angular/core';
import {GlobalConstants} from '../utils/global-constants';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../utils/auth-service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label} from 'ng2-charts';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public isDataAvailable = false;
  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  // @ts-ignore
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(205,107,255,0.5)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    interface DailyData{
      'Country': string;
      'CountryCode': string;
      'Province': string;
      'City': string;
      'CityCode': string;
      'Lat': string;
      'Lon': string;
      'Cases': bigint;
      'Status': string;
      'Date': Date;
    }
    const chartData = [];
    this.http.get<DailyData[]>(GlobalConstants.apiURL + GlobalConstants.countryDataDateWisePath +
      '?from=2020-03-01&to=' + new Date().toISOString().slice(0, 10)).subscribe(
      (response) => {
        console.log(response);
        const labels: string[] = [];
        const data: number[] = [];
        response.forEach(value => {
          data.push(Number(value.Cases));
          labels.push(formatDate(new Date(value.Date), 'dd-MM-yyyy', 'en'));
        });
        this.lineChartData[0] = {};
        this.lineChartData[0].data = data;
        this.lineChartData[0].label = 'Cases';
        this.lineChartLabels = labels;
        this.isDataAvailable = true;
      },
      (error) => {
        console.log(error);
        if (error.error.message.includes('JWT expired')){
          this.authService.logout();
        }
      });
  }
}
