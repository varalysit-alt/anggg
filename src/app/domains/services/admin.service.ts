import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Admin } from '../modules/admin.model';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  getAdmins(): Observable<Admin[]> {
    // Получаем всех пользователей
    return this.userService.getAllUsers().pipe(
      switchMap(users => {
        // Для каждого пользователя получаем его роли
        const rolesRequests = users.map(user =>
          this.userService.getUserRoles(user.userId).pipe(
            map(roles => ({ user, roles }))
          )
        );
        return forkJoin(rolesRequests);
      }),
      map(usersWithRoles => {
        // Фильтруем: оставляем только тех, у кого в ролях есть 'admin'
        const adminUsers = usersWithRoles
          .filter(item => item.roles.includes('admin'))
          .map(item => item.user);
        
        // Преобразуем UserRegister в Admin
        return adminUsers.map(user => ({
          admin_id: Number(user.userId),
          admin_login: user.userLogin,
          is_active_admin: user.userEnabled,
          admin_birth_date: null,  
          created_at: null
        }));
      })
    );
  }
}
