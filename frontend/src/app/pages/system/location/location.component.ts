import {Component, Input} from '@angular/core';


export interface Country {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent {

  @Input()
  description: string = "Add a location to your workspace or channel so people can find and enter it on a map.";


  countries: Country[] = [
    {value: 'de', viewValue: 'Germany'},
    {value: 'us', viewValue: 'United States'},
    {value: 'gb', viewValue: 'Great Britain'}
  ];

}
