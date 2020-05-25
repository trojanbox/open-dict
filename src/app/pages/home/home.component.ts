import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Reader} from "../../module/reader";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {
  }

  async ngOnInit(): Promise<void> {

  }

  async onRun() {
    console.log('start')
    const reader = new Reader({mode: 'r'});
    await reader.open('D:\\test\\dict-source.txt');
    await reader.getItemList(async list => {
      // console.log(list)
    });
    console.log('done')
    await reader.close();
  }

}
