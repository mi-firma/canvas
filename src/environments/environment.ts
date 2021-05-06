// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  reconoserClientId: 'miFirma',
  reconoserClientSecret: 'M1f1rm@P@$$w0rd',
  appInsights: {
    instrumentationKey: '8276e443-a23d-4ad5-9967-71f22f030c86'
  },
  IsReconoserEnabled: false,
  IsGoogleAnalyticsEnabled: false,
  BasicToken: "MDJDQ0VFQkEtMTE1Mi00MkY3LThEMUEtREYxREJDRjRBRjA2OjAyMzEyRkU3LTQ5MDUtNEQ1Qy1BQ0I1LTUyQTQ2QzYxMzE5NQ==",
  CatalogBasicToken: "bWlmaXJtYTpNaWZpcm1hMTIzKg==",
  UrlApi: "https://api.mifirma.co/",
  PortalDeveloper: "https://developers.mifirma.co/",
  tokenAPI: "Basic QXp1cmVBcGlNYW5hZ2VyOkB6dXIzQHAxbUBuQGczcg==",
  ClienIdOneDrive: "1ac183b1-de41-4b1f-a9cb-14d426985799"
};

export const apisMiFirma = {
  GatewayMiFirma: "https://olsrvpruwbce01:6741/",
  GatewayFirma: "https://olsrvpruwbce01:6597/",
  Gateway: "https://olsrvpruwbce01:6595/",
  ApiManager: "https://olsrvpruwbce01:6594/",
  templatesGateway: "https://olsrvpruwbce01:6743/",
  MassiveGateway: "https://olsrvpruwbce01:6745/",
  BaseUrlGateWayMiFirma: "http://localhost:63763/",
  CatalogGateway: 'https://localhost:44363/',
  authGateway: 'https://localhost:44361/',
  RolesGateway: 'https://olsrvpruwbce01:6744/'
}
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
