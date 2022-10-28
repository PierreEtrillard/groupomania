import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from '../models/user.model';
import { environment } from '../../environments/environment'
const apiUrl = environment.apiUrl
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  catchResponse: any
  httpOptions: any = {
    mode: 'cors',
    withCredentials: true,
    credentials: "include"
  }
  constructor(private http: HttpClient, private router: Router) { }

  newUser(user: User) {
    return this.http.post<{ message: string }>(`${apiUrl}/auth/signin`, user)
  }
  login(logData: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/auth/login`, logData, this.httpOptions)
  }
  logout() {
    return this.http.post(`${apiUrl}/auth/logout`, this.httpOptions).pipe(
      tap(() => {
        document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        localStorage.clear()
        this.router.navigate(['login']);
      }
      ),
      catchError((err) => {
        console.error(err)
        return of()
      }))
  }

  getUserProfile(): Observable<any> {
    return this.http.get<User>(`${apiUrl}/auth/profile/one`, this.httpOptions).pipe(
      catchError((err) => {
        console.error(err)
        return of()
      }))
  }
  getAllProfiles(): Observable<any> {
    return this.http.get<User>(`${apiUrl}/auth/profile/all`, this.httpOptions).pipe(
      catchError((err) => {
        console.error(err)
        return of()
      }))
  }
  updateUser(userUpdated: FormData) {
    console.log(`Mise à jour de l'utilisateur:  ${JSON.stringify(userUpdated)} envoyé à ${apiUrl}/auth/update`);
    return this.http.post<User>(`${apiUrl}/auth/update`, userUpdated,this.httpOptions).pipe(
      tap(
        (res) => console.log(res)
      ),
      catchError((err) => {
        console.error(err)
        return of()
      }))
  }
}
