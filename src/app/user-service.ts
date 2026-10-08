import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import User from './users/User';

@Service()
export class UserService {
    private apiUrl:string="http://localhost:5000/users";
    private http = inject(HttpClient);

    public addUser(userData:User){
         return this.http.post<User>(this.apiUrl,userData);
    }
    public loginUser(email:string,pass1:string){
        return this.http.get<User[]>(`${this.apiUrl}?email=${email}&pass1=${pass1}`);

    }
}
