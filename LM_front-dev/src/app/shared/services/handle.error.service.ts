import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { Status } from '../enum/action.enum';
import { TimeoutError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HandleErrorService {

  constructor(private messageService: NotificationService, private router: Router) { }

  handleError(error: any): void {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client error occurred - ${error.error.message}`;
      this.messageService.show(errorMessage, "error");
    } else if(error instanceof TimeoutError){
      this.messageService.show("Serveur non disponible", "error");
    } 
    else {
      if (error.error.status === Status.UNAUTHORIZED) {
        this.messageService.show(error.error.message, "error");
        this.router.navigate(['/auth']);
      } else if (error.error.status === Status.ACCESS_DENIED) {
        this.messageService.show(error.error.message, "warning");
      } else if (error.status === 0) {
        this.messageService.show("ressource non disponible", "error");
      }
      else {
        this.messageService.show(error.error.message, "error");
      }
    }
  }

}
