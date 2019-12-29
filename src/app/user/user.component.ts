import { Component} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

export interface UserData {
  order: number;
  place: string;
  cost: number;
  created: string;
  delivered: string;
  items: any;
}

@Component({
  selector: 'table-basic-example',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent {
  userName: string;
  lovelyFood: any;
  lovelyPlace: any;
  
  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;

  userItems: UserData[] = []; 
  displayedColumns: string[] = ['order', 'place', 'cost', 'created', 'delivered', 'items'];

  ngOnInit() {
    this.items.subscribe(data => { 
      this.lovelyFood = this.most(
        data.map(x => x.participants).flat()
        .filter(x => x.fullname == this.userName).flat()
        .map(x => x.dishes).flat()
      );
        
      this.items = data.filter(element => {
        return element.participants.map(x => x.fullname).includes(this.userName)
      });

      this.lovelyPlace = this.most(this.items.map(x => x.chosen_place));

      let orders = [];
      this.items.forEach(el => {
        orders.push({ 
          order: this.items.indexOf(el), 
          place: el.chosen_place, 
          cost: el.sum/100, 
          created: el.date_started,
          delivered: el.date_delivered,
          items: el.participants.filter(x => x.fullname == this.userName).map(x => x.dishes).flat().join(", ") 
        });
      });
      this.userItems = orders;
    });
  }

  constructor(private afs: AngularFirestore) {
    this.userName = 'Александр Попов';
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
}
