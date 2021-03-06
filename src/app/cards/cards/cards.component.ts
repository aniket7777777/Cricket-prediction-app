/* tslint:disable:object-literal-key-quotes */
import {AfterViewChecked, Component, Input, OnChanges, OnInit} from '@angular/core';
import {MatchData} from 'src/app/model/match-data';
import {PredictionData} from '../../model/prediction-data';
import {MatchesService} from '../matches.service';
import {MessageService, SelectItem, SelectItemGroup} from 'primeng/api';
import {Router} from '@angular/router';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {AllPlayers} from '../../model/all-players';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit, AfterViewChecked, OnChanges {

  @Input()
  singleMatchData: MatchData;

  @Input()
  allPlayers: AllPlayers[] = [];

  @Input()
  disabled: boolean;

  @Input()
  glow: boolean;

  predictionResult: PredictionData;

  homeTeamFlag: string;


  results: any[];

  awayTeamFlag: string;
  playing22: SelectItemGroup[] = [];

  humanReadableDate: string;
  display: boolean;
  mom: any;
  teams: SelectItem[];
  humanReadableTime: string;
  private date: Date;
  private clock: any = null;
  alert = false;

  constructor(private matchService: MatchesService, private router: Router, private messageService: MessageService,
              private ng4LoadingSpinnerService: Ng4LoadingSpinnerService) {

    this.predictionResult = {} as PredictionData;

    this.results = [
      {name: 'YES', code: 'YES'},
      {name: 'NO', code: 'NO'}
    ];
  }

  ngOnInit() {
    this.homeTeamFlag = '/assets/' + this.singleMatchData.homeTeam.name + '.png';
    this.awayTeamFlag = '/assets/' + this.singleMatchData.awayTeam.name + '.png';

    /*this.playing22.forEach(value => {
        value.items.splice(0, 0, {
          label: 'Select', value: null,
        });
      });*/

    this.teams = [
      {
        label: this.singleMatchData.homeTeam.name, value: 'W',
      },
      {
        label: this.singleMatchData.awayTeam.name, value: 'L',
      }
    ];

    this.date = new Date(this.singleMatchData.dateTime);
    this.humanReadableDate = this.date.toLocaleDateString();
    this.humanReadableTime = this.date.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});
    this.alert = (this.humanReadableDate === (new Date()).toLocaleDateString() && !this.disabled) ? true : false;
  }

  ngOnChanges() {
    this.homeTeamFlag = '/assets/' + this.singleMatchData.homeTeam.name + '.png';
    this.awayTeamFlag = '/assets/' + this.singleMatchData.awayTeam.name + '.png';
    if (!this.disabled) {
      this.allPlayers.filter(value =>
        (value.team === this.singleMatchData.homeTeam.name) || (value.team === this.singleMatchData.awayTeam.name)
      ).forEach(value1 => {
        const players = Object.assign([], value1.players);
        players.forEach((player, index) => {
          const name = player;
          player = {};
          player.label = name;
          player.value = name;
          players[index] = player;
        });

        const play = {
          label : (value1.team === this.singleMatchData.homeTeam.name) ?
            this.singleMatchData.homeTeam.name : this.singleMatchData.awayTeam.name,
          value : (value1.team === this.singleMatchData.homeTeam.name) ? this.homeTeamFlag : this.awayTeamFlag,
          items : players
        };
        this.playing22.push(play);
      });
    }
  }

  ngAfterViewChecked() {
    if (this.clock == null) {
      this.clock = document.getElementById(this.singleMatchData.matchId.toString());
      if (this.humanReadableDate === (new Date()).toLocaleDateString() && !this.disabled) {
        this.alert = true;
        const endtime = this.date.getTime() - 3600 * 1000;
        this.initializeClock(endtime);
      } else {
        this.alert = false;
        this.clock.innerHTML = 'Starts at : ' + this.humanReadableTime;
      }
    }

  }

  predict() {
    this.display = true;
  }

  private initializeClock(endtime) {
    const self = this;
    const timeinterval = setInterval(() => {
      const t = self.getTimeRemaining(endtime);
      if (t.total > 0 && !this.disabled) {
        self.clock.innerHTML = /*'days: ' + t.days + '<br>' +*/
          'Prediction locks in <b>' + t.hours + ' h : ' +
          t.minutes + ' m : ' +
          t.seconds + ' s</b>';
      } else {
        self.clock.innerHTML = 'Prediction locked';
        this.disabled = true;
        const icon = document.getElementById('icon');
        icon.setAttribute('class', 'pi pi-lock');
        clearInterval(timeinterval);
      }
    }, 1000);
  }


  getTimeRemaining(endtime) {
    const t = endtime - Date.parse((new Date()).toString());
    const seconds = Math.floor((t / 1000) % 60);
    const minutes = Math.floor((t / 1000 / 60) % 60);
    const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    const days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
      'total': t,
      // 'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }

  saveResult() {
    this.ng4LoadingSpinnerService.show();
    this.display = false;
    console.log(this.predictionResult);
    this.predictionResult.matchId = this.singleMatchData.matchId;
    this.predictionResult.userId = JSON.parse(document.cookie).userId;
    this.predictionResult.tossResult = this.predictionResult.tossResult.value;
    this.predictionResult.momResult = this.predictionResult.momResult;

    this.matchService.savePredictionData(this.predictionResult).subscribe(
      (response: any) => {
        this.ng4LoadingSpinnerService.hide();
        this.messageService.add({
          severity: 'success',
          summary: 'Prediction added successfully',
          detail: 'Success'
        });
        // not working
        // this.router.navigateByUrl('/home');
        location.reload();
      }, error1 => {
        this.ng4LoadingSpinnerService.hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Something Went Wrong'
        });
      }
    );
  }
}

