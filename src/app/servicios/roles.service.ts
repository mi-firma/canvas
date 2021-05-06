import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apisMiFirma, environment } from 'src/environments/environment';


const httpOptions = () => ({
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("token")
  })
});


@Injectable({
  providedIn: 'root'
})

export class RolesService {
  constructor(private httpClient: HttpClient) { }

  getIdCompanyByUser(username: string) {
    return this.httpClient.get(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/role/company/getByUser?username=${username}`, httpOptions());
  }

  getWorkGroups(id: string) {
    return this.httpClient.get(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/role/workGroup/getByCompanyId/${id}`, httpOptions());
  }

  addWorkGroup(companyId: number, nameGroup: string,) {
    const data = {
      companyId: companyId,
      name: nameGroup
    };
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/role/workGroup/create`, data, httpOptions());
  }

  editWorkGroup(idGroup: number, nameGroup: string, companyId: number) {
    const data = {
      id: idGroup,
      name: nameGroup,
      companyId: companyId
    };
    return this.httpClient.put(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/role/workGroup/update`, data, httpOptions());
  }

  deleteWorkGroup(companyId: number, idGroup: number) {
    const httpOptions2 = () => ({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }),
      body: {
        workgroupId: idGroup,
        companyId: companyId
      }
    });
    return this.httpClient.delete(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/role/workGroup/deleteByCompanyId`, httpOptions2());
  }

  listUsersByCompany(companyId: string) {
    return this.httpClient.get(apisMiFirma.RolesGateway + `gateway/v1_0/Roles/Company/GetCompanyUser?companyId=${companyId}`, httpOptions());
  }

  addUserToWorkGroup(userId: number, workgroupId: number) {
    const data = {
      idUser: userId,
      idRole: 8,
      idWorkGroup: workgroupId
    }
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/role/workGroupUser/create`, data, httpOptions());
  }

  getUsersByWorkGroup(workgroupId: string, wordSearch: string) {
    if (wordSearch != '') {
      return this.httpClient.get(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/role/user/getUsersByWorkGroup?groupId=${workgroupId}&searchValue=${wordSearch}`, httpOptions());
    } else {
      return this.httpClient.get(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/role/user/getUsersByWorkGroup?groupId=${workgroupId}`, httpOptions());
    }
  }

  deleteUserByWorkGroup(userId: number, idRole:number,idGroup: number) {
    const httpOptions2 = () => ({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }),
      body: {
        idUser: userId,
        idRole: idRole,
        idWorkGroup: idGroup
      }
    });
    return this.httpClient.delete(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/role/workGroupUser/remove`, httpOptions2());
  }

  addRoleToUser(idUser:number,idRole:number){
    const data = {
      idCustomer: idUser,
      idRole: idRole
    }
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/role/role/addRoleToCustomer`, data, httpOptions());
  }

  changeRoleToUser(userId:number,idRole:number,idGroup:number){
    const data = {
      idUser: userId,
      idRole: idRole,
      idWorkGroup: idGroup
    }
    return this.httpClient.put(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/role/workGroupUser/updateRole`, data, httpOptions());
  }

  inviteUsers(nameManager:string,idGroup:number,idCompany:number,users:Array<any>){
    const data = {
      nombreManager: nameManager,
      workgroupId: idGroup,
      companyId: idCompany,
      invitados: users
    }
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/role/workGroup/invite`, data, httpOptions());
  }

  addUserToCompany(idHasRole:number,idCompany:number){
    const data = {
      companyId: idCompany,
      customerHasRolId: idHasRole
    }
    return this.httpClient.post(apisMiFirma.GatewayMiFirma + `Gateway/api/v1_0/role/company/addUser`, data, httpOptions());
  }


}
