import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

import MyPost from './MyPost';

@Service()
export class PostService {
    private http = inject(HttpClient);
    private apiUrl:string="http://localhost:5000/posts";
    getAllPosts(){
          return this.http.get<MyPost[]>(this.apiUrl);          
    }
    addPost<MyPost>(data:MyPost){
        
        return this.http.post<MyPost>(this.apiUrl,data);
    }
    getPost(id:any){
        return this.http.get<MyPost>(this.apiUrl+"/"+id);
    }
    updatePost(id:any,postData:MyPost){
        return this.http.put<MyPost>(this.apiUrl+"/"+id,postData);
    }
    deletePost(id:any){
        return this.http.delete<MyPost>(this.apiUrl+"/"+id);
    }
}
