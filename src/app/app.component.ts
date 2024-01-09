import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UserStoreModule } from './store/user-store.module';
import { IUser } from './interfaces/user.interface';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { getUsers, updateUser, updateUserSuccess } from './store/user.action';
import { selectUserIsLoading, selectUsersList } from './store/user.selector';
import {MatExpansionModule} from '@angular/material/expansion'
import {MatTableDataSource, MatTableModule} from '@angular/material/table'
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatExpansionModule, MatTableModule, MatInputModule, MatFormFieldModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
    users$!: Observable<IUser[]>;
    isLoading$!: Observable<boolean>;
    displayedColumns: string[] = ['id', 'firstName', 'lastName', 'age', 'gender'];
    dataSource: MatTableDataSource<IUser> = new MatTableDataSource<IUser>([]);
    userList:IUser[]=[];
    saving: boolean = false;

    constructor(private store: Store) {
    }

    ngOnInit(): void {
        this.initDispatch();
        this.initSubscriptions();
        this.users$.subscribe((users: IUser[]) => {
          console.log(users)
          this.dataSource.data = _.cloneDeep(users);
          this.userList = _.cloneDeep(users);
        });
    }

    onUpdateUser(user: IUser, $event:Event): void {    
        this.saving = true;
        $event.preventDefault();
        setTimeout(() => {
          const uservalue:IUser = this.userList.filter((a:IUser)=> a.id == user.id)[0]
          this.store.dispatch(updateUserSuccess({user:uservalue}));
          this.saving = false;
        }, 1000);
        
    }

    Cancel(user:IUser, $event:Event):void {
      $event.preventDefault();
      const uservalue:IUser = this.dataSource.data.filter((a:IUser)=> a.id == user.id)[0]
      this.store.dispatch(updateUserSuccess({user:uservalue}));
    }

    onValueChange(id:number, property:string, $event:any){
      const updatedUserIndex = this.userList.findIndex((user:IUser) => user.id === id);
      if (updatedUserIndex !== -1) {
        if(property === 'firstname'){
          this.userList[updatedUserIndex].firstName = $event;
        }
        if(property === 'lastname'){
          this.userList[updatedUserIndex].lastName = $event;
        }
        if(property === 'age'){
          this.userList[updatedUserIndex].age = $event;
        }
        if(property === 'gender'){
          this.userList[updatedUserIndex].gender = $event;
        }  
      }
    }

    private initDispatch(): void {
        this.store.dispatch(getUsers());
    }

    private initSubscriptions(): void {
        this.users$ = this.store.pipe(select(selectUsersList));
        this.isLoading$ = this.store.pipe(select(selectUserIsLoading));
    }

    
}
