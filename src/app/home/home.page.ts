import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Plugins, HapticsImpactStyle } from '@capacitor/core';
import { ProductSummary} from './productSummary';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public storageKeys: any;
  public previouslyViewedItems: Array<any>;

  constructor(private router: Router, private barcodeScanner: BarcodeScanner, private nativeStorage: NativeStorage) {}

  ionViewWillEnter() {
      this.previouslyViewedItems = [];
      this.nativeStorage.keys().then(
        data => this.storageKeys = data,
        error => console.error(error)
      );
      this.previouslyViewedItems = []
      for(var key of this.storageKeys) {
        this.nativeStorage.getItem(key).then(
          data => this.previouslyViewedItems.push(data),
          error => console.error(error)
        );
      }
    }

  scan() {
      const options = {
            prompt: 'Place a barcode inside the scan area', // Android only
            formats: 'EAN_8,EAN_13'
          };

      const { Haptics } = Plugins;


          this.barcodeScanner.scan(options)
            .then(result => {
              if (!result.cancelled) {
                Haptics.vibrate();

                if (result.format === 'EAN_8' || result.format === 'EAN_13') {
                  this.viewProduct(Number(result.text));
                }
              }
            })
            .catch(err => {

              console.log(err);

              if (err === 'cordova_not_available') {

                const barcodes: Array<number> = [
                  7613269300748,
                  7617400030716,
                  4104420034167,
                  7613269018421,
                  87157420
                ];
                const rndIdx = Math.floor(Math.random() * barcodes.length);
                this.viewProduct(barcodes[rndIdx]);
              }
            });


      }

      /**
        * Navigates to the product details page and passes a barcode
        * @param barcode The EAN barcode number of a product
        */
        viewProduct(barcode: number) {
          this.router.navigate(['/products', barcode]);
        }


}
