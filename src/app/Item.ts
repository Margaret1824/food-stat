export class Participant {
    user_id: number;
    user_name: string;
    fullname: string;
    dishes: string[];
}
 
export class Item {
    chat_id: number;
    chat_name: string;
    chosen_place: string;
    date_delivered: Date;
    date_finished: Date;
    date_started: Date;
    suggested_places: string[];
    sum: number;
    participants: Participant[];
}

export interface TableData {
    order: number;
    place: string;
    cost: number;
    created: string;
    delivered: string;
    items: any;
  }
