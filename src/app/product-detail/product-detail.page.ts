import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

import { OpenFoodService } from '../openfood-api/openfood.service';
import { Product, ProductResponse } from '../openfood-api/model/models';

import { Plugins } from '@capacitor/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  public eanCode: string;
  public product: Product;

  constructor(private openFoodService: OpenFoodService, private route: ActivatedRoute, private location: Location, private nativeStorage: NativeStorage) { }

  ngOnInit() {
    this.eanCode =  this.route.snapshot.paramMap.get('eanCode');
    const data = this.openFoodService.listProducts([], [this.eanCode]);
    const { Toast } = Plugins;

    data.subscribe((response: ProductResponse) => {

        if(response.data.length > 0) {
          this.product = response.data[0] as Product;
          if(this.product.images.length > 0) {
            this.nativeStorage.setItem(this.eanCode, {"name": this.product.display_name_translations.de, "barcode": this.product.barcode, "image": this.product.images[0]})
            .then(
              () => console.log('Stored item!'),
              error => console.error('Error storing item', error)
             );
          } else {
            this.nativeStorage.setItem(this.eanCode, {"name": this.product.display_name_translations.de, "barcode": this.product.barcode, "image": ""})
            .then(
                          () => console.log('Stored item (without image)!'),
                          error => console.error('Error storing item', error)
                         );
          }
        } else {
          Toast.show({text: `Product with barcode {{this.eanCode}} unknown`});
          this.location.back();
         }

      }, (error: Error) => {
        console.error(error);
      }
    );

  }
}
