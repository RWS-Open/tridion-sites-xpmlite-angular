import { NgStyle } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  imports: [],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class Chatbot {
  toggleChatbot = signal(false)
  onChatbotClick() {
    this.toggleChatbot.update(value => !value)
  }
}
