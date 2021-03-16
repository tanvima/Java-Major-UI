import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Course } from 'src/app/interface/course';
import { UserService } from '../user.service';

@Component({
  selector: 'app-mycourse',
  templateUrl: './mycourse.component.html',
  styleUrls: ['./mycourse.component.scss']
})
export class MycourseComponent implements OnInit {

  course:any
  userid=21
  commentFlag=false
  isLiked:boolean=false
  status:any=null
  form=new FormGroup({
    comment: new FormControl(''),
  });
  constructor(private us : UserService, private router:Router) { }

  ngOnInit(): void {
    this.us.getEnrollCourse(this.userid).subscribe((data)=>{
      this.course=data
   
       this.us.getLikeStatus(this.userid).subscribe((data1)=>{
         this.status=data1
        console.log(this.status);
      
        
      });
     
 
     })

    }

  

  gotoVideoList(courseid:any){
    this.router.navigate(['/videolist'],{ queryParams: {courseId:courseid}});
  }

  addComment(courseid:any){
    console.log(courseid)
    this.us.addComment(courseid,this.userid,this.form.value).subscribe(
      (data)=>{
        console.log("comment added")
        this.commentFlags()
        this.form.setValue({comment:""})
        this.ngOnInit()
      }
    )
  }

 Like(courseid:any){
 this.us.addLike(courseid,this.userid).subscribe((data)=>{
   this.status = data
   console.log(",,,,,,,,,,,,",this.status)
   this.status=null
   this.ngOnInit()
 })
 
 }

  commentFlags(){
    this.commentFlag=!this.commentFlag
  }

  delComment(id:any){
    this.us.deleteComment(id).subscribe((data)=>{
      console.log("comment deleted")
      this.ngOnInit()
    })
  }
}