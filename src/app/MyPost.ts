type MyPost={
    post_id?:number,
    id?:string,
    title:string,
    description:string
    readonly user_id?:string,
}
export default MyPost;