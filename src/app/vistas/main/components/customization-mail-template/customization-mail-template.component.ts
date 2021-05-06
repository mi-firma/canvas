import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PersonaMailConfig } from 'src/app/modelos/personaMailConfig.model';
import { CustomizationMailServiceService } from '../../../../servicios/customization.mail.service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoaderService } from '../../../../core/services/loader.service';

@Component({
  selector: 'app-customization-mail-template',
  templateUrl: './customization-mail-template.component.html',
  styleUrls: ['./customization-mail-template.component.css']
})
export class CustomizationMailTemplateComponent implements OnInit {

  public initialModel: PersonaMailConfig;
  public tempImage: string;
  public color = '#685f5f';
  public settingColor: boolean;
  public actionColorPicker: string;
  public formTemplateMail: FormGroup;

  constructor(
    private service: CustomizationMailServiceService,
    private toast: ToastrService,
    private loaderService: LoaderService
  ) {
    this.initialModel = new PersonaMailConfig();
    this.loadForm(this.initialModel);
    this.settingColor = false;
  }


  ngOnInit() {
    this.getModel();
  }

  /** Obtiene la platilla de correo para el usuario en sesión */
  getModel() {
    this.service.GetPersonaMailConfig().subscribe((data: any) => {

      console.log(data);
      if (data.status_code === 200 && data) {
        const model = (data.data as PersonaMailConfig);
        this.tempImage = model.logo;
        this.loadForm(model);
      } else if (data.status_code === 204) {
        this.toast.warning(data.message);
      } else {
        this.toast.error('Ocurrio un error consultando los datos iniciales, por favor intenta de nuevo.');
      }

    }, (error) => {
      this.toast.error('Ocurrio un error consultando los datos iniciales, por favor intenta de nuevo.');
      console.log(error);
    });

    this.tempImage = null;
    this.settingColor = false;
  }

  public loadForm(model: PersonaMailConfig) {
    this.formTemplateMail = new FormGroup({
      id: new FormControl(model.id),
      idPersona: new FormControl(model.idPersona),
      logo: new FormControl(model.logo, Validators.required),
      colorBase: new FormControl({value: model.colorBase, disabled: true}, [Validators.required, Validators.maxLength(7)]),
      colorSecundario: new FormControl({value: model.colorSecundario, disabled: true}, [Validators.required, Validators.maxLength(7)]),
      footer: new FormControl(model.footer, [Validators.required, Validators.maxLength(200)] )
    });
  }

  /**
   * Carga la imagen del usuario validando que sea una imagen de tipo PNG o JPG y de maximo 100KB de peso
   * @param event trae la imagen selecionada por el usuario en el input de tipo file
   */
  loadIamgeLogo(event: any) {
    try {
      if (event.target.files && event.target.files.length > 0) {

        const file = event.target.files[0];
        const reader = new FileReader();
        if (file.type.indexOf("image") < 0) {
          this.toast.warning('Solo se permite la carga de imagenes en formato JPG y PNG.');
          return;
        }

        const extension = file.name.split('.').pop();
        if (extension !== "JPG" && extension !== "jpg" && extension !== "PNG" && extension !== "png") {
          this.toast.warning('Solo se permite la carga de imagenes en formato JPG y PNG.');
          return;
        }

        console.log(file);
        if (file.size > 100000) {
          this.toast.warning('Por favor carga una imagen que no exceda de 100KB.');
          return;
        }
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          this.tempImage = (reader.result as string);
          this.formTemplateMail.controls['logo'].setValue(reader.result as string);
        };
      }
    }
    catch (ex) {
      console.log(ex);
    }
  }

  /**
   * hace visible la paleta de colores para personalizar la plantilla
   * @param action campo del modelo que se se va establecer color
   */
  openColorPicker(action: string) {
    this.actionColorPicker = action;
    this.settingColor = true;
  }

  /**
   * Metodo que se ejecuta cada vez que el usuario cambia el color en la paleta de colores
   * @param event trae la información del color seleccionado por el usuario
   */
  onChangeColorComplete(event: any) {
    try {
      this.formTemplateMail.controls[this.actionColorPicker].setValue(event.color.hex);
    } catch (error) {
      console.log(error);
    }
  }

  saveChanges() {
    if (this.formTemplateMail.get('id').value === null) {
      this.AddPersonaMailConfig();
    } else {
      this.UpdatePersonaMailConfig();
    }
  }

  AddPersonaMailConfig() {
    this.loaderService.startLoading();
    this.service.AddPersonaMailConfig(this.formTemplateMail.getRawValue()).subscribe((data) => {
      console.log(data);
      this.validateChanges(data);
    }, (error) => {
      this.loaderService.stopLoading();
      this.toast.error('Error al guardar, por favor intenta de nuevo.');
    });
  }

  UpdatePersonaMailConfig() {
    this.loaderService.startLoading();
    this.service.UpdatePersonaMailConfig(this.formTemplateMail.getRawValue()).subscribe((data) => {
      console.log(data);
      this.validateChanges(data);
    }, (error) => {
      this.loaderService.stopLoading();
      this.toast.error('Error al guardar, por favor intenta de nuevo.');
    });
  }

  private validateChanges(data: any) {
    this.loaderService.stopLoading();
    if (data.status_code === 200) {
      this.formTemplateMail.controls['id'].setValue(data.data);
      this.toast.success('Guardo correctamente');
    } else {
      this.toast.error('Error al guardar, por favor intenta de nuevo.');
    }
  }

  public deleteTemplate() {
    const idTemplate = this.formTemplateMail.get('id').value;
    if (idTemplate === null || idTemplate === undefined) {
      this.toast.error('No se guardado una plantilla, para poder eliminarla.');
    }

    this.loaderService.startLoading();
    this.service.DeletePersonaMailConfig(idTemplate).subscribe((data: any) => {

      this.loaderService.stopLoading();

      if (data.status_code === 200) {
        this.loadForm(this.initialModel);
      } else if (data.status_code === 204) {
        this.toast.warning(data.message);
      } else {
        this.toast.error('Ocurrio un error eliminado la plantilla, por favor intenta de nuevo.');
      }

    }, (error) => {
      this.loaderService.stopLoading();
      this.toast.error('Error al guardar, por favor intenta de nuevo.');
    });
  }
}
