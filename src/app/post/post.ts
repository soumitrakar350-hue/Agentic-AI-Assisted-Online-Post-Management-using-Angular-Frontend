import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { PostService } from '../post-service';
import MyPost from '../MyPost';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import PostModel from './model/PostModel';
@Component({
  imports: [NgxPaginationModule,FormsModule],
  selector: 'app-post',
  styleUrl: './post.css',
  templateUrl: './post.html',
})
export class Post implements OnInit {
  public myModel = new PostModel("","");
  public updateDeleteBtnVisible:boolean = false;
  public totalRecords:number=0;
  public startLinkIndex:number=1;
  public allPosts:MyPost[]=[];
  private postService = inject(PostService);
  private cd = inject(ChangeDetectorRef);
  private userActive :any ="";
  populate(){
     if(!localStorage.getItem("USER-ID")){
         alert("Please login to View This Page");
         window.location.href="/users";
     }else{
          this.userActive = localStorage.getItem("NAME");
          this.postService.getAllPosts()
          .subscribe((posts:MyPost[])=>{
           console.log(posts);
           this.allPosts = posts;
           //console.log(this.allPosts);
           this.allPosts = this.allPosts.filter((post)=> post.user_id == localStorage.getItem('USER-ID'));
           console.log(this.allPosts);
           this.totalRecords = this.allPosts.length;
           this.cd.detectChanges();
      })
        }
     
      
  }
  logout(){
       localStorage.clear();
       alert("You have successfully Logged Out");
       window.location.href='/users';
  }
  ngOnInit(): void {
      this.populate();
  }
  onSubmit(event:SubmitEvent){
    event.preventDefault();
    console.log(this.myModel);
    let dataToSubmit:MyPost = {
      title : this.myModel.title,
      description: this.myModel.desc,
      user_id: localStorage.getItem("USER-ID")?.toString()
     
    };
    this.postService.addPost<MyPost>(dataToSubmit)
    .subscribe((res:MyPost)=>{
          console.log(res);
          if(!res){
            alert("Unable to Add Post");
          }else{
            alert("New Post Added Successfully");
            this.populate();
          }
    })
  }
  public posID:any ="";
  showPost(id:any){
    console.log(id);
    this.postService.getPost(id)
    .subscribe((res:MyPost)=>{
      console.log(res);
      this.myModel = new PostModel(res.title,res.description);
      this.posID = res.id;
      this.updateDeleteBtnVisible = true;
      this.cd.detectChanges();
    })
  }
  updatePost(){
    console.log(this.posID);
     console.log(this.myModel); 
     let dataToUpdate:MyPost = {
      title : this.myModel.title,
      description: this.myModel.desc,
      user_id: localStorage.getItem("USER-ID")?.toString()
     };
     this.postService.updatePost(this.posID,dataToUpdate)
     .subscribe((res:MyPost)=>{
        if(!res) alert("Error while Update");
        else {
          alert("Post Updated successfully");
          this.populate();
        }
     })
  }
  deletePost(){
    console.log(this.posID);
    var r = confirm("Do You want to Delete This Record ?");
    if(r){
      this.postService.deletePost(this.posID)
      .subscribe((res:MyPost)=>{
        if(!res) alert("Error while deleting post");
        else{
          alert("Post Deleted successfully");
          this.populate();
        }
      })
    }
  }

}
