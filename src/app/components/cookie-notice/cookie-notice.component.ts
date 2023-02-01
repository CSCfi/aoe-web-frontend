import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { CookieService } from '@services/cookie.service';

@Component({
    selector: 'app-cookie-notice',
    templateUrl: './cookie-notice.component.html',
})
export class CookieNoticeComponent implements OnInit {
    cookies: FormGroup;
    @Output() hideCookieNotice = new EventEmitter();
    lang: string = this.translate.currentLang;

    constructor(private fb: FormBuilder, private cookieSvc: CookieService, private translate: TranslateService) {}

    ngOnInit(): void {
        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            this.lang = event.lang;
        });
    }

    onSubmit(): void {
        // set cookie settings
        // this.cookieSvc.setCookieSettings(this.cookies.value);
        this.cookieSvc.acceptCookiePolicy();

        // hide cookie notice
        this.hideCookieNotice.emit();
    }
}
