import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class ChatApi {
    private http = inject(HttpClient);

    addPost(data:any){
        return this.http.post("http://localhost:5000/posts",data);
    }
    getAllPosts(){
       return this.http.get("http://localhost:5000/posts");
    }
}
