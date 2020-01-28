import { Component} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Item, TableData } from '../Item';

@Component({
  selector: 'table-basic-example',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent {
  userName: string;
  lovelyFood: string[];
  lovelyPlace: string[];
  userId: number; /*  */
  
  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  filtered: Item[];

  userItems: TableData[] = []; 
  displayedColumns: string[] = ['order', 'place', 'cost', 'created', 'delivered', 'items'];

  ngOnInit() {
    this.items.subscribe((data:Item[]) => {   
      this.filtered = data.filter(element => {
        return element.participants.map(x => x.user_id).includes(this.userId)
      });

      this.lovelyFood = this.most(
        this.flatten(this.filtered.map(x => x.participants.filter(x => x.user_id == this.userId)))
            .map(x => x.dishes).flat()
      ).join(", ");

      console.log(this.items);

      this.lovelyPlace = this.most(this.filtered.map(x => x.chosen_place)).join(", ");
      this.userName = this.filtered[0].participants[0].fullname;

      let orders = [];
      this.filtered.forEach(el => {
        orders.push({ 
          order: data.indexOf(el), 
          place: el.chosen_place, 
          cost: el.sum/100, 
          created: el.date_started,
          delivered: el.date_delivered,
          items: el.participants.filter(x => x.user_id == this.userId).map(x => x.dishes).join(", ") 
        });
      });
      
      this.userItems = orders;
    });
  }

  constructor(private afs: AngularFirestore, private route: ActivatedRoute) {
    this.userId = parseInt(route.snapshot.params['id']);
    this.itemsCollection = afs.collection<Item>('stats');
    this.items = this.itemsCollection.valueChanges();
  }
  
  most(array){
    var L = array.length, freq = [], unique = [], 
    tem, max = 1, index, count;
    while(L >= max){
        tem = array[--L];
        if(unique.indexOf(tem)== -1){
            unique.push(tem);
            index= -1, count= 0;
            while((index = array.indexOf(tem, index+1))!= -1){
                ++count;
            }
            if(count> max){
                freq= [tem];
                max= count;
            }
            else if(count== max) {
                        freq.push(tem);
              }
        }
    }
    return freq;
  }

  flatten (array) {
    if (Array.isArray(array)) {
        return Array.prototype.concat(...array.map(this.flatten, this));
    }
    return array;
  }
}
