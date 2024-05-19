import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { Employee } from './employee.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  // readonly baseURL = 'http://localhost:3000/api/employees/';
  // readonly baseURL = 'http://localhost:5287/api/emp/';
  url: string = environment.apiBaseUrl + '/emp'
  list: Employee[] = [];

  employeeForm = this.fb.group({
    empId: [0],
    fullName: ['', Validators.required],
    position: ['', Validators.required],
    location: [''],
    salary: ['', Validators.required],
  })

  fetchEmployeeList() {
    this.http.get(this.url)
      .pipe(catchError(this.errorHandler))
      .subscribe(data => {
        this.list = data as Employee[];
      })

  }


  postEmployee() {
    return this.http.post(this.url, this.employeeForm.value)
      .pipe(catchError(this.errorHandler))
  }

  putEmployee() {
    return this.http.put(this.url + this.employeeForm.get('empId')?.value, this.employeeForm.value)
      .pipe(catchError(this.errorHandler))
  }

  deleteEmployee(empId: number) {
    return this.http.delete(this.url + empId)
      .pipe(catchError(this.errorHandler))
  }


  private errorHandler(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}
