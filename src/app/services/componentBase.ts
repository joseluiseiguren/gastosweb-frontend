import { Injectable, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Injectable()
export class ComponentBase implements OnDestroy {
    
    private mobileQuery: MediaQueryList;
  
    constructor(changeDetectorRef: ChangeDetectorRef, 
                media: MediaMatcher) { 
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);                    
    }

    private _mobileQueryListener: () => void;

    isMobile (): boolean{
        return this.mobileQuery.matches;
    }

    ngOnDestroy(): void {
        console.log("dsestroy");
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    
}
