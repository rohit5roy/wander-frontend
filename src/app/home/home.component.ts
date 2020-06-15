import {Component, OnInit} from '@angular/core';
import {GlobalConstants} from '../utils/global-constants';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../utils/auth-service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label} from 'ng2-charts';
import {formatDate} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';

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
  total: any;
  active: any;
  cured: any;
  dataSource: any;
  displayedColumns: string[];

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  ngOnInit() {
    interface DailyData {
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

    interface CountrySummary {
      'active': number;
      'cured': number;
      'death': number;
      'total': number;
    }

    interface StateSummary {
      '_id': string;
      'active': number;
      'cured': number;
      'death': number;
      'total': number;
      'name': string;
    }

    interface StateParent {
      'state': StateSummary[];
    }

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
        this.lineChartData[0].label = 'COVID-19 Cases';
        this.lineChartLabels = labels;
        this.isDataAvailable = true;
      },
      (error) => {
        console.log(error);
        if (error.error.message.includes('JWT expired')) {
          this.authService.logout();
        }
      });
    this.http.get<CountrySummary>(GlobalConstants.apiURL + GlobalConstants.countrySummaryPath).subscribe(
      (response) => {
        console.log(response);
        this.total = response.total;
        this.active = response.active;
        this.cured = response.cured;
      },
      (error) => {
        console.log(error);
        if (error.error.message.includes('JWT expired')) {
          this.authService.logout();
        }
      });
    this.http.get<StateParent>(GlobalConstants.apiURL + GlobalConstants.stateSummaryPath).subscribe(
      (response) => {
        console.log('StateSummary' + response.state);
        this.displayedColumns = ['No', 'State', 'Active', 'Cured', 'Deaths', 'Total'];
        this.dataSource = new MatTableDataSource(response.state);
      },
      (error) => {
        console.log(error);
        if (error.error.message.includes('JWT expired')) {
          this.authService.logout();
        }
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
