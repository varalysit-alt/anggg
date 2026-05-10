import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/domains/services/admin.service';
import { Admin } from 'src/app/domains/modules/admin.model';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  admins: Admin[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.adminService.getAdmins().subscribe({
      next: (data) => {
        this.admins = data;
        console.log('Данные получены:', this.admins);
      },
      error: (err) => {
        console.error('Ошибка при загрузке админов:', err);
      }
    });
  }
}