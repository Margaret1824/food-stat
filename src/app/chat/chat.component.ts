import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


interface Item{
	suggested_places:any;
	date_started: string;
	chosen_place: string;
	date_delivered: string;
	participants: any;
}

@Component({
   selector: 'app-root',
  template: `
  <h1>Статистика для чата: {{ this.chatName }}</h1>
  <h2>Любимое место: {{ this.lovelyPlace }} </h2>
  <h2>Любимое блюдо: {{ this.lovelyFood }} </h2>
  <table >
  <colgroup>
    <col span="2" style="background:Khaki"><!-- С помощью этой конструкции задаем цвет фона для первых двух столбцов таблицы-->
    <col span="2" style="background-color:LightCyan"><!-- Задаем цвет фона для следующего (одного) столбца таблицы-->
  </colgroup>
        <thead>
            <tr>
                <th>Место</th>
                <th>Сумма, руб</th>
                <th>Оформлен</th>
                <th>Доставлен</th>
                <th>Состав заказа</th>
            </tr>
        </thead>
        <tbody>
            <tr *ngFor="let item of items | async">
                <td style="padding: 10px">
                Выбран<br> <b>{{item.chosen_place}}</b> из 
                <span *ngFor="let place of item.suggested_places  ">{{place}};<br></span>
                </td>
                <td style="padding: 10px">{{item.sum / 100}}</td>
                <td style="padding: 10px">{{item.date_started}}</td>
                <td style="padding: 10px">{{item.date_delivered}}</td>
                <td style="padding: 10px">
					    <span *ngFor="let person of toArray(item.participants) ">
					      <b>{{ person.fullname }}:</b> 
					      <span *ngFor="let dish of person.dishes  ">
					      	{{dish}}; 
					      </span><br>
					    </span>
                </td>

            </tr>
        </tbody>
    </table>

  `
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

  constructor(private afs: AngularFirestore) {
    this.chatName = 'Food_order';
    this.itemsCollection = afs.collection<Item>('stats', ref => ref.where('chat_name','==', this.chatName));
    this.items = this.itemsCollection.valueChanges();
    this.items.subscribe(data => { 
      this.lovelyPlace = this.most(Object.values(data).map(x => x.chosen_place)); 
      this.lovelyFood = this.most(Object.values(data).map(x => x.participants).flat().map(x => x.dishes).flat())
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
}
