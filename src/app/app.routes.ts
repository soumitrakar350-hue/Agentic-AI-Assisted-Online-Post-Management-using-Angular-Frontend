import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:"",
        redirectTo:"users",
        pathMatch:"full"
    },
    {path:"users",
     loadComponent:()=>import("./users/users").then((u)=>u.Users)   
    },
    {
        path:"posts",
        loadComponent:()=>import("./post/post").then((p)=>p.Post)
    },
    {
        path:"chatbot",
        loadComponent:()=>import("./chatbot/chatbot").then((chat)=>chat.Chatbot)
    },
    {
        path:"**",
        loadComponent:()=>import("./page-not-found/page-not-found").then((p1)=>p1.PageNotFound)

    }
];
