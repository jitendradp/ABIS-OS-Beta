import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Profile} from "../../../generated/abis-api";
import {UserService} from "../../services/user.service";
import {Logger, LoggerService} from "../../services/logger.service";

@Component({
  selector: 'app-switch-profile',
  templateUrl: './switch-profile.component.html',
  styleUrls: ['./switch-profile.component.css']
})
export class SwitchProfileComponent implements OnInit, AfterViewInit {
  public profiles:Profile[] = [];

  private readonly _log:Logger = this.loggerService.createLogger("SwitchProfileComponent");

  constructor(private userService:UserService
              , private loggerService:LoggerService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.profiles = [];
  }
}
