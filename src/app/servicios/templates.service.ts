import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apisMiFirma, environment } from 'src/environments/environment';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'ChannelAuthorization': `Basic ${environment.BasicToken}`
    })
};

const httpOptions2 = () => ({
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
    })
});

const httpOptions4 = () => ({
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'ChannelAuthorization': `Basic ${environment.BasicToken}`,
    'TokenCustomer': 'Bearer ' + localStorage.getItem("token")
  })
});

@Injectable({
    providedIn: 'root'
})

export class TemplatesService {
    constructor(private httpClient: HttpClient) { }

    associateAnots(arrayAnots: Array<any>, idTemplate: number) {
        const data = {
            associateParameter: arrayAnots,
            templateId: idTemplate
        }
        return this.httpClient.post(apisMiFirma.templatesGateway + `gateway/v1_0/Parameter/Associate`, data, httpOptions2());
    }

    disassociateAnots(arrayAnots: Array<any>) {
        const httpOptions3 = () => ({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }),
            body:{
                parameterId:arrayAnots
            }
        });

        return this.httpClient.delete(apisMiFirma.templatesGateway + `gateway/v1_0/Parameter/Disassociate`, httpOptions3());
    }

    getAllParameters(idTemplate: number) {
        return this.httpClient.get(apisMiFirma.templatesGateway + `gateway/v1_0/Parameter/GetAllParameters/${idTemplate}`, httpOptions2());
    }

    getAllTemplates(page:number,word?:string) {
        if(word){
            return this.httpClient.get(apisMiFirma.templatesGateway + `gateway/v1_0/Template/GetAllTemplates?page=${page}&pageSize=50&name=${word}`, httpOptions2());
        }else{
            return this.httpClient.get(apisMiFirma.templatesGateway + `gateway/v1_0/Template/GetAllTemplates?page=${page}&pageSize=50`, httpOptions2());
        }
    }

    getTemplate(idTemplate: number){
        return this.httpClient.get(apisMiFirma.templatesGateway + `gateway/v1_0/Template/GetTemplateById/${idTemplate}`, httpOptions2());
    }

    createTemplate(nameTemplate: string, base64Template: string) {
        const data = {
            name: nameTemplate,
            base64: base64Template
        }
        return this.httpClient.post(apisMiFirma.templatesGateway + `gateway/v1_0/Template/CreateTemplate`, data, httpOptions2());
    }

    updateTemplate(nameTemplate: string, base64Template: string, idTemplate: number) {
        const data = {
            name: nameTemplate,
            base64: base64Template,
            templateId: idTemplate

        }
        return this.httpClient.put(apisMiFirma.templatesGateway + `gateway/v1_0/Template/UpdateTemplate`, data, httpOptions2());
    }

    deleteTemplate(idTemplate: number) {
        const httpOptions3 = () => ({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }),
            body:{
                templateId:idTemplate
            }
        });
        return this.httpClient.delete(apisMiFirma.templatesGateway + `gateway/v1_0/Template/DeleteTemplate/`, httpOptions3());
    }

    getCsvTemplate(idTemplate: number) {
      return this.httpClient.get(apisMiFirma.MassiveGateway + `gateway/v1_0/Massive/GetCsvTemplate/${idTemplate}`, httpOptions4());
    }

    uploadFileMassive(base64Template: string, idTemplate: number) {
      const data = {
        base64File: base64Template,
        templateId: idTemplate
      }
      return this.httpClient.post(apisMiFirma.MassiveGateway + `gateway/v1_0/Massive/ReadCsv`, data, httpOptions4());
    }

}
