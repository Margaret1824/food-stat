import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Item, TableData } from '../Item';

@Component({
  selector: 'table-basic-example',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent {
	toArray(participants: object) {
    return Object.keys(participants).map(key => ({
      key,
      ...participants[key]
    }))
  }

  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  lovelyPlace: any;
  lovelyFood: any;
  chatName: string;
  chatId: any; /* -367932167, -367932167 */

  chatItems: TableData[] = []; 
  displayedColumns: string[] = ['order', 'place', 'cost', 'created', 'delivered', 'items'];

  constructor(private afs: AngularFirestore, private route: ActivatedRoute) {
    this.chatId = parseInt(route.snapshot.params['id']);
    this.itemsCollection = afs.collection<Item>('stats', ref => ref.where('chat_id','==', this.chatId));
    this.items = this.itemsCollection.valueChanges();
    this.items.subscribe((data:Item[]) => { 
      console.log(data);
      this.chatName = data[0].chat_name;
      this.lovelyPlace = this.most(data.map(x => x.chosen_place)); 
      this.lovelyFood = this.most(this.flatten(data.map(x => x.participants)).map(x => x.dishes).flat());

      let orders = [];
      data.forEach(el => {
        let places = el.suggested_places.filter(x => x != el.chosen_place.toString());
        console.log(el.participants.map(x => `${ x.fullname }: ${x.dishes.join()}` + "</b>").join("\n"))
        orders.push({ 
          order: data.indexOf(el), 
          place: el.chosen_place.toString() + (
            places.length ? " (" +  places.join() + ")" : ""
          ), 
          cost: el.sum/100, 
          created: el.date_started,
          delivered: el.date_delivered,
          items: el.participants.map(x => `<b>${ x.fullname }</b>: ${x.dishes.join()}`).join("</br>") 
        });
      });
      console.log(orders)
      this.chatItems = orders;
    });
  }

  addItem(item: Item) {
    this.itemsCollection.add(item);
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
