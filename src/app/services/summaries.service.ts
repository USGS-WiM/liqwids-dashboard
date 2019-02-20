import { Injectable } from '@angular/core';
import { Isummary } from '../interfaces/summary.interface';
import { Iorg } from '../interfaces/org.interface';
import { Ioutput } from '../interfaces/output.interface';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, URLSearchParams, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class SummariesService {
  public csvOrgFile;
  public jsonOrgFile;
  public orgList: Iorg[];

  public csvSumFile;
  public jsonSumFile;
  public sumList: Isummary[];

  public sum_output: Ioutput[];
  public submit_dates;
  public samples_nums;

  public summary_data;
  public jsonFile;

  constructor(private _http: Http) { }

  private _summaryDataSubject: Subject<Array<Ioutput>> = new Subject<Array<Ioutput>>();

  public get SummaryData(): Observable<Array<Ioutput>> {
    return this._summaryDataSubject.asObservable();
  }

  // read summary json, use while we have the json preloaded
  public readSumFile() {
    this.sum_output = [];
    this._http.get('./assets/org_summary.json')
      .subscribe(data => {
        this.jsonFile = data;
        this.jsonFile = JSON.parse(this.jsonFile._body);
        for (let i = 0; i < this.jsonFile.length; i++) {
          this.sum_output.push(this.jsonFile[i]);
        }
        this._summaryDataSubject.next(this.sum_output);
      });
  }

  // get list of organizations
  public getOrgData() {
    const orgUrl = 'https://www.waterqualitydata.us/data/Organization/search?mimeType=csv&zip=no&countrycode=US' +
     '&countycode=US%3A36%3A059&countycode=US%3A36%3A103&statecode=US%3A36';
    this._http.get(orgUrl)
      .subscribe(data => {
        this.csvOrgFile = data;
        this.jsonOrgFile = this.csvJSON(this.csvOrgFile._body);
        this.orgList = JSON.parse(this.jsonOrgFile);
        this.sum_output = [];
        this.getSummaryData(0);
      });
  }

  // get summary data for each org
  public getSummaryData(i) {
    const sumUrl = 'https://www.waterqualitydata.us/data/summary/monitoringlocation/search?mimeType=csv&zip=no' +
        '&countycode=US%3A36%3A059&countycode=US%3A36%3A103&organization=' + this.orgList[i].OrganizationIdentifier +
        '&statecode=US%3A36&summaryYears=5&dataProfile=periodOfRecord';
    this._http.get(sumUrl)
      .subscribe(data => {
        this.csvSumFile = data;
        this.sumList = JSON.parse(this.csvJSON(this.csvSumFile._body));
        if (this.sumList.length > 1) {
          const sortedData = this.sumList.sort(function(a, b) {
            return (new Date(b.LastResultSubmittedDate) > new Date(a.LastResultSubmittedDate)) ? 1 : -1;
          });
          const last_submit_date = sortedData[1].LastResultSubmittedDate;
          const num_samples = this.sumList.filter(function(o) { return o.LastResultSubmittedDate === last_submit_date; }).length;
          this.sum_output.push({org_name: this.orgList[i].OrganizationFormalName, last_submit: last_submit_date,
            num_samples: num_samples});
        } else if (this.sumList.length === 1) {
          this.sum_output.push({org_name: this.orgList[0].OrganizationFormalName, last_submit: this.sumList[0].LastResultSubmittedDate,
            num_samples: 1});
        }
        if (i < this.orgList.length - 1) { this.getSummaryData( i += 1)};
        console.log(this.sum_output);
        this._summaryDataSubject.next(this.sum_output);
      });
  }

  public csvJSON(csv) {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(',');
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return JSON.stringify(result);
  }
}
