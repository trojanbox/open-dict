import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { promisify } from "util";
var exec = require("child_process").exec;
import * as electron from 'electron';
import { join } from 'path';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  async ngOnInit(): Promise<void> {}

  async onRun() {

    // let result = await promisify(exec)('ls');

    let execPath = join(__dirname, '..', '..', 'extraResources', 'phantomjs-2.1.1-windows', 'bin', 'phantomjs');
    let scriptPath = join(__dirname, '..', '..', 'extraResources', 'phantomjs-2.1.1-windows', 'request.js');
    console.log(`"${execPath}" "${scriptPath}" "https://tbank.cmbc.com.cn:50002/tradeBank//trans/clientInfoPortal.html?context=MIIDKAYKKoEcz1UGAQQCA6CCAxgwggMUAgECMYGdMIGaAgECgBSPZFCzuo3lsSjGwr/H2kErADJaljANBgkqgRzPVQGCLQMFAARwZQfbDhbTtoicm1e+iyw+qd9vbGJoQ21bKyyuJEdR63mluIpdcrKbOvga0a0KH7E3rAZu1wqro+HZh0B4fEkcP/iYHPJiSOCMgK0cw1hUEz60/bUveAwbYOf/1o57NtOvfVDOxzJ56QYgSLQgmjScODCCAm0GCiqBHM9VBgEEAgEwGwYHKoEcz1UBaAQQGMqc/HNj7O55wyUtj6rLNICCAkB3FmGUifz54n/35C2Wupt/zLiGArQDOkJWUv6bmClbnPHRGzTAfps9OFFRsnfZWiR9kQ3KlWOtKRDfVM6jn1GCZLe8B3gw8sjNs/IozXoS3MXdf8gWIaFU0LlO2IDVkrpJyT1LwJPGt3qTiB49jOBP+GaMdapZA1S8cM0Iel7gnnE1OsQmsgeo4ujckdfw+nTVCvVZdNuP4uKhRqKANSSAeMhraIndDEt9ouKvaxyc4FoUlV+2/t63ZDLVcIlv+YQe7HdUBszTgrvsGdfqMX7dZsMI6ofew8mzYiGHY3QcY8PkXhyj4VAohQvdZyBa3G+bCkIS+m/Q180a1zQp73Bw8VQmachzwlC45kS7JVm4BvIRge3uCGmEcuZQZSQesvOYAtfLUo8c7uUmNXSCG39M26hN14JboRX3W0HQhp49hzwwj/x0ATTZ8dgh6o1TMNIq0Va1u7iXwS1s33+eJ0sUZume/YaWS+fLkCQWzfGh+H/QxRMjxNz9hVarF+8JbexNTEOCKf510cLtsjJbRFt4fBJwQ1lE09mjpLXHFiQtaYMHZZCeGJf+CK58CWSAUbWyRERfmDmIfYS+9S3pmZO8DxCB0gSczF70VSfqFTiEuLaKde3mBchT2VICz7TMqSVLiCBLkEv0RlsgwwvR/rs4abHXcFKY7DL+bObgzMYmEpQvyiEqBs3x6rS49GuQKWTegcmljoeAQ2+LvMVJgVqhB4f9/19xoUUvjTnsiA9qQjvZIYWVHcvYlPcmh7Hj2/M=#"`);

    exec(`"${execPath}" "${scriptPath}" "https://tbank.cmbc.com.cn:50002/tradeBank//trans/clientInfoPortal.html?context=MIIDKAYKKoEcz1UGAQQCA6CCAxgwggMUAgECMYGdMIGaAgECgBSPZFCzuo3lsSjGwr/H2kErADJaljANBgkqgRzPVQGCLQMFAARwZQfbDhbTtoicm1e+iyw+qd9vbGJoQ21bKyyuJEdR63mluIpdcrKbOvga0a0KH7E3rAZu1wqro+HZh0B4fEkcP/iYHPJiSOCMgK0cw1hUEz60/bUveAwbYOf/1o57NtOvfVDOxzJ56QYgSLQgmjScODCCAm0GCiqBHM9VBgEEAgEwGwYHKoEcz1UBaAQQGMqc/HNj7O55wyUtj6rLNICCAkB3FmGUifz54n/35C2Wupt/zLiGArQDOkJWUv6bmClbnPHRGzTAfps9OFFRsnfZWiR9kQ3KlWOtKRDfVM6jn1GCZLe8B3gw8sjNs/IozXoS3MXdf8gWIaFU0LlO2IDVkrpJyT1LwJPGt3qTiB49jOBP+GaMdapZA1S8cM0Iel7gnnE1OsQmsgeo4ujckdfw+nTVCvVZdNuP4uKhRqKANSSAeMhraIndDEt9ouKvaxyc4FoUlV+2/t63ZDLVcIlv+YQe7HdUBszTgrvsGdfqMX7dZsMI6ofew8mzYiGHY3QcY8PkXhyj4VAohQvdZyBa3G+bCkIS+m/Q180a1zQp73Bw8VQmachzwlC45kS7JVm4BvIRge3uCGmEcuZQZSQesvOYAtfLUo8c7uUmNXSCG39M26hN14JboRX3W0HQhp49hzwwj/x0ATTZ8dgh6o1TMNIq0Va1u7iXwS1s33+eJ0sUZume/YaWS+fLkCQWzfGh+H/QxRMjxNz9hVarF+8JbexNTEOCKf510cLtsjJbRFt4fBJwQ1lE09mjpLXHFiQtaYMHZZCeGJf+CK58CWSAUbWyRERfmDmIfYS+9S3pmZO8DxCB0gSczF70VSfqFTiEuLaKde3mBchT2VICz7TMqSVLiCBLkEv0RlsgwwvR/rs4abHXcFKY7DL+bObgzMYmEpQvyiEqBs3x6rS49GuQKWTegcmljoeAQ2+LvMVJgVqhB4f9/19xoUUvjTnsiA9qQjvZIYWVHcvYlPcmh7Hj2/M=#"`,
      function (error, stdout, stderr) {
        console.log("error: " + error);
        console.log("stdout: " + stdout);
        console.log("stderr: " + stderr);
        // if (error !== null) {
        //   console.log('exec error: ' + error);
        // }
      }
    );
  }
}
