import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  loginStatus = new BehaviorSubject<boolean>(false)
  username = new BehaviorSubject<any>(sessionStorage.getItem('username'))
  userrole= new BehaviorSubject<any>(sessionStorage.getItem('userrole'))
  userid= new BehaviorSubject<any>(sessionStorage.getItem('userid'))
  usertype= new BehaviorSubject<any>(sessionStorage.getItem('usertype'))
intialCart!:Observable<any>
  cartsize= new BehaviorSubject<any>(0)
  cartsizeupdate=this.cartsize.asObservable()
  useridupdate = this.userid.asObservable()

  constructor(private http: HttpClient) { 
  this.cartsizeupdate.subscribe((data)=>{
    this.intialCart=data
  })
  }

  updateCartSizeData(){
    this.useridupdate.subscribe((data)=>{
      this.getCartCourses(data).subscribe((data1) => {
        console.log("The cart data ",data1)
        this.cartsize.next(data1.length)
      })
    })
  }


  authneticate(username:string,password:string){
    return this.http.post("http://localhost:8080/auth/authenticate",{username,password})
    .pipe(
      map((userdata:any)=>{
        sessionStorage.setItem('username',userdata.username)
        sessionStorage.setItem('userrole',userdata.roles[0])
        sessionStorage.setItem('userid',userdata.id)
        sessionStorage.setItem('usertype',userdata.type)
        sessionStorage.setItem('token',userdata.token)


        this.loginStatus.next(true)
        this.username.next(sessionStorage.getItem('username'))
        this.userrole.next(sessionStorage.getItem('userrole'))
        this.userid.next(sessionStorage.getItem('userid'))
        this.usertype.next(sessionStorage.getItem('usertype'))

        return userdata
      }))
    
      }

      getCartCourses(userid:any): Observable<any>{
        return this.http.get(environment.baseUserUrl+"/user/getCartCourses/"+userid)
      }




      isLoggedIn(){
        let user = sessionStorage.getItem('username')
        return !(user===null)
      }
    
      logout(){
        this.loginStatus.next(false)
        sessionStorage.removeItem("username")
        sessionStorage.removeItem("userrole")
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("userid")
        sessionStorage.removeItem("usertype")
    
        this.username.next(null)
        this.userrole.next(null)
        this.loginStatus.next(false)
        this.userid.next(null)
        this.usertype.next(null)
        
      }
}
