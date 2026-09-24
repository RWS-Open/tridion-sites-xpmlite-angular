import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationService } from "../../state/headless-xpm-notification-service";
@Component({
  selector: 'app-notification',
  standalone: true,
  imports:[JsonPipe],
  templateUrl: "./notification.html",
  styleUrl:"./notification.css"
})
export class XpmNotification {
  protected readonly notificationService = inject(NotificationService);
}
