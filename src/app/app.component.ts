import { Component, ViewChild, OnInit } from '@angular/core';
import { SummariesService } from '../app/services/summaries.service';
import { MatTableDataSource, MatSort, MatTab } from '@angular/material';
import { Isummary } from './interfaces/summary.interface';
import { Ioutput } from './interfaces/output.interface';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns = ['org_name', 'last_submit', 'num_samples'];
  // public dataSource = new MatTableDataSource;
  public dataSource: MatTableDataSource<Ioutput>;
  public summaries_count: number;

  constructor(private _summariesService: SummariesService) { }

  ngOnInit() {
    this._summariesService.readSumFile();

    this._summariesService.SummaryData.subscribe((sum_data) => {
      this.dataSource = new MatTableDataSource(sum_data);
      if (this._summariesService.summary_data) { this.summaries_count = this._summariesService.summary_data.length; }
      this.dataSource.sort = this.sort;
    });
    // this._summariesService.getOrgData(); // remove comment here to use http requests
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.summaries_count = this.dataSource.filteredData.length;
  }
}
