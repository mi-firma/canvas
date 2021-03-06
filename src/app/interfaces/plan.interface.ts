export interface IPlan {
  code: string;
  name: string;
  state: number;
  createBy: string;
  create: Date;
  update: Date;
  subscriptionsDto: ISubscription [];
  packageGroupDto: IPackageGroup;
  featuresDto: IFeatures [];
  servicesDto: IService [];

  // Added properties
  subscriptionsSelected: number;
}
export interface ISubscription {
  discount: number;
  price: number;
  tax: number;
  intervalCode: string;
}
export interface IPackageGroup {
  code: string;
  name: string;
  description: string;
}
export interface IFeatures {
  idFeature: number;
  title: string;
  description: string;
}
export interface IService {
  name: string;
  code: string;
  description: string;
  serviceType: IServiceType;
}
export interface IServiceType {
  unit: IUnit;
  numberOf: number;
  isUnlimited: boolean;
  isCumulative: boolean;
}
export interface IUnit {
  name: string;
  code: string;
}
interface IProducto {
  productoCantidad: number;
  productoId: number;
  productoNombre: string;
  productoValorTotal: number;
}