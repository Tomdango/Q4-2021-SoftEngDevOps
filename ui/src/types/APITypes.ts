export module APITypes {
  export interface User {
    id: number;
    name: string;
    username: string;
    password?: any;
    role: string;
  }

  export interface Room {
    id: number;
    name: string;
    description: string;
    capacity: number;
    location: string;
  }

  export interface RootObject {
    id: number;
    note: string;
    room_id: number;
    user_id: number;
    time_from: number;
    time_to: number;
    user: User;
    room: Room;
  }
}
